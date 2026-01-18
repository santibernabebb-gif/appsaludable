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

    // quitar fences ```json ... ```
    s = s.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();

    // si viene como string JSON (entre comillas) con escapes
    try {
      const maybe = JSON.parse(s);
      if (typeof maybe === "string") s = maybe.trim();
    } catch (_) {
      // ok, seguimos
    }

    // quedarnos solo con el primer objeto { ... } grande
    const start = s.indexOf("{");
    const end = s.lastIndexOf("}");
    if (start >= 0 && end > start) s = s.slice(start, end + 1).trim();

    // eliminar comas finales antes de } o ] que rompen el JSON.parse estándar
    s = s.replace(/,\s*([}\]])/g, "$1");

    return s;
  }

  function isValidRecipesMap(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
    // Debe ser un mapa donde las claves son los índices de los días
    for (const [dayKey, meals] of Object.entries(obj)) {
      if (!meals || typeof meals !== "object" || Array.isArray(meals)) return false;

      for (const [mealType, recipe] of Object.entries(meals)) {
        if (!recipe || typeof recipe !== "object") return false;
        if (typeof recipe.title !== "string" || !recipe.title.trim()) return false;
        // Validamos que existan arrays de ingredientes e instrucciones
        if (!Array.isArray(recipe.ingredients)) return false;
        if (!Array.isArray(recipe.instructions)) return false;
      }
    }
    return true;
  }

  try {
    const body = await context.request.json();
    const { userData, plan, targetDays } = body || {};

    if (!userData || !plan) {
      return jsonResponse({ error: "Faltan userData o plan en la petición." }, 400);
    }

    if (!Array.isArray(targetDays) || targetDays.length === 0) {
      return jsonResponse({ error: "No se proporcionaron días válidos (targetDays)." }, 400);
    }

    // Construimos una petición más ligera para evitar timeouts y mejorar la precisión
    const mealRequests = targetDays
      .map((idx) => {
        const dayPlan = plan?.[idx];
        if (!dayPlan?.meals?.length) return "";
        return `Día ${idx + 1} (índice "${idx}"):\n` + dayPlan.meals.map((m) => `- ${m.type}: ${m.title}`).join("\n");
      })
      .filter(Boolean)
      .join("\n\n");

    const prompt = `
Eres un nutricionista y cocinero experto de España.

DATOS USUARIO:
- Edad: ${userData.age}
- Sexo: ${userData.sex}
- Alergias: ${userData.allergies || "ninguna"}

PLATOS A GENERAR (solo estos días):
${mealRequests}

REGLAS:
- Idioma: Español de España (usa "patatas", "judías", "AOVE").
- Ingredientes: Productos comunes de supermercado español (Mercadona, Carrefour, Lidl, etc.).
- Estilo: Recetas realistas, sencillas, caseras y saludables.
- Formato: Devuelve ÚNICAMENTE el objeto JSON.

FORMATO JSON OBLIGATORIO:
{
  "0": {
    "desayuno": {
      "title": "Nombre del plato",
      "ingredients": ["ingrediente 1", "ingrediente 2"],
      "instructions": ["paso 1", "paso 2"],
      "tips": "Consejo opcional"
    },
    "comida": { ... },
    "cena": { ... }
  }
}

IMPORTANTE:
- Las claves del objeto deben ser exactamente los índices del plan: ${targetDays.map(String).join(", ")}.
- Asegúrate de que el JSON esté completo y no se corte.
`.trim();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 85000);

    // Usamos gemini-3-flash-preview por ser el más rápido y fiable para generación de JSON estructurado
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2500, // Aumentado significativamente para evitar que el JSON se corte
          responseMimeType: "application/json"
        },
      }),
    });

    clearTimeout(timeout);

    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      console.error("Gemini HTTP error:", resp.status, errText);
      return jsonResponse({ error: `Error de la API de Gemini: ${resp.status}` }, 502);
    }

    const data = await resp.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    let rawText = "";
    for (const p of parts) if (p?.text) rawText += p.text;

    if (!rawText || !rawText.trim()) {
      return jsonResponse({ error: "La IA devolvió una respuesta vacía. Por favor, reintenta." }, 502);
    }

    const cleaned = sanitizeToJsonString(rawText);

    let recipesMap;
    try {
      recipesMap = JSON.parse(cleaned);
    } catch (e) {
      console.error("Error al parsear JSON de Gemini:", e);
      console.log("Raw text que falló:", rawText.slice(0, 500));
      return jsonResponse({ error: "Respuesta IA malformada. Reintenta el bloque para completarla." }, 502);
    }

    if (!isValidRecipesMap(recipesMap)) {
      console.error("Estructura de JSON inválida:", JSON.stringify(recipesMap).slice(0, 500));
      return jsonResponse({ error: "La IA generó un formato incorrecto. Reintenta el bloque." }, 502);
    }

    // Devolvemos el mapa de recetas directamente para que el frontend lo integre en el estado
    return jsonResponse(recipesMap, 200);
  } catch (error) {
    const isTimeout = error?.name === "AbortError";
    console.error("Error en recipes-generate:", error);
    return jsonResponse(
      { error: isTimeout ? "La generación ha tardado demasiado (timeout). Reintenta este bloque." : "Error interno en el servidor de recetas." },
      isTimeout ? 504 : 500
    );
  }
}
