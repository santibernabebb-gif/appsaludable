
export interface UserData {
  age: number;
  sex: 'hombre' | 'mujer';
  weight: number;
  height: number;
  activity: 'sedentario' | 'ligero' | 'moderado' | 'activo';
  goal: 'perder' | 'mantener' | 'ganar';
  allergies: string;
  healthConditions: {
    pregnancy: boolean;
    underage: boolean;
    diabetesTca: boolean;
    metabolicMeds: boolean;
  };
}

export interface Meal {
  title: string;
  type: 'desayuno' | 'snack1' | 'comida' | 'snack2' | 'cena';
  calories: number;
}

export interface DayPlan {
  day: string;
  meals: Meal[];
}

export interface WeeklyPlanResponse {
  tdee: number;
  targetCalories: number;
  plan: DayPlan[];
}

export interface RecipeDetail {
  title: string;
  ingredients: string[];
  instructions: string[];
  tips: string;
}

export interface RecipesResponse {
  [dayIndex: string]: {
    [mealType: string]: RecipeDetail;
  };
}
