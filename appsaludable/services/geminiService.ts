
import { UserData, WeeklyPlan } from "../types";

export const generatePlan = async (userData: UserData, targetCalories: number): Promise<WeeklyPlan> => {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userData, targetCalories }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 429) throw new Error("Límite de peticiones alcanzado. Espera un momento.");
      throw new Error(errorData.error || "Error al conectar con el nutricionista digital.");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error en geminiService (Client):", error);
    throw error;
  }
};
