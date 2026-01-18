
export const STORAGE_KEYS = {
  USER: 'santi_user',
  ACTIVE_PLAN: 'santi_active_plan',
  HISTORY: 'santi_history'
};

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  heavy: 1.725
};

export const calculateTDEE = (
  gender: 'male' | 'female',
  weight: number,
  height: number,
  age: number,
  activity: keyof typeof ACTIVITY_MULTIPLIERS
): number => {
  // Mifflin-St Jeor Equation
  const bmr = gender === 'male' 
    ? (10 * weight) + (6.25 * height) - (5 * age) + 5
    : (10 * weight) + (6.25 * height) - (5 * age) - 161;
  
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activity]);
};

export const calculateTargetCalories = (tdee: number, goal: 'lose' | 'maintain' | 'gain'): number => {
  if (goal === 'lose') return tdee - 500;
  if (goal === 'gain') return tdee + 500;
  return tdee;
};
