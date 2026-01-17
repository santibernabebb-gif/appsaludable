/**
 * Limpia y valida una cadena de texto para intentar convertirla en un objeto JSON válido.
 */
function parseAndRepairJSON(text) {
  if (!text) return null;
  
  // 1. Quitar fences de markdown
  let cleaned = text.replace(/```json\n?|```/g, "").trim();
  
  // 2. Extraer solo el bloque del objeto (del primer { al último })
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  
  if (start === -1 || end === -1) return null;
  cleaned = cleaned.substring(start, end + 1);
  
  // 3. Normalizar comillas y limpiar comas colgantes
  cleaned = cleaned
    .replace(/[\u201C\u201D]/g, '"') // Comillas inteligentes/tipográficas
    .replace(/,\s*([}\]])/g, '$1'); // Comas antes de cerrar llaves o corchetes
    
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
}

/**
 * Realiza una llamada de emergencia a Gemini para intentar reparar un JSON roto.
 */
async function callRepairIA(brokenText, apiKey) {
  const payload = {
    contents: [{ 
      parts: [{ 
        text: `Corrige y devuelve SOLO JSON válido (sin texto extra). Repara este contenido para que sea JSON estricto:\n\n${brokenText}` 
      }] 
    }],
    generationConfig: {
      temperature: 0, // Mínima variabilidad para corrección técnica
      maxOutputTokens: 4000,
      responseMimeType: "application/json"
    }
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000)
    }
  );

  if (!response.ok) return null;
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

export async function onRequestPost(context) {
  const { env } = context;
  const apiKey = env.API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "API_KEY no configurada." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { userData, targetCalories } = await context.request.json();

  const fastingMap = {
    '12-20': "Ayuno 16:8 (Ventana 12h-20h).",
    '9-17': "Ayuno 16:8 (Ventana 09h-17h)."
  };

  const fastingMsg = fastingMap[userData.fastingType] || "";
  const seed = Math.floor(Math.random() * 9999);

  const prompt = `Nutricionista: Dieta Mediterránea, 7 días (Lun-Dom), ${userData.diet}, ${targetCalories}kcal. ${fastingMsg} Variedad máxima (ID:${seed}).`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
      maxOutputTokens: 4000,
      responseSchema: {
        type: "OBJECT",
        required: ["days"],
        properties: {
          days: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              required: ["day", "totalCalories", "meals", "waterGoal"],
              properties: {
                day: { type: "STRING" },
                totalCalories: { type: "NUMBER" },
                waterGoal: { type: "STRING" },
                meals: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    required: ["name", "type", "time", "ingredients", "instructions", "calories"],
                    properties: {
                      name: { type: "STRING" },
                      type: { type: "STRING" },
                      time: { type: "STRING" },
                      ingredients: { type: "ARRAY", items: { type: "STRING" } },
                      instructions: { type: "ARRAY", items: { type: "STRING" } },
                      calories: { type: "NUMBER" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  const MAX_RETRIES = 4;
  const INITIAL_DELAY = 1000;

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(30000)
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        
        // 1. Intentar parseo normal con limpieza
        let parsed = parseAndRepairJSON(rawText);
        
        // 2. Si falla, intentar una reparación vía IA (solo una vez)
        if (!parsed) {
          console.warn("JSON fallido, intentando reparación con IA...");
          const repairedText = await callRepairIA(rawText, apiKey);
          parsed = parseAndRepairJSON(repairedText);
        }
        
        if (parsed) {
          return new Response(JSON.stringify(parsed), {
            headers: { "Content-Type": "application/json" },
          });
        } else {
          return new Response(
            JSON.stringify({ error: "Respuesta IA malformada. Reintenta." }),
            { status: 502, headers: { "Content-Type": "application/json" } }
          );
        }
      }

      if (response.status === 503 || response.status === 429) {
        const delay = INITIAL_DELAY * Math.pow(2, i) + Math.random() * 300;
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      const errorText = await response.text();
      return new Response(JSON.stringify({ error: `IA Error ${response.status}` }), { 
        status: response.status, 
        headers: { "Content-Type": "application/json" } 
      });

    } catch (e) {
      if (i === MAX_RETRIES - 1) break;
      await new Promise(r => setTimeout(r, INITIAL_DELAY * Math.pow(2, i)));
    }
  }

  return new Response(
    JSON.stringify({ error: "Servicio temporalmente saturado. Reintenta en 1 min." }),
    { status: 503, headers: { "Content-Type": "application/json" } }
  );
}