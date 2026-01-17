
export async function onRequestPost(context) {
  const { env } = context;
  const apiKey = env.API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Configuración incompleta: API_KEY no encontrada en el servidor." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { userData, targetCalories } = await context.request.json();

  let fastingInstruction = "";
  if (userData.fastingType === '12-20') {
    fastingInstruction = "IMPORTANTE: El usuario realiza AYUNO INTERMITENTE 16:8 (Ventana 12:00h a 20:00h).";
  } else if (userData.fastingType === '9-17') {
    fastingInstruction = "IMPORTANTE: El usuario realiza AYUNO INTERMITENTE 16:8 (Ventana 09:00h a 17:00h).";
  }

  const randomSeed = Math.floor(Math.random() * 1000000);
  const prompt = `Actúa como Nutricionista Colegiado experto en Dieta Mediterránea. Genera un plan de 7 días (Lunes-Domingo) para ${userData.diet} de ${targetCalories} kcal. ${fastingInstruction} Varía los platos (Semilla: ${randomSeed}).`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
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

  // Implementación de Reintentos (Exponential Backoff)
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
        }
      );

      if (response.ok) {
        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return new Response(textResponse, {
          headers: { "Content-Type": "application/json" },
        });
      }

      // Si es error de saturación o cuota, reintentamos
      if (response.status === 503 || response.status === 429) {
        const delay = INITIAL_DELAY * Math.pow(2, i) + Math.random() * 500;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // Otros errores (400, 401, etc) se devuelven directamente
      const errorMsg = await response.text();
      return new Response(
        JSON.stringify({ error: `Error de la IA (${response.status}): ${errorMsg}` }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );

    } catch (e) {
      if (i === MAX_RETRIES - 1) throw e;
      await new Promise((resolve) => setTimeout(resolve, INITIAL_DELAY * Math.pow(2, i)));
    }
  }

  return new Response(
    JSON.stringify({ error: "La IA está saturada tras varios intentos. Por favor, inténtalo de nuevo en unos minutos." }),
    { status: 503, headers: { "Content-Type": "application/json" } }
  );
}
