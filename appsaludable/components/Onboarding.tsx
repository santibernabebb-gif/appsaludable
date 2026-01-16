
import React, { useState } from 'react';
import { UserData, ActivityLevel, DietPreference, FastingType } from '../types';

interface Props {
  onComplete: (data: UserData) => void;
  onCancel: () => void;
}

const Onboarding: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<UserData>({
    age: 30, sex: 'female', height: 165, weight: 70, 
    activity: ActivityLevel.LIGHT, diet: DietPreference.OMNIVORE,
    allergies: '', dislikedFoods: '', mealsPerDay: 3, 
    fastingType: 'none', budget: 'medio', cookingTime: 'normal'
  });
  const [safetyBlocked, setSafetyBlocked] = useState(false);

  const totalSteps = 4;

  const next = () => setCurrentStep(s => Math.min(s + 1, totalSteps));
  const prev = () => {
    if (currentStep === 1) {
      onCancel();
    } else {
      setCurrentStep(s => s - 1);
    }
  };

  const handleSafetyCheck = (checked: boolean) => {
    if (checked) setSafetyBlocked(true);
  };

  if (safetyBlocked) {
    return (
      <div className="max-w-xl mx-auto mt-6 p-8 bg-white rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-emerald-50 animate-fade-in text-center">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Priorizamos tu Bienestar</h2>
        <p className="text-sm text-slate-600 mb-8 leading-relaxed">
          Para que tu camino hacia una vida más saludable sea seguro y efectivo, en tu caso particular te recomendamos <strong>consultar con un profesional sanitario</strong> antes de iniciar cualquier plan automatizado.
        </p>
        <button 
          onClick={onCancel}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all"
        >
          Entendido, volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-6">
      {/* Progress Bar */}
      <div className="mb-8 flex items-center justify-between gap-4">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className="flex-1 h-2 rounded-full bg-slate-200 relative overflow-hidden">
            <div 
              className={`absolute inset-0 bg-emerald-500 transition-all duration-500 ${currentStep >= s ? 'w-full' : 'w-0'}`}
            ></div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 min-h-[450px] flex flex-col">
        
        {currentStep === 1 && (
          <div className="animate-fade-in space-y-6 flex-grow">
            <header className="mb-4 text-center sm:text-left">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Paso 1 de 4</span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">Tu Salud Primero</h2>
              <p className="text-sm text-slate-500 mt-2">Confírmanos si te encuentras en alguna de estas situaciones:</p>
            </header>
            <div className="grid gap-3">
              <SafetyCard label="Embarazo o Lactancia" onCheck={() => handleSafetyCheck(true)} />
              <SafetyCard label="Menor de 18 años" onCheck={() => handleSafetyCheck(true)} />
              <SafetyCard label="Diabetes, TCA o patología cardíaca" onCheck={() => handleSafetyCheck(true)} />
              <SafetyCard label="Medicación Metabólica Especial" onCheck={() => handleSafetyCheck(true)} />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-fade-in space-y-8 flex-grow">
            <header>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Paso 2 de 4</span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">Tu Perfil</h2>
              <p className="text-sm text-slate-500 mt-2">Estos datos nos ayudan a calcular tu energía diaria ideal.</p>
            </header>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">Sexo</label>
                <div className="flex gap-3">
                  <ToggleButton active={data.sex === 'female'} onClick={() => setData({...data, sex: 'female'})} label="Mujer" />
                  <ToggleButton active={data.sex === 'male'} onClick={() => setData({...data, sex: 'male'})} label="Hombre" />
                </div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">Edad</label>
                <input 
                  type="number" 
                  value={data.age || ''} 
                  onFocus={() => setData({...data, age: '' as any})}
                  onChange={e => setData({...data, age: e.target.value === '' ? '' as any : +e.target.value})} 
                  className="w-full p-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 text-center font-bold text-xl" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">Peso (kg)</label>
                <input 
                  type="number" 
                  value={data.weight || ''} 
                  onFocus={() => setData({...data, weight: '' as any})}
                  onChange={e => setData({...data, weight: e.target.value === '' ? '' as any : +e.target.value})} 
                  className="w-full p-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 text-center font-bold text-xl" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">Altura (cm)</label>
                <input 
                  type="number" 
                  value={data.height || ''} 
                  onFocus={() => setData({...data, height: '' as any})}
                  onChange={e => setData({...data, height: e.target.value === '' ? '' as any : +e.target.value})} 
                  className="w-full p-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 text-center font-bold text-xl" 
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-fade-in space-y-8 flex-grow">
            <header>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Paso 3 de 4</span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">Tu Energía</h2>
            </header>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <ActivityBtn active={data.activity === ActivityLevel.SEDENTARY} label="Suave" desc="Poco activo" onClick={() => setData({...data, activity: ActivityLevel.SEDENTARY})} />
                <ActivityBtn active={data.activity === ActivityLevel.LIGHT} label="Activo" desc="1-2 días" onClick={() => setData({...data, activity: ActivityLevel.LIGHT})} />
                <ActivityBtn active={data.activity === ActivityLevel.MODERATE} label="Enérgico" desc="3-4 días" onClick={() => setData({...data, activity: ActivityLevel.MODERATE})} />
                <ActivityBtn active={data.activity === ActivityLevel.HIGH} label="Atlético" desc="Deporte diario" onClick={() => setData({...data, activity: ActivityLevel.HIGH})} />
              </div>
              <div className="flex gap-4">
                <ToggleButton active={data.diet === DietPreference.OMNIVORE} label="De todo" onClick={() => setData({...data, diet: DietPreference.OMNIVORE})} />
                <ToggleButton active={data.diet === DietPreference.VEGETARIAN} label="Vegetariano" onClick={() => setData({...data, diet: DietPreference.VEGETARIAN})} />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="animate-fade-in space-y-6 flex-grow">
            <header>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Paso 4 de 4</span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">Horario y Ayuno</h2>
            </header>
            <div className="grid gap-3">
              <FastingOption active={data.fastingType === 'none'} onClick={() => setData({...data, fastingType: 'none'})} title="Tradicional" desc="Distribución constante." icon="⏰" />
              <FastingOption active={data.fastingType === '12-20'} onClick={() => setData({...data, fastingType: '12-20'})} title="Ayuno 12h-20h" desc="Cenas tarde o saltas desayuno." icon="🌙" />
              <FastingOption active={data.fastingType === '9-17'} onClick={() => setData({...data, fastingType: '9-17'})} title="Ayuno 09h-17h" desc="Empiezas pronto, cenas ligero." icon="☀️" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <select value={data.budget} onChange={e => setData({...data, budget: e.target.value as any})} className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold text-sm text-slate-700">
                <option value="bajo">Económico</option><option value="medio">Equilibrado</option><option value="alto">Gourmet</option>
              </select>
              <select value={data.cookingTime} onChange={e => setData({...data, cookingTime: e.target.value as any})} className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold text-sm text-slate-700">
                <option value="rapido">Exprés</option><option value="normal">Con tiempo</option>
              </select>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-4 pt-8 border-t border-slate-50">
          <button onClick={prev} className="px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-2">
            <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
          <button 
            onClick={currentStep === totalSteps ? () => onComplete(data) : next}
            className="flex-grow py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 transition-all text-sm md:text-base"
          >
            {currentStep === totalSteps ? '¡Ver mi Plan! ✨' : 'Continuar'}
          </button>
        </div>
      </div>
    </div>
  );
};

const FastingOption = ({ active, onClick, title, desc, icon }: any) => (
  <button onClick={onClick} className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all ${active ? 'border-emerald-600 bg-emerald-50' : 'border-slate-50 bg-slate-50 hover:bg-slate-100'}`}>
    <div className="text-2xl shrink-0">{icon}</div>
    <div className="flex-grow">
      <p className={`text-sm font-bold block ${active ? 'text-emerald-700' : 'text-slate-700'}`}>{title}</p>
      <p className="text-[11px] text-slate-400 font-medium leading-tight">{desc}</p>
    </div>
  </button>
);

const SafetyCard = ({ label, onCheck }: any) => (
  <label className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-emerald-50 cursor-pointer transition-all group">
    <input type="checkbox" onChange={e => e.target.checked && onCheck()} className="w-5 h-5 rounded border-slate-200 text-emerald-500" />
    <span className="text-sm text-slate-700 font-medium">{label}</span>
  </label>
);

const ToggleButton = ({ active, onClick, label }: any) => (
  <button onClick={onClick} className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all ${active ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{label}</button>
);

const ActivityBtn = ({ active, label, desc, onClick }: any) => (
  <button onClick={onClick} className={`p-4 rounded-2xl border-2 text-left transition-all ${active ? 'border-emerald-600 bg-emerald-50' : 'border-slate-50 bg-slate-50 opacity-60 hover:opacity-100'}`}>
    <p className={`text-sm font-bold block ${active ? 'text-emerald-700' : 'text-slate-700'}`}>{label}</p>
    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-0.5">{desc}</p>
  </button>
);

export default Onboarding;
