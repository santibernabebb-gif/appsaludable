
import { UserData, WeeklyPlan } from "../types";

export const generatePlan = async (userData: UserData, targetCalories: number): Promise<WeeklyPlan> => {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userData, targetCalories }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Error al generar el plan. Inténtalo de nuevo.");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Servicio de Plan fallido:", error);
    throw error;
  }
};
