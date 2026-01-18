
import React from 'react';
import { WeeklyPlan } from '../types';

interface Props {
  items: WeeklyPlan[];
  onLoad: (plan: WeeklyPlan) => void;
  onBack: () => void;
}

const History: React.FC<Props> = ({ items, onLoad, onBack }) => {
  return (
    <div className="relative min-h-screen max-w-4xl mx-auto px-6 py-24 fade-in flex flex-col">
      {/* Branding Superior Izquierdo */}
      <div className="absolute top-6 left-6 text-left no-print">
        <p className="text-sm font-bold text-primary-700 leading-none">AdelgazaSaludable</p>
        <p className="text-[10px] text-gray-400 font-medium">SantiSystems</p>
      </div>

      <button onClick={onBack} className="mb-8 flex items-center text-primary-600 font-semibold hover:text-primary-700 w-fit">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        Volver
      </button>

      <h2 className="text-3xl font-bold text-gray-900 mb-8">Historial de Planes</h2>

      <div className="flex-1">
        {items.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 mb-6">Aún no tienes planes guardados.</p>
            <button onClick={onBack} className="text-primary-600 font-bold hover:underline">Crear mi primer plan saludable</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {items.map((plan) => (
              <div 
                key={plan.id}
                onClick={() => onLoad(plan)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-primary-400 cursor-pointer transition-all hover:shadow-md"
              >
                <div>
                  <p className="text-lg font-bold text-gray-900">Plan Semanal</p>
                  <p className="text-sm text-gray-500">{new Date(plan.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <p className="text-primary-600 font-bold">{plan.targetCalories} kcal/día</p>
                  <p className="text-xs text-gray-400 italic">Directrices AESAN</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer AESAN */}
      <footer className="mt-12 pt-8 border-t border-gray-100 w-full text-center">
        <p className="text-[11px] text-gray-400 leading-relaxed italic">
          Estas recetas siguen estrictamente las directrices nutricionales de la <span className="font-bold text-gray-500">AESAN</span>. 
          SantiSystems garantiza la supervisión de la IA para planes seguros y saludables.
        </p>
        <p className="text-[10px] text-gray-300 mt-4 font-medium uppercase tracking-widest">SantiSystems 2026</p>
      </footer>
    </div>
  );
};

export default History;
