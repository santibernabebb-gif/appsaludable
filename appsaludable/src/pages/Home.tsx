
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Apple, Sparkles, UserCheck } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden pt-16 pb-24">
      {/* Decorative background blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-emerald-50/50 blur-3xl -z-10 rounded-full" />

      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-8">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Nutricionista Digital Inteligente
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#0f172a] mb-6 leading-[1.1]">
          Nutre tu mejor versión:<br />
          <span className="text-[#00a86b]">Planes reales</span> para una vida vibrante.
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Descubre el equilibrio perfecto con menús diseñados exclusivamente para tu ritmo de vida, gustos y objetivos. Saludable, sencillo y delicioso.
        </p>

        {/* Main CTA */}
        <button 
          onClick={() => navigate('/wizard/step-1')}
          className="group relative inline-flex items-center gap-2 bg-[#00a86b] hover:bg-[#008f5a] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-emerald-200/50 transition-all active:scale-95"
        >
          Crear mi menú personalizado
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>

        {/* Social Proof */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <img 
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white object-cover" 
                src={`https://i.pravatar.cc/100?u=${i}`} 
                alt="user"
              />
            ))}
          </div>
          <span className="text-sm text-slate-400 font-medium">Únete a cientos de personas comiendo mejor</span>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">🍎</div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Salud Real</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Basado en ingredientes de mercado y platos de toda la vida.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">✨</div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Flexibilidad</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Adaptamos el plan a tus horarios, no al revés.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">🧘</div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Sin Estrés</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Ingredientes detallados en cada receta y pasos rápidos.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
