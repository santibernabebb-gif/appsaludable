
import React from 'react';

interface Props {
  onStart: () => void;
  onViewHistory?: () => void;
  hasHistory?: boolean;
}

const Welcome: React.FC<Props> = ({ onStart, onViewHistory, hasHistory }) => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

      <div className="relative container mx-auto px-6 py-4 md:py-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase tracking-widest mb-4 animate-fade-in">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            Nutricionista Digital Inteligente
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-[1.1] mb-4 tracking-tight">
            Nutre tu mejor versión: <span className="text-emerald-600">Planes reales</span> para ti.
          </h1>
          
          <p className="text-base text-slate-500 leading-relaxed mb-6 max-w-2xl mx-auto">
            Menús diseñados exclusivamente para tu ritmo, gustos y objetivos. Saludable, sencillo y delicioso.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all transform hover:scale-105 active:scale-95 text-sm"
            >
              Crear mi menú personalizado →
            </button>
            
            {hasHistory && (
              <button 
                onClick={onViewHistory}
                className="w-full sm:w-auto px-6 py-3 bg-white text-slate-600 font-bold rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all text-sm"
              >
                Planes anteriores
              </button>
            )}
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-3 text-slate-400 text-[10px] font-medium">
            <div className="flex -space-x-1.5">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+15}`} alt="User" />
                </div>
              ))}
            </div>
            <span>Únete a cientos comiendo mejor</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <FeatureCard icon="🍎" title="Salud Real" desc="Ingredientes de mercado y platos de siempre." />
          <FeatureCard icon="✨" title="Flexibilidad" desc="Adaptados a tus horarios y gustos." />
          <FeatureCard icon="🧘" title="Sin Estrés" desc="Instrucciones paso a paso rápidas." />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="text-2xl mb-2">{icon}</div>
    <h3 className="text-sm font-bold text-slate-800 mb-0.5">{title}</h3>
    <p className="text-[10px] text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default Welcome;
