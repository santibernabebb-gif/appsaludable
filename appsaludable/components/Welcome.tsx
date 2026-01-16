
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

      <div className="relative container mx-auto px-6 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Tu nutricionista digital inteligente
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight">
            Nutre tu mejor versión: <span className="text-emerald-600">Planes reales</span> para una vida vibrante.
          </h1>
          
          <p className="text-xl text-slate-500 leading-relaxed mb-12 max-w-2xl mx-auto">
            Descubre el equilibrio perfecto con menús diseñados exclusivamente para tu ritmo de vida, gustos y objetivos. Saludable, sencillo y delicioso.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 transition-all transform hover:scale-105 active:scale-95"
            >
              Crear mi menú personalizado →
            </button>
            
            {hasHistory && (
              <button 
                onClick={onViewHistory}
                className="w-full sm:w-auto px-10 py-5 bg-white text-slate-600 font-bold rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"
              >
                Ver mis planes anteriores
              </button>
            )}
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-4 text-slate-400 text-sm font-medium">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+15}`} alt="User" />
                </div>
              ))}
            </div>
            <span>Únete a cientos de personas comiendo mejor</span>
          </div>
        </div>

        {/* Feature Cards Minimalistas */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
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
            desc="Lista de la compra lista y pasos de cocina ultrarrápidos."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default Welcome;
