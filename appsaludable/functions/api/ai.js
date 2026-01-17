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

  // Prompt optimizado: instrucciones directas para reducir tokens de entrada
  const prompt = `Nutricionista: Dieta Mediterránea, 7 días (Lun-Dom), ${userData.diet}, ${targetCalories}kcal. ${fastingMsg} Variedad máxima (ID:${seed}).`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1, // Mayor determinismo y ahorro de tokens en correcciones
      maxOutputTokens: 2000, // Límite de seguridad para evitar consumo excesivo
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
          signal: AbortSignal.timeout(30000) // Timeout de seguridad de 30s
        }
      );

      if (response.ok) {
        const data = await response.json();
        return new Response(data.candidates?.[0]?.content?.parts?.[0]?.text, {
          headers: { "Content-Type": "application/json" },
        });
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