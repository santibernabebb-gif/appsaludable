
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipesResponse } from '../types';
import { ArrowLeft, ChefHat, ShoppingBag, ListChecks } from 'lucide-react';

const Recipes: React.FC = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<RecipesResponse | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('recipes');
    if (!saved) {
      navigate('/plan');
      return;
    }
    setRecipes(JSON.parse(saved));
  }, [navigate]);

  if (!recipes) return null;

  // Extract shopping list (crude extraction)
  const getAllIngredients = () => {
    const list: string[] = [];
    Object.values(recipes).forEach(day => {
      Object.values(day).forEach(recipe => {
        list.push(...recipe.ingredients);
      });
    });
    // Deduplicate somewhat
    return Array.from(new Set(list));
  };

  const ingredients = getAllIngredients();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate('/plan')}
        className="mb-8 flex items-center gap-2 text-emerald-600 font-medium hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al plan semanal
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-emerald-600" /> Recetas Generadas
          </h1>

          {Object.entries(recipes).sort().map(([dayIdx, meals]) => (
            <div key={dayIdx} className="space-y-8">
              <h2 className="text-xl font-bold border-b pb-2 text-emerald-800">Día {Number(dayIdx) + 1}</h2>
              {Object.entries(meals).map(([type, recipe]) => (
                <div key={type} className="card border-l-4 border-l-emerald-500">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{recipe.title}</h3>
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded uppercase tracking-wider">{type}</span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-sm text-emerald-700 mb-2 uppercase flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" /> Ingredientes
                      </h4>
                      <ul className="text-sm space-y-1 text-gray-700 list-disc list-inside">
                        {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-emerald-700 mb-2 uppercase flex items-center gap-1">
                        <ListChecks className="w-3 h-3" /> Preparación
                      </h4>
                      <ol className="text-sm space-y-2 text-gray-700 list-decimal list-inside">
                        {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                      </ol>
                    </div>
                  </div>
                  {recipe.tips && (
                    <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-xs italic rounded">
                      <strong>Tip:</strong> {recipe.tips}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="card bg-gray-900 text-white sticky top-24">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-emerald-400" /> Lista de la Compra
            </h3>
            <p className="text-xs text-gray-400 mb-4 italic">Ingredientes necesarios para estos días.</p>
            <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {ingredients.map((item, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2 border-b border-gray-800 pb-2">
                  <div className="w-4 h-4 rounded border border-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => window.print()}
              className="w-full mt-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors text-sm"
            >
              Imprimir Recetas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipes;
