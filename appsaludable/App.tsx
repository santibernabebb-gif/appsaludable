import React, { useState, useEffect } from 'react';
import { UserData, WeeklyPlan, PlanHistoryEntry } from './types';
import { calculateNutrition } from './utils/calculators';
import { generatePlan } from './services/geminiService';
import { HEALTH_LINKS, ICONS } from './constants';
import Dashboard from './components/Dashboard';
import Welcome from './components/Welcome';
import Onboarding from './components/Onboarding';
import History from './components/History';

const App: React.FC = () => {
  const [step, setStep] = useState<'welcome' | 'onboarding' | 'loading' | 'dashboard' | 'history'>('welcome');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [history, setHistory] = useState<PlanHistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [nutrition, setNutrition] = useState<any>(null);

  useEffect(() => {
    const savedPlan = localStorage.getItem('santi_active_plan');
    const savedUser = localStorage.getItem('santi_user');
    const savedHistory = localStorage.getItem('santi_history');

    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    if (savedPlan && savedUser) {
      try {
        const parsedPlan = JSON.parse(savedPlan);
        const parsedUser = JSON.parse(savedUser);
        setPlan(parsedPlan);
        setUserData(parsedUser);
        setNutrition(calculateNutrition(parsedUser));
        setStep('dashboard');
      } catch (e) {
        console.error("Error loading saved data", e);
      }
    }
  }, []);

  const handleOnboardingComplete = async (data: UserData) => {
    setUserData(data);
    const nut = calculateNutrition(data);
    setNutrition(nut);
    setStep('loading');
    setError(null);
    
    try {
      const newPlan = await generatePlan(data, nut.target);
      const planWithId = { ...newPlan, id: Date.now().toString(), date: new Date().toLocaleDateString('es-ES') };
      
      setPlan(planWithId);
      localStorage.setItem('santi_active_plan', JSON.stringify(planWithId));
      localStorage.setItem('santi_user', JSON.stringify(data));
      setStep('dashboard');
    } catch (e: any) {
      setError(e.message || "Fallo de conexión con el servidor.");
      setStep('onboarding');
    }
  };

  const handleFinishWeek = () => {
    if (plan && userData) {
      const newEntry: PlanHistoryEntry = {
        id: plan.id || Date.now().toString(),
        date: new Date().toLocaleDateString('es-ES'),
        plan: plan,
        userData: userData
      };
      const updatedHistory = [newEntry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('santi_history', JSON.stringify(updatedHistory));
      setPlan(null);
      localStorage.removeItem('santi_active_plan');
      setStep('welcome');
    }
  };

  const handleDeleteHistoryEntry = (id: string) => {
    if (confirm("¿Seguro que quieres borrar este plan del historial?")) {
      const updatedHistory = history.filter(entry => entry.id !== id);
      setHistory(updatedHistory);
      localStorage.setItem('santi_history', JSON.stringify(updatedHistory));
    }
  };

  const handleResetCurrent = () => {
    if (confirm("¿Nueva búsqueda de menú?")) {
      setPlan(null);
      localStorage.removeItem('santi_active_plan');
      setStep('onboarding');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 select-none text-slate-800">
      {/* Header optimizado y responsivo */}
      <header className={`px-5 pt-[env(safe-area-inset-top)] pb-3 md:py-6 flex justify-between items-center z-50 transition-all ${step === 'dashboard' || step === 'history' ? 'bg-white border-b sticky top-0 shadow-sm' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3 pt-2 cursor-pointer" onClick={() => setStep('welcome')}>
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-200">S</div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 leading-tight text-base">Adelgaza Saludable</span>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">SantiSystems</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          {history.length > 0 && (
            <button onClick={() => setStep('history')} className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors border border-slate-200">Historial</button>
          )}
          {step === 'dashboard' && (
            <button onClick={handleResetCurrent} className="p-2.5 text-orange-600 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors border border-orange-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center w-full">
        {error && (
          <div className="w-full max-w-5xl px-4 mt-4">
            <div className="bg-red-50 text-red-800 p-4 rounded-2xl flex items-center gap-3 border border-red-200 animate-fade-in shadow-sm">
              <ICONS.Alert />
              <p className="text-sm font-bold">{error}</p>
            </div>
          </div>
        )}

        <div className="w-full max-w-5xl mx-auto flex-grow flex flex-col items-center">
          {step === 'welcome' && <Welcome onStart={() => setStep('onboarding')} onViewHistory={() => setStep('history')} hasHistory={history.length > 0} />}
          {step === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} onCancel={() => setStep('welcome')} />}
          {step === 'loading' && <LoadingState />}
          {step === 'history' && <History entries={history} onSelect={(e) => { setPlan(e.plan); setUserData(e.userData); setNutrition(calculateNutrition(e.userData)); setStep('dashboard'); }} onDeleteEntry={handleDeleteHistoryEntry} onBack={() => setStep(plan ? 'dashboard' : 'welcome')} />}
          {step === 'dashboard' && plan && userData && (
            <div className="py-6 px-4 pb-[env(safe-area-inset-bottom)] w-full">
              <Dashboard plan={plan} userData={userData} nutrition={nutrition} onFinishWeek={handleFinishWeek} />
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t py-12 md:py-16 pb-[calc(env(safe-area-inset-bottom)+2rem)]">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            <a href={HEALTH_LINKS.NAOS} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mb-1">Entidad Colaboradora</span>
              <span className="text-sm text-slate-800 group-hover:text-emerald-700 font-black transition-colors">Estrategia NAOS</span>
            </a>
            <div className="hidden sm:block w-px h-8 bg-slate-200"></div>
            <a href={HEALTH_LINKS.AESAN_RECOMMENDATIONS} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mb-1">Criterio Nutricional</span>
              <span className="text-sm text-slate-800 group-hover:text-emerald-700 font-black transition-colors">AESAN</span>
            </a>
            <div className="hidden sm:block w-px h-8 bg-slate-200"></div>
            <a href={HEALTH_LINKS.MINISTRY_HEALTH} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mb-1">Supervisión</span>
              <span className="text-sm text-slate-800 group-hover:text-emerald-700 font-black transition-colors">Ministerio de Sanidad</span>
            </a>
          </div>
          <div className="w-16 h-1.5 bg-emerald-100 mx-auto rounded-full"></div>
          <p className="text-xs text-slate-500 uppercase tracking-[0.3em] font-black">© 2026 Adelgaza Saludable · SantiSystems</p>
        </div>
      </footer>
    </div>
  );
};

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 w-full max-w-md">
    <div className="relative mb-8">
      <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin shadow-sm"></div>
      <div className="absolute inset-0 flex items-center justify-center text-emerald-700 font-black">S</div>
    </div>
    <h2 className="text-2xl font-black text-slate-900 mb-3 italic">Creando tu menú...</h2>
    <p className="text-sm text-slate-600 font-bold leading-relaxed">SantiSystems está procesando las mejores recetas mediterráneas basadas en criterios de AESAN personalizadas para ti.</p>
  </div>
);

export default App;