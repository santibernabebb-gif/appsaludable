
import { GoogleGenAI, Type } from "@google/genai";
import { UserData, WeeklyPlan } from "../types";

export const generatePlan = async (userData: UserData, targetCalories: number): Promise<WeeklyPlan> => {
  // Inicialización dinámica para capturar siempre la clave más reciente (especialmente tras usar openSelectKey)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let fastingInstruction = "";
  if (userData.fastingType === '12-20') {
    fastingInstruction = "IMPORTANTE: El usuario realiza AYUNO INTERMITENTE 16:8 (Ventana 12:00h a 20:00h). Todas las comidas deben ocurrir estrictamente en ese horario.";
  } else if (userData.fastingType === '9-17') {
    fastingInstruction = "IMPORTANTE: El usuario realiza AYUNO INTERMITENTE 16:8 (Ventana 09:00h a 17:00h). Todas las comidas deben ocurrir estrictamente en ese horario.";
  } else {
    fastingInstruction = "El usuario sigue un horario tradicional libre de comidas.";
  }

  const prompt = `
    Actúa como un Nutricionista Colegiado en España. 
    Genera un plan de alimentación detallado para 7 días completos.
    
    PERFIL DE USUARIO:
    - Objetivo Calórico: ${targetCalories} kcal/día (±5%).
    - Tipo de Dieta: ${userData.diet}.
    - Alergias/Intolerancias: ${userData.allergies || 'Ninguna'}.
    - Alimentos a evitar: ${userData.dislikedFoods || 'Ninguno'}.
    - Presupuesto: ${userData.budget}.
    - Tiempo disponible para cocinar: ${userData.cookingTime}.
    - ${fastingInstruction}

    REGLAS DE RIGOR NUTRICIONAL:
    1. Basado estrictamente en la Dieta Mediterránea y la Estrategia NAOS (España).
    2. Usa ingredientes locales (aceite de oliva, legumbres, pescado, verduras frescas).
    3. Cada comida debe incluir la HORA RECOMENDADA coherente con el estilo de vida, ingredientes, instrucciones, calorías y tiempo de preparación.
    
    IMPORTANTE: Responde ÚNICAMENTE en formato JSON válido.
  `;

  try {
    // Usamos gemini-3-pro-preview para tareas complejas de planificación y razonamiento nutricional
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["days", "shoppingList"],
          properties: {
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["day", "totalCalories", "meals", "waterGoal"],
                properties: {
                  day: { type: Type.STRING },
                  totalCalories: { type: Type.NUMBER },
                  waterGoal: { type: Type.STRING },
                  meals: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["name", "type", "time", "ingredients", "instructions", "calories", "prepTime"],
                      properties: {
                        name: { type: Type.STRING },
                        type: { type: Type.STRING },
                        time: { type: Type.STRING },
                        ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                        instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        calories: { type: Type.NUMBER },
                        prepTime: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            },
            shoppingList: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const jsonStr = response.text?.trim();
    if (!jsonStr) throw new Error("La respuesta de la IA está vacía.");
    return JSON.parse(jsonStr);
  } catch (error: any) {
    console.error("Error en geminiService:", error);
    // Propagamos el error original para que App.tsx pueda identificar si es un 404 de API Key
    throw error;
  }
};
