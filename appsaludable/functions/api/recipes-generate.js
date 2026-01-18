
export async function onRequestPost(context) {
  const GEMINI_API_KEY = context.env.GEMINI_API_KEY;

  const jsonResponse = (obj, status = 200) =>
    new Response(JSON.stringify(obj), {
      status,
      headers: { "Content-Type": "application/json" },
    });

  if (!GEMINI_API_KEY) {
    return jsonResponse({ error: "Falta GEMINI_API_KEY en el servidor." }, 500);
  }

  // ---- helpers ----
  function sanitizeToJsonString(raw) {
    let s = (raw || "").trim();
    if (!s) return "";

    // Eliminar bloques de código markdown
    s = s.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();

    // Buscar el primer '{' y el último '}' para extraer solo el objeto JSON
    const start = s.indexOf("{");
    const end = s.lastIndexOf("}");
    if (start >= 0 && end > start) {
      s = s.slice(start, end + 1).trim();
    }

    // Limpieza de caracteres de control y comas finales antes de cerrar llaves/corchetes
    s = s.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
    s = s.replace(/,\s*([}\]])/g, "$1");

    return s;
  }

  function isValidRecipesMap(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
    // Validar que al menos haya una clave numérica (el día) y que tenga estructura de recetas
    const keys = Object.keys(obj);
    if (keys.length === 0) return false;
    
    for (const dayKey of keys) {
      const meals = obj[dayKey];
      if (typeof meals !== 'object') return false;
      // Validamos una comida típica para confirmar estructura
      const firstMeal = Object.values(meals)[0];
      if (firstMeal && (!firstMeal.title || !Array.isArray(firstMeal.ingredients))) return false;
    }
    return true;
  }

  try {
    const body = await context.request.json();
    const { userData, plan, targetDays } = body || {};

    if (!userData || !plan || !Array.isArray(targetDays)) {
      return jsonResponse({ error: "Datos de petición incompletos." }, 400);
    }

    const mealRequests = targetDays
      .map((idx) => {
        const dayPlan = plan?.[idx];
        if (!dayPlan?.meals?.length) return "";
        return `Día ${idx + 1} (clave "${idx}"): ` + dayPlan.meals.map((m) => `${m.type}: ${m.title}`).join(", ");
      })
      .filter(Boolean)
      .join("\n");

    const prompt = `
Actúa como Nutricionista Senior de España. Genera recetas para estos platos:
${mealRequests}

Usuario: ${userData.age} años, ${userData.sex}, Alergias: ${userData.allergies || "Ninguna"}.

REGLAS:
- Español de España.
- Ingredientes de supermercado común.
- Devuelve SOLO un objeto JSON. NO incluyas explicaciones.

FORMATO:
{
  "${targetDays[0]}": {
    "comida": {
      "title": "...",
      "ingredients": ["...", "..."],
      "instructions": ["...", "..."],
      "tips": "..."
    }
  }
}
`.trim();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 85000);

    // Usamos el modelo estable 1.5 Pro en v1
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2500
        },
      }),
    });

    clearTimeout(timeout);

    if (!resp.ok) {
      return jsonResponse({ error: `Gemini Error: ${resp.status}` }, 502);
    }

    const data = await resp.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return jsonResponse({ error: "La IA no devolvió contenido." }, 502);
    }

    const cleaned = sanitizeToJsonString(rawText);
    let recipesMap;

    try {
      recipesMap = JSON.parse(cleaned);
    } catch (e) {
      console.error("JSON Parse Error. Raw:", rawText);
      return jsonResponse({ error: "Respuesta IA malformada. Por favor, reintenta este bloque." }, 502);
    }

    if (!isValidRecipesMap(recipesMap)) {
      return jsonResponse({ error: "Formato de receta inválido." }, 502);
    }

    return jsonResponse(recipesMap, 200);

  } catch (error) {
    const isTimeout = error?.name === "AbortError";
    return jsonResponse(
      { error: isTimeout ? "Timeout. La IA está saturada, reintenta." : "Error de conexión con el servidor." },
      isTimeout ? 504 : 500
    );
  }
}
