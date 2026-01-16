
import { UserData, ActivityLevel } from '../types';

const ACTIVITY_FACTORS = {
  [ActivityLevel.SEDENTARY]: 1.2,
  [ActivityLevel.LIGHT]: 1.375,
  [ActivityLevel.MODERATE]: 1.55,
  [ActivityLevel.HIGH]: 1.725,
};

export const calculateNutrition = (data: UserData) => {
  // Mifflin-St Jeor
  let bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age;
  bmr = data.sex === 'male' ? bmr + 5 : bmr - 161;

  const tdee = bmr * ACTIVITY_FACTORS[data.activity];
  let target = tdee * 0.85; // 15% déficit

  const minAllowed = data.sex === 'male' ? 1500 : 1200;
  let warning = "";

  if (target < minAllowed) {
    target = minAllowed;
    warning = `Tu objetivo calculado era muy bajo. Se ha ajustado al mínimo de seguridad (${minAllowed} kcal) recomendado por Sanidad.`;
  }

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    target: Math.round(target),
    warning
  };
};
