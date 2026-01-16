
import React, { useState } from 'react';
import { WeeklyPlan, UserData } from '../types';
import { jsPDF } from "jspdf";

interface Props {
  plan: WeeklyPlan;
  userData: UserData;
  nutrition: any;
  onFinishWeek: () => void;
}

const Dashboard: React.FC<Props> = ({ plan, userData, nutrition, onFinishWeek }) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const getFastingLabel = () => {
    switch(userData.fastingType) {
      case '12-20': return "12:00-20:00";
      case '9-17': return "09:00-17:00";
      default: return "Tradicional";
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const emerald = [5, 150, 105];
    const slate = [30, 41, 59];
    
    doc.setFillColor(emerald[0], emerald[1], emerald[2]);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Adelgaza Saludable", 20, 25);
    doc.setFontSize(10);
    doc.text("by SantiSystems · Plan Personalizado", 20, 32);
    
    doc.setTextColor(slate[0], slate[1], slate[2]);
    doc.setFontSize(14);
    doc.text("Resumen del Perfil Nutricional", 20, 55);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Objetivo: ${nutrition.target} kcal/día`, 20, 65);
    doc.text(`Dieta: ${userData.diet}`, 20, 70);
    doc.text(`Régimen: ${userData.fastingType !== 'none' ? 'Ayuno 16:8' : 'Tradicional'} (${getFastingLabel()})`, 20, 75);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 80);
    
    let y = 95;
    plan.days.forEach((day, index) => {
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y - 5, 180, 12, 'F');
      doc.setTextColor(emerald[0], emerald[1], emerald[2]);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${day.day.toUpperCase()} - ${day.totalCalories} kcal`, 20, y + 3);
      y += 15;
      day.meals.forEach(meal => {
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setTextColor(slate[0], slate[1], slate[2]);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`${meal.type}: ${meal.name}`, 25, y);
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(`(${meal.calories} kcal)`, 170, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        const ingredients = meal.ingredients.join(", ");
        const splitIng = doc.splitTextToSize(`Ingredientes: ${ingredients}`, 160);
        doc.text(splitIng, 30, y);
        y += (splitIng.length * 4) + 2;
      });
      y += 10;
    });
    doc.save(`Plan_Saludable_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const currentDay = plan.days[activeDayIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* CABECERA DE CONTROL WEB */}
      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight tracking-tight">Tu Plan Semanal</h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium italic mt-1">Platos únicos y variados diseñados para ti.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={handleDownloadPDF} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-all flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </button>
          <button 
            onClick={onFinishWeek}
            className="flex-grow bg-emerald-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm md:text-base shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 transform active:scale-95"
          >
            Crear nuevo plan semanal
          </button>
        </div>
      </div>

      {/* RESUMEN RÁPIDO */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Meta" value={`${nutrition.target} kcal`} sub="diarias" color="emerald" />
        <StatCard label="Dieta" value={userData.diet} sub="estilo" color="slate" />
        <StatCard label="Gasto" value={`${nutrition.tdee} kcal`} sub="base diaria" color="slate" />
        <StatCard label="Régimen" value={getFastingLabel()} sub="horario" color="emerald" />
      </div>

      {/* NAVEGACIÓN POR DÍAS (PESTAÑAS) */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide no-scrollbar">
        {plan.days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => setActiveDayIndex(idx)}
            className={`px-5 py-3 rounded-xl font-bold text-xs md:text-sm transition-all whitespace-nowrap border-2 ${
              activeDayIndex === idx 
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200 hover:text-emerald-600'
            }`}
          >
            {day.day}
          </button>
        ))}
      </div>

      {/* CONTENIDO DEL DÍA SELECCIONADO */}
      <div key={activeDayIndex} className="animate-fade-in space-y-6">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-50 overflow-hidden">
          <div className="bg-emerald-600 p-6 md:p-8 text-white flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100 opacity-80">Menú del Día</span>
              <h2 className="text-2xl md:text-3xl font-black">{currentDay.day}</h2>
            </div>
            <div className="text-right">
              <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm md:text-lg font-black border border-white/20 inline-block">{currentDay.totalCalories} kcal</span>
              <p className="text-[10px] font-bold text-emerald-100 mt-2 uppercase tracking-widest">Agua: {currentDay.waterGoal}</p>
            </div>
          </div>
          
          <div className="p-6 md:p-10 space-y-10">
            {currentDay.meals.map((meal, mIdx) => (
              <div key={mIdx} className="meal-section border-b border-slate-50 last:border-0 pb-10 last:pb-0">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-wider">{meal.type}</span>
                      <span className="text-slate-400 font-bold text-xs">{meal.time}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">{meal.name}</h3>
                  </div>
                  <span className="text-slate-400 font-black text-sm md:text-base">{meal.calories} kcal</span>
                </div>

                <div className="grid md:grid-cols-3 gap-6 md:gap-10">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Ingredientes</h4>
                    <ul className="text-xs md:text-sm text-slate-600 space-y-2">
                      {meal.ingredients.map((ing, i) => <li key={i} className="flex gap-2"><span>•</span> {ing}</li>)}
                    </ul>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Instrucciones</h4>
                    <div className="grid gap-4">
                      {meal.instructions.map((ins, i) => (
                        <div key={i} className="flex gap-4">
                          <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs shrink-0">{i+1}</span>
                          <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{ins}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<any> = ({ label, value, sub, color }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <div>
      <h4 className={`text-lg md:text-xl font-black text-${color}-600 leading-tight`}>{value}</h4>
      <p className="text-[10px] text-slate-400 font-bold italic mt-0.5">{sub}</p>
    </div>
  </div>
);

export default Dashboard;
