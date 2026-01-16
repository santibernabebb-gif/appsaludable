
import React from 'react';

interface Props {
  onStart: () => void;
  onViewHistory?: () => void;
  hasHistory?: boolean;
}

const Welcome: React.FC<Props> = ({ onStart, onViewHistory, hasHistory }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

      <div className="relative container mx-auto px-6 py-8 md:py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Nutricionista Digital Inteligente
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
            Nutre tu mejor versión: <span className="text-emerald-600">Planes reales</span> para una vida vibrante.
          </h1>
          
          <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-2xl mx-auto">
            Descubre el equilibrio perfecto con menús diseñados exclusivamente para tu ritmo de vida, gustos y objetivos. Saludable, sencillo y delicioso.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 transition-all transform hover:scale-105 active:scale-95"
            >
              Crear mi menú personalizado →
            </button>
            
            {hasHistory && (
              <button 
                onClick={onViewHistory}
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-600 font-bold rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"
              >
                Ver planes anteriores
              </button>
            )}
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-4 text-slate-400 text-xs font-medium">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+15}`} alt="User" />
                </div>
              ))}
            </div>
            <span>Únete a cientos de personas comiendo mejor</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <FeatureCard 
            icon="🍎"
            title="Salud Real"
            desc="Basado en ingredientes de mercado y platos de toda la vida."
          />
          <FeatureCard 
            icon="✨"
            title="Flexibilidad"
            desc="Adaptamos el plan a tus horarios, no al revés."
          />
          <FeatureCard 
            icon="🧘"
            title="Sin Estrés"
            desc="Ingredientes detallados en cada receta y pasos rápidos."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="text-3xl mb-3">{icon}</div>
    <h3 className="text-base font-bold text-slate-800 mb-1">{title}</h3>
    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default Welcome;
