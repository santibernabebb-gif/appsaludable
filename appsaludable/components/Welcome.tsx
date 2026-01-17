import React from 'react';

interface Props {
  onStart: () => void;
  onViewHistory?: () => void;
  hasHistory?: boolean;
}

const Welcome: React.FC<Props> = ({ onStart, onViewHistory, hasHistory }) => {
  return (
    <div className="relative overflow-hidden text-slate-800">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"></div>

      <div className="relative container mx-auto px-6 py-8 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-8 animate-fade-in shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            Nutricionista Digital SantiSystems
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.05] mb-8 tracking-tighter">
            Nutre tu mejor versión: <span className="text-emerald-600">Planes reales</span> para una vida plena.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-700 leading-relaxed mb-10 max-w-2xl mx-auto font-bold italic">
            Descubre el equilibrio perfecto con menús diseñados exclusivamente por SantiSystems para tu ritmo de vida y objetivos. Saludable y real.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 transition-all transform hover:scale-[1.03] active:scale-[0.97] uppercase tracking-wide text-sm md:text-base"
            >
              Crear mi menú personalizado →
            </button>
            
            {hasHistory && (
              <button 
                onClick={onViewHistory}
                className="w-full sm:w-auto px-10 py-5 bg-white text-slate-800 font-black rounded-2xl shadow-sm border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-700 transition-all uppercase tracking-wide text-sm md:text-base"
              >
                Ver planes anteriores
              </button>
            )}
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-5 text-slate-800 text-xs font-black uppercase tracking-widest">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                </div>
              ))}
            </div>
            <span>Únete a cientos de personas comiendo mejor</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16 md:mt-24">
          <FeatureCard 
            icon="🍎"
            title="Salud Real"
            desc="Basado en ingredientes de mercado y platos de toda la vida según criterios AESAN."
          />
          <FeatureCard 
            icon="✨"
            title="Flexibilidad"
            desc="Adaptamos el plan SantiSystems a tus horarios, no al revés."
          />
          <FeatureCard 
            icon="🧘"
            title="Sin Estrés"
            desc="Ingredientes detallados en cada receta y pasos rápidos para tu día a día."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all group">
    <div className="text-4xl mb-5 group-hover:scale-110 transition-transform inline-block">{icon}</div>
    <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">{title}</h3>
    <p className="text-sm text-slate-700 leading-relaxed font-bold">{desc}</p>
  </div>
);

export default Welcome;