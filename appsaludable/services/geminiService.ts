
import { UserData, WeeklyPlan } from "../types";

/**
 * IMPORTANTE: Para la versión APK, necesitamos una URL absoluta ya que 'localhost' 
 * en el móvil no apunta a internet. Hemos configurado la URL de producción proporcionada.
 */
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? '' 
  : 'https://appsaludable.pages.dev'; 

export const generatePlan = async (userData: UserData, targetCalories: number): Promise<WeeklyPlan> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userData, targetCalories }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 429) throw new Error("Límite de peticiones alcanzado. Inténtalo en unos minutos.");
      throw new Error(errorData.error || "No se pudo conectar con el servicio de nutrición.");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error en geminiService (APK/Web):", error);
    // Si falla la URL absoluta en web por CORS (poco probable en Pages), reintentar con relativa
    if (API_BASE_URL !== '' && window.location.hostname !== 'localhost') {
        try {
            const retryResponse = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userData, targetCalories }),
            });
            if (retryResponse.ok) return await retryResponse.json();
        } catch(e) {
            console.error("Fallo reintento relativo");
        }
    }
    throw error;
  }
};
