
import React, { useState } from 'react';
import { UserData, WeeklyPlan, DayPlan, Recipe } from '../types';

interface Props {
  user: UserData;
  plan: WeeklyPlan | null;
  onNewPlan: () => void;
  onViewHistory: () => void;
}

const Dashboard: React.FC<Props> = ({ user, plan, onNewPlan, onViewHistory }) => {
  const [selectedDay, setSelectedDay] = useState(0);

  if (!plan) return null;

  const currentDayPlan = plan.days[selectedDay];

  const handlePrint = () => {
    window.print();
  };

  const Branding = () => (
    <div className="no-print mb-4">
      <p className="text-sm font-bold text-primary-700 leading-none">AdelgazaSaludable</p>
      <p className="text-[10px] text-gray-400 font-medium">SantiSystems</p>
    </div>
  );

  const FooterAESAN = () => (
    <footer className="mt-12 pt-8 border-t border-gray-200 w-full text-center pb-12 max-w-4xl mx-auto">
      <p className="text-[11px] text-gray-400 leading-relaxed italic">
        Estas recetas siguen estrictamente las directrices nutricionales de la <span className="font-bold text-gray-500">AESAN</span>. 
        IA supervisada para garantizar planes realistas, saludables y seguros.
      </p>
      <p className="text-[10px] text-gray-300 mt-4 font-medium uppercase tracking-widest">SantiSystems 2026</p>
    </footer>
  );

  const MealCard = ({ title, recipe }: { title: string, recipe?: Recipe }) => {
    if (!recipe) return null;
    return (
      <div className="recipe-card bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 transition-all hover:shadow-md">
        <div className="flex flex-wrap justify-between items-start mb-4">
          <h4 className="text-sm font-bold text-primary-600 uppercase tracking-wider">{title}</h4>
          <div className="flex space-x-3 text-xs font-medium text-gray-400">
            <span>🔥 {recipe.calories} kcal</span>
            <span>⏱️ {recipe.prepTime} min</span>
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">{recipe.name}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2">Ingredientes:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2">Preparación:</p>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
              {recipe.instructions.map((step, i) => <li key={i} className="pl-1">{step}</li>)}
            </ol>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - No print */}
      <header className="no-print bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col">
            <Branding />
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h1 className="text-lg font-extrabold text-gray-900">Plan Nutricional</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={onViewHistory} className="px-3 py-2 text-sm font-semibold text-gray-600 hover:text-primary-600 transition-colors">Historial</button>
            <button onClick={onNewPlan} className="px-3 py-2 text-sm font-semibold bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors">Nuevo Plan</button>
            <button onClick={handlePrint} className="px-3 py-2 text-sm font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all flex items-center shadow-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              Imprimir
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {/* User Info Card - No print */}
        <div className="no-print bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-4 font-bold text-xl uppercase shadow-inner">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm text-gray-500">Plan para <span className="font-bold text-gray-900">{user.name}</span></p>
              <p className="text-xs text-gray-400 italic">Basado en directrices AESAN</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-8">
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Meta Diaria</p>
              <p className="text-2xl font-black text-gray-900">{plan.targetCalories} <span className="text-sm font-normal text-gray-500">kcal</span></p>
            </div>
          </div>
        </div>

        {/* Bloque Informativo de Calorías */}
        <div className="no-print bg-primary-50 p-6 rounded-2xl border border-primary-100 mb-8 fade-in">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-primary-800 text-sm md:text-base font-medium leading-relaxed">
              Según tus datos, tu cuerpo necesita aproximadamente <span className="font-bold text-primary-900">{plan.targetCalories} kcal</span> al día. 
              Este plan está diseñado para ajustarse a ese objetivo.
            </p>
          </div>
        </div>

        {/* Day Selector - No print */}
        <div className="no-print mb-8 flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
          {plan.days.map((d, i) => (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className={`flex-shrink-0 px-6 py-3 rounded-xl font-bold transition-all ${selectedDay === i ? 'bg-primary-600 text-white shadow-lg scale-105' : 'bg-white text-gray-500 border border-gray-100 hover:border-primary-300'}`}
            >
              {d.day}
            </button>
          ))}
        </div>

        {/* Current Day View */}
        <div className="no-print fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900">{currentDayPlan.day}</h2>
            <p className="text-sm font-semibold text-primary-600">Total: {currentDayPlan.totalCalories} kcal</p>
          </div>
          
          <MealCard title="Desayuno" recipe={currentDayPlan.meals.breakfast} />
          <MealCard title="Media Mañana" recipe={currentDayPlan.meals.snack1} />
          <MealCard title="Comida" recipe={currentDayPlan.meals.lunch} />
          <MealCard title="Merienda" recipe={currentDayPlan.meals.snack2} />
          <MealCard title="Cena" recipe={currentDayPlan.meals.dinner} />
        </div>

        {/* Print Only View */}
        <div className="hidden print:block print-container">
          <div className="mb-6 text-left">
            <p className="text-sm font-bold text-primary-700 leading-none">AdelgazaSaludable</p>
            <p className="text-[10px] text-gray-400 font-medium">SantiSystems</p>
          </div>
          <h1 className="text-3xl font-black text-center mb-4">Plan Nutricional Semanal</h1>
          <p className="text-center mb-4 text-gray-900 font-bold">Usuario: {user.name} | Objetivo: {plan.targetCalories} kcal</p>
          <p className="text-center mb-8 text-gray-600 italic text-sm">Este plan ha sido generado siguiendo estrictamente las recomendaciones de la AESAN.</p>
          
          {plan.days.map((day, dIdx) => (
            <div key={dIdx} className="page-break">
              <h2 className="text-2xl font-bold border-b-2 border-primary-500 pb-2 mb-6 mt-8">{day.day}</h2>
              <div className="space-y-6">
                {day.meals.breakfast && <MealCard title="Desayuno" recipe={day.meals.breakfast} />}
                {day.meals.snack1 && <MealCard title="Media Mañana" recipe={day.meals.snack1} />}
                {day.meals.lunch && <MealCard title="Comida" recipe={day.meals.lunch} />}
                {day.meals.snack2 && <MealCard title="Merienda" recipe={day.meals.snack2} />}
                {day.meals.dinner && <MealCard title="Cena" recipe={day.meals.dinner} />}
              </div>
              <p className="text-right font-bold mt-4">Calorías diarias estimadas: {day.totalCalories} kcal</p>
            </div>
          ))}

          <footer className="mt-8 text-center border-t pt-4">
            <p className="text-[10px] text-gray-400 italic">Generado por AdelgazaSaludable de SantiSystems. Supervisión AESAN activa para garantizar planes de salud reales.</p>
            <p className="text-[9px] text-gray-300 mt-1 font-medium uppercase tracking-widest">SantiSystems 2026</p>
          </footer>
        </div>

        <FooterAESAN />
      </main>
    </div>
  );
};

export default Dashboard;
