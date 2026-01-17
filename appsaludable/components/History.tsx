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
          <p className="text-slate-500 mt-2 text-sm md:text-base font-bold italic">Consulta tus menús anteriores y haz seguimiento de tu progreso.</p>
        </div>
        <button 
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-4 bg-white text-slate-600 font-black rounded-2xl shadow-sm border-2 border-slate-100 hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2 uppercase text-xs"
        >
          <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          Volver
        </button>
      </div>

      <div className="grid gap-4 md:gap-6">
        {entries.length === 0 ? (
          <div className="text-center py-16 md:py-24 bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm border-dashed">
            <div className="text-6xl mb-6">📅</div>
            <h3 className="text-xl font-black text-slate-800">No hay planes todavía</h3>
            <p className="text-slate-400 mt-2 max-w-xs mx-auto font-bold uppercase text-[10px] tracking-widest">Tus planes semanales aparecerán aquí una vez los hayas finalizado.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div 
              key={entry.id}
              onClick={() => onSelect(entry)}
              className="group bg-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-emerald-900/10 hover:border-emerald-500 transition-all cursor-pointer flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden"
            >
              <div className="flex items-center gap-5 md:gap-8 w-full">
                <div className="w-14 h-14 md:w-20 md:h-20 bg-emerald-50 rounded-2xl md:rounded-3xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0 shadow-inner">
                  <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div className="flex-grow">
                  <h4 className="text-base md:text-2xl font-black text-slate-800 uppercase">Menú · {entry.date}</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{entry.userData.diet === 'omnivoro' ? 'OMNÍVORO' : 'VEGETAL'}</span>
                    <span className="text-[10px] md:text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">{entry.plan.days[0].totalCalories} KCAL MEDIA</span>
                  </div>
                </div>
              </div>
              <div className="flex w-full md:w-auto gap-3">
                <button className="flex-grow md:flex-none px-6 py-4 bg-slate-50 text-slate-500 font-black rounded-2xl border-2 border-slate-100 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-500 transition-all text-xs uppercase tracking-tight">
                  Recuperar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
