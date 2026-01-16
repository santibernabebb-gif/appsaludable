
import { GoogleGenAI } from "@google/genai";

export async function onRequestPost(context) {
  const { env } = context;
  const apiKey = env.API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "API_KEY no configurada en Cloudflare." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { userData, targetCalories } = await context.request.json();
    const ai = new GoogleGenAI({ apiKey });

    let fastingInstruction = "";
    if (userData.fastingType === '12-20') {
      fastingInstruction = "IMPORTANTE: El usuario realiza AYUNO INTERMITENTE 16:8 (Ventana 12:00h a 20:00h). Todas las comidas deben ocurrir estrictamente en ese horario.";
    } else if (userData.fastingType === '9-17') {
      fastingInstruction = "IMPORTANTE: El usuario realiza AYUNO INTERMITENTE 16:8 (Ventana 09:00h a 17:00h). Todas las comidas deben ocurrir estrictamente en ese horario.";
    }

    const prompt = `
      Actúa como un Nutricionista Colegiado experto en Dieta Mediterránea. 
      Genera un plan de alimentación detallado para 7 días completos (Lunes a Domingo).
      
      PERFIL DE USUARIO:
      - Objetivo Calórico: ${targetCalories} kcal/día (Margen +/- 5%).
      - Tipo de Dieta: ${userData.diet}.
      - Alergias/Intolerancias: ${userData.allergies || 'Ninguna'}.
      - Alimentos a evitar: ${userData.dislikedFoods || 'Ninguno'}.
      - Presupuesto: ${userData.budget} (ajusta ingredientes según esto).
      - Tiempo de cocina: ${userData.cookingTime}.
      - ${fastingInstruction}

      REGLAS DE RESPUESTA:
      1. Solo responde con el objeto JSON solicitado.
      2. No incluyas lista de la compra global, ya que los ingredientes van en cada comida.
      3. Asegura que los platos sean variados y apetecibles.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
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
                      required: ["name", "type", "time", "ingredients", "instructions", "calories", "prepTime"],
                      properties: {
                        name: { type: "STRING" },
                        type: { type: "STRING" },
                        time: { type: "STRING" },
                        ingredients: { type: "ARRAY", items: { type: "STRING" } },
                        instructions: { type: "ARRAY", items: { type: "STRING" } },
                        calories: { type: "NUMBER" },
                        prepTime: { type: "STRING" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    return new Response(response.text, {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error en Function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error procesando el plan." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
