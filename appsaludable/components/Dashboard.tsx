
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
      case '12-20': return "Ventana 12:00-20:00";
      case '9-17': return "Ventana 09:00-17:00";
      default: return "Horario Tradicional";
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const emerald = [5, 150, 105]; // RGB Emerald-600
    const slate = [30, 41, 59]; // RGB Slate-800
    
    // PORTADA
    doc.setFillColor(emerald[0], emerald[1], emerald[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Adelgaza Saludable", 20, 25);
    
    doc.setFontSize(10);
    doc.text("by SantiSystems · Plan Personalizado", 20, 32);
    
    // INFO USUARIO
    doc.setTextColor(slate[0], slate[1], slate[2]);
    doc.setFontSize(14);
    doc.text("Resumen del Perfil Nutricional", 20, 55);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Objetivo: ${nutrition.target} kcal/día`, 20, 65);
    doc.text(`Dieta: ${userData.diet}`, 20, 70);
    doc.text(`Régimen: ${userData.fastingType !== 'none' ? 'Ayuno 16:8' : 'Tradicional'} (${getFastingLabel()})`, 20, 75);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 20, 80);
    
    let y = 95;

    // DIAS
    plan.days.forEach((day, index) => {
      if (y > 240) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFillColor(248, 250, 252); // bg-slate-50
      doc.rect(15, y - 5, 180, 12, 'F');
      
      doc.setTextColor(emerald[0], emerald[1], emerald[2]);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${day.day.toUpperCase()} - ${day.totalCalories} kcal`, 20, y + 3);
      
      y += 15;
      
      day.meals.forEach(meal => {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
        
        doc.setTextColor(slate[0], slate[1], slate[2]);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`${meal.type}: ${meal.name}`, 25, y);
        
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
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
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in px-4">
      
      {/* CABECERA DE CONTROL WEB */}
      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tu Plan Semanal</h2>
          <p className="text-slate-500 font-medium italic">Selecciona un día para ver tus recetas.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={handleDownloadPDF}
            className="flex-grow sm:flex-none bg-slate-100 text-slate-700 px-6 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Descargar PDF
          </button>
          <button 
            onClick={onFinishWeek}
            className="flex-grow md:flex-none bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
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

      {/* NAVEGACIÓN POR DÍAS (PESTAÑAS) */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide no-scrollbar">
        {plan.days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => setActiveDayIndex(idx)}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap border-2 ${
              activeDayIndex === idx 
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' 
                : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200 hover:text-emerald-600'
            }`}
          >
            {day.day}
          </button>
        ))}
      </div>

      {/* CONTENIDO DEL DÍA SELECCIONADO */}
      <div key={activeDayIndex} className="animate-fade-in space-y-8">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50 overflow-hidden">
          <div className="bg-emerald-600 p-8 text-white flex justify-between items-center">
            <div>
              <span className="text-[10px] font-black text-emerald-200 uppercase tracking-widest">Día {activeDayIndex + 1} de 7</span>
              <h2 className="text-3xl font-black">{currentDay.day}</h2>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-emerald-100 italic mb-1">Hidratación: {currentDay.waterGoal}</p>
              <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-xl font-black border border-white/20">{currentDay.totalCalories} kcal</span>
            </div>
          </div>
          
          <div className="p-8 md:p-12 space-y-12">
            {currentDay.meals.map((meal, mIdx) => (
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

        <div className="bg-emerald-600/5 border border-emerald-100 p-8 rounded-[2.5rem] text-center">
          <p className="text-emerald-800 font-bold italic">
            "Tu plan ha sido diseñado para ser flexible. Si no tienes un ingrediente, sustitúyelo por otro similar del mismo grupo alimenticio."
          </p>
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
