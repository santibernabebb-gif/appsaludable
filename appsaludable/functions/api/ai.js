
export async function onRequestPost(context) {
  const { env, request } = context;
  const apiKey = env.API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ message: "API Key not configured" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { user, targetCalories } = await request.json();

    const fastingRules = user.fasting === 'none' 
      ? "Incluye 5 comidas tradicionales: desayuno (08:30), media mañana (11:30), comida (14:30), merienda (17:30) y cena (21:00)."
      : user.fasting === '16:8_morning'
      ? "Sigue ayuno 16:8 (salta el desayuno). Ventana de alimentación de 12:00h a 20:00h. Incluye media mañana, comida, merienda y cena."
      : "Sigue ayuno 16:8 (salta la cena). Ventana de alimentación de 08:00h a 16:00h. Incluye desayuno, media mañana, comida y merienda.";

    const prompt = `Eres un nutricionista clínico experto de SantiSystems. Crea un plan semanal de 7 días para ${user.name}. 
    Objetivo: ${user.goal === 'lose' ? 'Pérdida de peso saludable' : user.goal === 'gain' ? 'Ganancia muscular' : 'Mantenimiento'}.
    Calorías diarias: ${targetCalories} kcal.
    
    REGLA DE ORO: Cumplimiento estricto de la AESAN. NO INVENTES recetas extrañas ni ingredientes procesados. Usa Dieta Mediterránea real.
    
    CONFIGURACIÓN DE HORARIOS:
    ${fastingRules}
    
    Alergias/Restricciones: ${user.allergies || 'Ninguna'}.
    
    RESPONDE EXCLUSIVAMENTE EN FORMATO JSON:
    {
      "days": [
        {
          "day": "Lunes",
          "meals": {
            "breakfast": { "name": "...", "ingredients": ["..."], "instructions": ["..."], "calories": 0, "prepTime": 0 },
            "snack1": { "name": "...", "ingredients": ["..."], "instructions": ["..."], "calories": 0, "prepTime": 0 },
            "lunch": { "name": "...", "ingredients": ["..."], "instructions": ["..."], "calories": 0, "prepTime": 0 },
            "snack2": { "name": "...", "ingredients": ["..."], "instructions": ["..."], "calories": 0, "prepTime": 0 },
            "dinner": { "name": "...", "ingredients": ["..."], "instructions": ["..."], "calories": 0, "prepTime": 0 }
          },
          "totalCalories": 0
        }
      ]
    }
    
    Importante: Si el usuario salta una comida por el ayuno, el campo correspondiente en el JSON debe ser null. 
    Asegúrate de que las recetas sean variadas y realistas.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.65
        }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(err, { status: response.status });
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;

    return new Response(resultText, {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
