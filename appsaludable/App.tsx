
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

  const handleResetCurrent = () => {
    if (confirm("¿Nueva búsqueda de menú?")) {
      setPlan(null);
      localStorage.removeItem('santi_active_plan');
      setStep('onboarding');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 select-none">
      {/* Header optimizado para APK (Safe Area) */}
      <header className={`px-5 pt-[env(safe-area-inset-top)] pb-3 md:py-4 flex justify-between items-center z-50 transition-all ${step === 'dashboard' || step === 'history' ? 'bg-white border-b sticky top-0 shadow-sm' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3 pt-2" onClick={() => setStep('welcome')}>
          <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-emerald-200">A</div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 leading-tight text-sm">Adelgaza Saludable</span>
            <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">App Version</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          {history.length > 0 && (
            <button onClick={() => setStep('history')} className="px-3 py-1.5 text-[10px] font-bold text-slate-600 bg-slate-100 rounded-lg">Historial</button>
          )}
          {step === 'dashboard' && (
            <button onClick={handleResetCurrent} className="p-2 text-orange-500 bg-orange-50 rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow">
        {error && (
          <div className="px-4 mt-2">
            <div className="bg-red-50 text-red-700 p-3 rounded-xl flex items-center gap-3 border border-red-100">
              <ICONS.Alert />
              <p className="text-xs font-medium">{error}</p>
            </div>
          </div>
        )}

        {step === 'welcome' && <Welcome onStart={() => setStep('onboarding')} onViewHistory={() => setStep('history')} hasHistory={history.length > 0} />}
        {step === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} onCancel={() => setStep('welcome')} />}
        {step === 'loading' && <LoadingState />}
        {step === 'history' && <History entries={history} onSelect={(e) => { setPlan(e.plan); setUserData(e.userData); setNutrition(calculateNutrition(e.userData)); setStep('dashboard'); }} onBack={() => setStep(plan ? 'dashboard' : 'welcome')} />}
        {step === 'dashboard' && plan && userData && (
          <div className="py-4 px-4 pb-[env(safe-area-inset-bottom)]">
            <Dashboard plan={plan} userData={userData} nutrition={nutrition} onFinishWeek={handleFinishWeek} />
          </div>
        )}
      </main>

      <footer className="bg-white border-t py-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">© 2026 Adelgaza Saludable · SantiSystems Mobile</p>
        </div>
      </footer>
    </div>
  );
};

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
    <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-6"></div>
    <h2 className="text-xl font-bold text-slate-800 mb-2 italic">Creando tu menú...</h2>
    <p className="text-sm text-slate-500">Buscando las mejores recetas mediterráneas para ti.</p>
  </div>
);

export default App;
