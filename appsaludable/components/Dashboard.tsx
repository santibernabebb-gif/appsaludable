
import React from 'react';
import { WeeklyPlan, UserData, Meal, DailyPlan } from '../types';

interface Props {
  plan: WeeklyPlan;
  userData: UserData;
  nutrition: any;
  onFinishWeek: () => void;
}

const Dashboard: React.FC<Props> = ({ plan, userData, nutrition, onFinishWeek }) => {
  const getFastingLabel = () => {
    switch(userData.fastingType) {
      case '12-20': return "Ventana 12:00-20:00";
      case '9-17': return "Ventana 09:00-17:00";
      default: return "Horario Tradicional";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in px-4">
      
      {/* CABECERA DE CONTROL WEB */}
      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tu Plan Semanal</h2>
          <p className="text-slate-500 font-medium italic">Todo el contenido disponible para tu seguimiento diario.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={onFinishWeek}
            className="flex-grow md:flex-none bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
          >
            Finalizar Semana
          </button>
        </div>
      </div>

      {/* RESUMEN RÁPIDO */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Meta" value={`${nutrition.target} kcal`} sub="diarias" color="emerald" />
        <StatCard label="Dieta" value={userData.diet} sub="estilo" color="slate" />
        <StatCard label="Gasto" value={`${nutrition.tdee} kcal`} sub="estimado" color="slate" />
        <StatCard label="Régimen" value={userData.fastingType !== 'none' ? 'Ayuno 16:8' : 'Tradicional'} sub={getFastingLabel()} color="emerald" />
      </div>

      {/* LISTADO DE DÍAS */}
      <div className="space-y-12">
        {plan.days.map((day, idx) => (
          <div key={idx} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50 overflow-hidden">
            <div className="bg-emerald-600 p-8 text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black text-emerald-200 uppercase tracking-widest">Día {idx + 1} de 7</span>
                <h2 className="text-3xl font-black">{day.day}</h2>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-emerald-100 italic mb-1">Hidratación: {day.waterGoal}</p>
                <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-xl font-black border border-white/20">{day.totalCalories} kcal</span>
              </div>
            </div>
            
            <div className="p-8 md:p-12 space-y-12">
              {day.meals.map((meal, mIdx) => (
                <div key={mIdx} className="meal-section">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">{meal.type}</span>
                        <span className="text-slate-400 font-bold text-xs">{meal.time}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800">{meal.name}</h3>
                    </div>
                    <span className="text-slate-400 font-black text-sm">{meal.calories} kcal</span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Ingredientes</h4>
                      <ul className="text-sm text-slate-600 space-y-2">
                        {meal.ingredients.map((ing, i) => <li key={i} className="flex gap-2"><span>•</span> {ing}</li>)}
                      </ul>
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Instrucciones</h4>
                      <div className="grid gap-3">
                        {meal.instructions.map((ins, i) => (
                          <div key={i} className="flex gap-4">
                            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs shrink-0">{i+1}</span>
                            <p className="text-sm text-slate-600 leading-relaxed">{ins}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* LISTA DE COMPRA FINAL */}
        <div className="bg-slate-900 text-white p-10 md:p-16 rounded-[3rem]">
          <h2 className="text-3xl font-black mb-8">🛒 Lista de la Compra</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4">
            {plan.shoppingList.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2 border-b border-slate-800 text-sm">
                <div className="w-4 h-4 border-2 border-slate-700 rounded shrink-0"></div>
                <span className="text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<any> = ({ label, value, sub, color }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <div>
      <h4 className={`text-2xl font-black text-${color}-600`}>{value}</h4>
      <p className="text-[10px] text-slate-400 mt-0.5 font-bold italic">{sub}</p>
    </div>
  </div>
);

export default Dashboard;
