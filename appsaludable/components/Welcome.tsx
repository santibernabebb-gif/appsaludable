
import React from 'react';

interface Props {
  onStart: () => void;
  onViewHistory: () => void;
  hasHistory: boolean;
}

const Welcome: React.FC<Props> = ({ onStart, onViewHistory, hasHistory }) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-white px-6 py-12 text-center fade-in">
      
      {/* Branding Superior Izquierdo */}
      <div className="absolute top-6 left-6 text-left no-print">
        <p className="text-sm font-bold text-primary-700 leading-none">AdelgazaSaludable</p>
        <p className="text-[10px] text-gray-400 font-medium">SantiSystems</p>
      </div>

      {/* Navegación Superior Derecha */}
      <div className="absolute top-4 md:top-6 right-6 no-print">
        <button
          onClick={onViewHistory}
          className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center bg-white shadow-sm border border-primary-100 px-3 py-2 rounded-xl transition-all active:scale-95"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Historial recetas
        </button>
      </div>

      <div className="w-24 h-24 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Adelgaza Saludable</h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-lg mb-10 leading-relaxed">
        Tu asistente personal de nutrición inteligente. Crea planes mediterráneos personalizados para alcanzar tus objetivos de salud.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onStart}
          className="px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-xl transition-all hover:scale-105 focus:ring-4 focus:ring-primary-100 active:scale-95"
        >
          Empezar mi transformación
        </button>
        
        {hasHistory && (
          <button
            onClick={onViewHistory}
            className="px-10 py-4 bg-white hover:bg-gray-50 text-primary-700 font-bold rounded-xl shadow-md border border-primary-100 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Historial de recetas
          </button>
        )}
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-primary-600 font-bold text-xl mb-2">IA Inteligente</div>
          <p className="text-gray-500 text-sm">Planes adaptados a tus objetivos exactos.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-primary-600 font-bold text-xl mb-2">Salud Primero</div>
          <p className="text-gray-500 text-sm">Basado en la ciencia de la dieta mediterránea.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-primary-600 font-bold text-xl mb-2">Fácil de Seguir</div>
          <p className="text-gray-500 text-sm">Recetas paso a paso realistas.</p>
        </div>
      </div>

      {/* Footer AESAN */}
      <footer className="mt-12 pt-8 border-t border-gray-100 w-full max-w-2xl">
        <p className="text-[11px] text-gray-400 leading-relaxed italic">
          Estas recetas siguen estrictamente las directrices nutricionales de la <span className="font-bold text-gray-500">AESAN</span> (Agencia Española de Seguridad Alimentaria y Nutrición). 
          La IA está supervisada por la AESAN para garantizar que las sugerencias sean seguras, reales y saludables.
        </p>
        <p className="text-[10px] text-gray-300 mt-4 font-medium uppercase tracking-widest">SantiSystems 2026</p>
      </footer>
    </div>
  );
};

export default Welcome;
