
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
      console.error("Error detallado:", e);
      setError(e.message || "No pudimos conectar con el nutricionista digital. Revisa tu conexión.");
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

  const handleResetCurrent = () => {
    if (confirm("¿Quieres descartar el plan actual e iniciar una nueva búsqueda?")) {
      setPlan(null);
      localStorage.removeItem('santi_active_plan');
      setStep('onboarding');
    }
  };

  const handleClearAll = () => {
    if (confirm("Se borrarán todos los planes y el historial. ¿Estás seguro?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const viewOldPlan = (entry: PlanHistoryEntry) => {
    setPlan(entry.plan);
    setUserData(entry.userData);
    setNutrition(calculateNutrition(entry.userData));
    setStep('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className={`px-5 py-3 md:py-4 flex justify-between items-center z-50 transition-all ${step === 'dashboard' || step === 'history' ? 'bg-white border-b sticky top-0 shadow-sm' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setStep('welcome')}>
          <div className="w-8 h-8 md:w-9 md:h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-sm md:text-lg shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">A</div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 leading-tight text-sm md:text-base">Adelgaza Saludable</span>
            <span className="text-[8px] md:text-[9px] font-bold text-emerald-600 uppercase tracking-[0.15em]">by SantiSystems</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {(step === 'dashboard' || step === 'onboarding' || step === 'welcome') && history.length > 0 && (
            <button 
              onClick={() => setStep('history')}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              Historial
            </button>
          )}
          {step === 'dashboard' && (
            <button onClick={handleResetCurrent} className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all" title="Nueva Búsqueda">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          )}
          {(step === 'dashboard' || step === 'history') && (
            <button onClick={handleClearAll} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all" title="Borrar Todo">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow">
        {error && (
          <div className="max-w-2xl mx-auto mt-2 px-4">
            <div className="bg-red-50 text-red-700 p-3 rounded-xl flex items-center gap-3 border border-red-100 shadow-sm animate-fade-in">
              <ICONS.Alert />
              <p className="text-xs font-medium">{error}</p>
            </div>
          </div>
        )}

        {step === 'welcome' && (
          <Welcome 
            onStart={() => setStep('onboarding')} 
            onViewHistory={() => setStep('history')}
            hasHistory={history.length > 0}
          />
        )}
        {step === 'onboarding' && (
          <Onboarding 
            onComplete={handleOnboardingComplete} 
            onCancel={() => setStep('welcome')}
          />
        )}
        {step === 'loading' && <LoadingState />}
        {step === 'history' && <History entries={history} onSelect={viewOldPlan} onBack={() => setStep(plan ? 'dashboard' : 'welcome')} />}
        {step === 'dashboard' && plan && userData && (
          <div className="py-4 md:py-6 px-4">
            <Dashboard 
              plan={plan} 
              userData={userData} 
              nutrition={nutrition} 
              onFinishWeek={handleFinishWeek}
            />
          </div>
        )}
      </main>

      <footer className="bg-white border-t py-6 md:py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div className="space-y-1">
              <h3 className="text-xs md:text-sm font-bold text-slate-800 tracking-tight">Compromiso Saludable</h3>
              <p className="text-[10px] md:text-xs text-slate-500">Dieta Mediterránea · Criterios AESAN · Ministerio de Sanidad</p>
            </div>
            <div className="flex gap-4">
              <a href={HEALTH_LINKS.NAOS} target="_blank" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Estrategia NAOS →</a>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              © 2026 Adelgaza Saludable · by SantiSystems
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6">
    <div className="relative mb-6">
      <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
    </div>
    <h2 className="text-xl font-bold text-slate-800 mb-2 italic">"Cuidándote..."</h2>
    <p className="text-sm text-slate-500 max-w-sm">Estamos diseñando una semana variada y deliciosa pensada solo para ti.</p>
  </div>
);

export default App;
