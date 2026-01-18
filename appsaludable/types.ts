
export type View = 'welcome' | 'onboarding' | 'dashboard' | 'history';

export interface UserData {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'heavy';
  goal: 'lose' | 'maintain' | 'gain';
  dietType: 'mediterranean' | 'vegetarian' | 'vegan';
  fasting: 'none' | '16:8_morning' | '16:8_evening';
  allergies: string;
}

export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  calories: number;
  prepTime: number; // in minutes
}

export interface DayPlan {
  day: string;
  meals: {
    breakfast?: Recipe;
    snack1?: Recipe;
    lunch: Recipe;
    snack2?: Recipe;
    dinner?: Recipe;
  };
  totalCalories: number;
}

export interface WeeklyPlan {
  id: string;
  date: string;
  targetCalories: number;
  days: DayPlan[];
}

export interface AppState {
  view: View;
  user: UserData | null;
  activePlan: WeeklyPlan | null;
  history: WeeklyPlan[];
}
