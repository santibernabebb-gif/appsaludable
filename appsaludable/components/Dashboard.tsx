import React, { useState } from 'react';
import { WeeklyPlan, UserData } from '../types';

interface Props {
  plan: WeeklyPlan;
  userData: UserData;
  nutrition: any;
  onFinishWeek: () => void;
}

const Dashboard: React.FC<Props> = ({ plan, userData, nutrition, onFinishWeek }) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const handlePrint = () => {
    window.print();
  };

  const getFastingLabel = () => {
    switch(userData.fastingType) {
      case '12-20': return "12:00-20:00";
      case '9-17': return "09:00-17:00";
      default: return "Tradicional";
    }
  };

  const currentDay = plan.days[activeDayIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 animate-fade-in">
      {/* SECCIÓN VISIBLE (Dashboard interactivo) */}
      <div className="bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 no-print">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight tracking-tight">Tu Plan Semanal</h2>
          <p className="text-xs md:text-sm text-slate-600 font-bold italic mt-1 uppercase tracking-wider">Plan personalizado de 7 días.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handlePrint} 
            className="flex-1 md:flex-none bg-white px-5 py-3 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center justify-center gap-3 group"
          >
            <svg className="w-5 h-5 text-slate-500 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span className="text-slate-600 group-hover:text-emerald-700 font-black text-sm uppercase tracking-tight">Imprimir plan</span>
          </button>
          <button 
            onClick={onFinishWeek}
            className="flex-1 md:flex-none bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-sm md:text-base shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 transform active:scale-95 uppercase tracking-tight"
          >
            Nuevo Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 no-print">
        <StatCard label="Meta" value={`${nutrition.target} kcal`} sub="diarias" color="emerald" />
        <StatCard label="Dieta" value={userData.diet === 'omnivoro' ? 'De todo' : 'Vegetal'} sub="estilo" color="slate" />
        <StatCard label="Gasto" value={`${nutrition.tdee} kcal`} sub="base diaria" color="slate" />
        <StatCard label="Régimen" value={getFastingLabel()} sub="horario" color="emerald" />
      </div>

      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar no-print">
        {plan.days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => setActiveDayIndex(idx)}
            className={`px-4 py-2.5 rounded-xl font-black text-xs md:text-sm transition-all whitespace-nowrap border-2 ${
              activeDayIndex === idx 
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-500 hover:text-emerald-600'
            }`}
          >
            {day.day}
          </button>
        ))}
      </div>

      <div className="no-print">
        <DayView day={currentDay} />
      </div>

      {/* ÁREA DE IMPRESIÓN */}
      <div id="print-area" className="hidden">
        <div className="p-8 space-y-8">
          <div className="border-b-4 border-emerald-600 pb-6 mb-8 text-center">
            <h1 className="text-4xl font-black text-slate-800">SantiSystems: Adelgaza Saludable</h1>
            <p className="text-emerald-600 font-black uppercase tracking-[0.2em] text-sm mt-3">Plan Nutricional de {userData.weight}kg</p>
            <div className="flex justify-center gap-8 mt-5 text-slate-600 font-bold">
              <span>Objetivo: {nutrition.target} kcal</span>
              <span>Dieta: {userData.diet}</span>
              <span>Régimen: {getFastingLabel()}</span>
            </div>
          </div>

          {plan.days.map((day, idx) => (
            <div key={idx} className="day-header">
              <DayView day={day} isPrintMode={true} />
            </div>
          ))}
          
          <div className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-500 text-xs italic font-bold">
            Plan generado por Santisystems. 
            IMPORTANTE: Este plan es orientativo basado en criterios AESAN. Consulta con un profesional médico para seguimiento clínico.
          </div>
        </div>
      </div>
    </div>
  );
};

const DayView: React.FC<{ day: any, isPrintMode?: boolean }> = ({ day, isPrintMode }) => (
  <div className={`bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden ${isPrintMode ? 'shadow-none border-slate-100' : ''}`}>
    <div className="bg-emerald-600 p-4 md:p-8 text-white flex justify-between items-center">
      <div className="space-y-1">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100">Plan Diario Nutricional</span>
        <h2 className="text-xl md:text-3xl font-black uppercase">{day.day}</h2>
      </div>
      <div className="text-right">
        <span className="bg-white/20 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-sm md:text-xl font-black border border-white/30 inline-block">{day.totalCalories} kcal</span>
        <p className="text-[10px] font-black text-emerald-100 mt-2 uppercase tracking-[0.1em]">Agua: {day.waterGoal}</p>
      </div>
    </div>
    
    <div className="p-4 md:p-10 space-y-6 md:space-y-10">
      {day.meals.map((meal: any, mIdx: number) => (
        <div key={mIdx} className="meal-section border-b-2 border-slate-50 last:border-0 pb-6 md:pb-10 last:pb-0">
          <div className="flex justify-between items-start gap-4 mb-4 md:mb-5">
            <div>
              <div className="flex items-center gap-3 mb-1.5 md:mb-2">
                <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest">{meal.type}</span>
                <span className="text-slate-600 font-black text-[10px] md:text-xs uppercase">{meal.time}</span>
              </div>
              <h3 className="text-lg md:text-2xl font-black text-slate-800 leading-tight">{meal.name}</h3>
            </div>
            <span className="text-slate-600 font-black text-xs md:text-sm whitespace-nowrap">{meal.calories} kcal</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-100">
              <h4 className="text-[10px] md:text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3 md:mb-4 border-b border-slate-200 pb-2">Ingredientes</h4>
              <ul className="text-xs md:text-sm text-slate-800 space-y-1.5 md:space-y-2 font-semibold">
                {meal.ingredients.map((ing: string, i: number) => <li key={i} className="flex gap-2"><span className="text-emerald-600 font-bold">•</span> {ing}</li>)}
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="text-[10px] md:text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3 md:mb-4 border-b border-slate-50 pb-2">Instrucciones de Cocina</h4>
              <div className="space-y-2.5 md:space-y-3">
                {meal.instructions.map((ins: string, i: number) => (
                  <div key={i} className="flex gap-3 md:gap-4">
                    <span className="bg-emerald-50 text-emerald-700 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center font-black text-[9px] md:text-[10px] shrink-0 border border-emerald-100">{i+1}</span>
                    <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-semibold">{ins}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StatCard: React.FC<any> = ({ label, value, sub, color }) => (
  <div className="bg-white p-3 md:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
    <p className="text-[9px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1 md:mb-2">{label}</p>
    <div>
      <h4 className={`text-lg md:text-2xl font-black text-${color}-600 leading-tight`}>{value}</h4>
      <p className="text-[9px] md:text-[10px] text-slate-500 font-black italic mt-0.5 uppercase tracking-wider">{sub}</p>
    </div>
  </div>
);

export default Dashboard;