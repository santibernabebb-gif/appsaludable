
export async function onRequestPost(context) {
  try {
    const userData = await context.request.json();
    const { age, sex, weight, height, activity, goal } = userData;

    // 1. Calculate BMR (Mifflin-St Jeor)
    let bmr;
    if (sex === 'hombre') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // 2. Activity Multiplier
    const multipliers = {
      sedentario: 1.2,
      ligero: 1.375,
      moderado: 1.55,
      activo: 1.725
    };
    const tdee = Math.round(bmr * (multipliers[activity] || 1.2));

    // 3. Goal Adjustment
    let targetCalories = tdee;
    if (goal === 'perder') targetCalories -= 500;
    else if (goal === 'ganar') targetCalories += 500;

    // 4. Base Plan Structure (Hardcoded logic for variety)
    const options = {
      desayuno: [
        "Tostadas con aceite de oliva y tomate", 
        "Gachas de avena con manzana y canela", 
        "Yogur griego con nueces y miel", 
        "Tortilla de claras con pavo"
      ],
      snack: [
        "Una pieza de fruta de temporada", 
        "Puñado de almendras naturales", 
        "Tortita de arroz con queso burgos", 
        "Bastones de zanahoria con hummus"
      ],
      comida: [
        "Lentejas estofadas con verduras", 
        "Pollo al ajillo con patatas asadas", 
        "Merluza al horno con espárragos", 
        "Ensalada de garbanzos y atún", 
        "Pasta integral con salsa de calabacín", 
        "Arroz con verduras y huevo escalfado",
        "Pechuga a la plancha con brócoli"
      ],
      cena: [
        "Crema de calabaza", 
        "Tortilla de patatas ligera (poca grasa)", 
        "Revuelto de espinacas y gambas", 
        "Salmón a la plancha con ensalada mixta", 
        "Pisto manchego con un huevo frito", 
        "Judías verdes con jamón",
        "Sopa de verduras y fideos"
      ]
    };

    const plan = Array.from({ length: 7 }, (_, i) => ({
      day: `Día ${i + 1}`,
      meals: [
        { type: 'desayuno', title: options.desayuno[i % options.desayuno.length], calories: Math.round(targetCalories * 0.20) },
        { type: 'snack1', title: options.snack[i % options.snack.length], calories: Math.round(targetCalories * 0.10) },
        { type: 'comida', title: options.comida[i], calories: Math.round(targetCalories * 0.35) },
        { type: 'snack2', title: options.snack[(i + 1) % options.snack.length], calories: Math.round(targetCalories * 0.10) },
        { type: 'cena', title: options.cena[i], calories: Math.round(targetCalories * 0.25) }
      ]
    }));

    return new Response(JSON.stringify({
      tdee,
      targetCalories,
      plan
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
