
import React from 'react';
import { PlanHistoryEntry } from '../types';

interface Props {
  entries: PlanHistoryEntry[];
  onSelect: (entry: PlanHistoryEntry) => void;
  onBack: () => void;
}

const History: React.FC<Props> = ({ entries, onSelect, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-12 gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">Tu Historial</h2>
          <p className="text-slate-500 mt-2 text-sm md:text-base">Consulta tus menús anteriores y haz seguimiento de tu progreso.</p>
        </div>
        <button 
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3 bg-white text-slate-600 font-bold rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          Volver
        </button>
      </div>

      <div className="grid gap-4 md:gap-6">
        {entries.length === 0 ? (
          <div className="text-center py-16 md:py-24 bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm border-dashed">
            <div className="text-6xl mb-6">📅</div>
            <h3 className="text-xl font-bold text-slate-800">No hay planes todavía</h3>
            <p className="text-slate-400 mt-2 max-w-xs mx-auto">Tus planes semanales aparecerán aquí una vez los hayas finalizado.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div 
              key={entry.id}
              onClick={() => onSelect(entry)}
              className="group bg-white p-5 md:p-8 rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-emerald-900/5 hover:border-emerald-100 transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-center gap-6"
            >
              <div className="flex items-center gap-5 md:gap-8 w-full">
                <div className="w-14 h-14 md:w-20 md:h-20 bg-emerald-50 rounded-2xl md:rounded-3xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0">
                  <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div className="flex-grow">
                  <h4 className="text-base md:text-xl font-bold text-slate-800">Menú Semanal · {entry.date}</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">{entry.userData.diet}</span>
                    <span className="text-[10px] md:text-xs font-bold text-emerald-600 uppercase tracking-widest">{entry.plan.days[0].totalCalories} kcal promedio</span>
                  </div>
                </div>
              </div>
              <button className="w-full sm:w-auto px-8 py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all text-sm">
                Recuperar Plan
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
