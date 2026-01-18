
import { UserData, WeeklyPlan } from '../types';

export const generatePlan = async (userData: UserData, targetCalories: number): Promise<WeeklyPlan> => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const apiEndpoint = isLocal ? '/api/ai' : `${window.location.origin}/api/ai`;

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: userData,
        targetCalories
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al generar el plan. Por favor, intenta de nuevo.');
    }

    const data = await response.json();
    
    if (!data.days || !Array.isArray(data.days)) {
      throw new Error('Formato de respuesta inválido de la IA');
    }

    return {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      targetCalories,
      days: data.days
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
