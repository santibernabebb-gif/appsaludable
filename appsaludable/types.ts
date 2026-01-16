
export enum ActivityLevel {
  SEDENTARY = 'sedentario',
  LIGHT = 'ligera',
  MODERATE = 'moderada',
  HIGH = 'alta'
}

export enum DietPreference {
  OMNIVORE = 'omnivoro',
  VEGETARIAN = 'vegetariano'
}

export type FastingType = 'none' | '12-20' | '9-17';

export interface UserData {
  age: number;
  sex: 'male' | 'female';
  height: number;
  weight: number;
  activity: ActivityLevel;
  diet: DietPreference;
  allergies: string;
  dislikedFoods: string;
  mealsPerDay: number;
  fastingType: FastingType;
  budget: 'bajo' | 'medio' | 'alto';
  cookingTime: 'rapido' | 'normal';
}

export interface Meal {
  name: string;
  type: string;
  time: string;
  ingredients: string[];
  instructions: string[];
  calories: number;
  prepTime: string;
  alternatives: string[];
}

export interface DailyPlan {
  day: string;
  meals: Meal[];
  totalCalories: number;
  waterGoal: string;
}

export interface WeeklyPlan {
  id: string;
  date: string;
  days: DailyPlan[];
  shoppingList: string[];
}

export interface PlanHistoryEntry {
  id: string;
  date: string;
  plan: WeeklyPlan;
  userData: UserData;
}
