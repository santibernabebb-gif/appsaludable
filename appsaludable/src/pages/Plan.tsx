
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeeklyPlanResponse, UserData } from '../types';
import { Calendar, ChevronRight, Info, Utensils } from 'lucide-react';

const Plan: React.FC = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<WeeklyPlanResponse | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingBlock, setLoadingBlock] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedPlan = sessionStorage.getItem('weeklyPlan');
    const savedUser = sessionStorage.getItem('userData');
    if (!savedPlan || !savedUser) {
      navigate('/');
      return;
    }
    setPlan(JSON.parse(savedPlan));
    setUserData(JSON.parse(savedUser));
  }, [navigate]);

  const generateRecipes = async (dayIndices: number[]) => {
    if (!plan || !userData) return;
    
    if (!dayIndices || !Array.isArray(dayIndices) || dayIndices.length === 0) {
      setError("No se han seleccionado días válidos.");
      return;
    }

    setLoadingBlock(dayIndices[0]);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    try {
      const res = await fetch('/api/recipes-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userData,
          plan: plan.plan,
          targetDays: dayIndices
        }),
        signal: controller.signal
      });

      const data = await res.json();

      if (!res.ok) { 
        throw new Error(data?.error || `HTTP ${res.status}: Inténtalo de nuevo`); 
      }

      // El backend ahora devuelve el recipesMap directamente.
      // Se elimina la validación Array.isArray(data.days) para coincidir con el nuevo formato.
      if (!data || typeof data !== 'object') {
        throw new Error("Respuesta inválida del servidor");
      }

      // Merge new recipes into session storage
      const existingRecipes = JSON.parse(sessionStorage.getItem('recipes') || '{}');
      const updatedRecipes = { ...existingRecipes, ...data };
      sessionStorage.setItem('recipes', JSON.stringify(updatedRecipes));
      
      navigate('/recipes');
    } catch (err: any) {
      console.error("Frontend Error:", err);
      const isTimeout = err.name === 'AbortError';
      setError(isTimeout ? 'La generación está tardando demasiado. Reintenta de nuevo.' : (err.message || 'Error generando recetas con IA'));
    } finally {
      clearTimeout(timeoutId);
      setLoadingBlock(null);
    }
  };

  if (!plan) return null;

  const blocks = [
    { label: 'Días 1 y 2', indices: [0, 1] },
    { label: 'Días 3 y 4', indices: [2, 3] },
    { label: 'Días 5 y 6', indices: [4, 5] },
    { label: 'Día 7', indices: [6] },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tu Plan Nutricional</h1>
          <p className="text-gray-600">Basado en tus objetivos: <span className="font-semibold text-emerald-600">{plan.targetCalories} kcal diarias</span></p>
        </div>
        <div className="flex gap-2">
          <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">TDEE: {plan.tdee} kcal</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {blocks.map((block) => (
          <div key={block.label} className="card flex flex-col justify-between hover:border-emerald-300 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-4 text-emerald-600">
                <Calendar className="w-5 h-5" />
                <h3 className="font-bold text-lg">{block.label}</h3>
              </div>
              <ul className="space-y-3 mb-6">
                {block.indices.map(idx => (
                  <li key={idx} className="text-sm text-gray-700">
                    <span className="font-medium">Día {idx + 1}:</span> {plan.plan[idx]?.meals?.find(m => m.type === 'comida')?.title || 'No disponible'}
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => generateRecipes(block.indices)}
              disabled={loadingBlock !== null}
              className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loadingBlock === block.indices[0] ? (
                <span className="flex items-center gap-2 animate-pulse">Generando...</span>
              ) : (
                <>Ver Recetas e IA <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Utensils className="w-6 h-6 text-emerald-600" /> Resumen de la Semana
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {plan.plan.map((day, idx) => (
            <div key={idx} className="bg-white border rounded-lg p-4 text-center">
              <p className="text-xs font-bold text-emerald-600 uppercase mb-2">Día {idx + 1}</p>
              <p className="text-sm font-medium text-gray-800 leading-tight">{day.meals?.find(m => m.type === 'comida')?.title || 'No asignado'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plan;
