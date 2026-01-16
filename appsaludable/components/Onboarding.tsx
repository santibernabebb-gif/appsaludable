
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
      <div className="max-w-xl mx-auto mt-4 p-5 bg-white rounded-2xl shadow-xl shadow-emerald-900/5 border border-emerald-50 animate-fade-in text-center">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-1">Priorizamos tu Bienestar</h2>
        <p className="text-[10px] text-slate-600 mb-4 leading-relaxed">
          Para que tu camino sea seguro, te recomendamos consultar con un profesional antes de iniciar. ¡Tu salud es lo primero!
        </p>
        <button 
          onClick={onCancel}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all text-xs"
        >
          Entendido, volver
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-2">
      <div className="mb-4 flex items-center justify-between gap-2">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className="flex-1 h-1 rounded-full bg-slate-200 relative overflow-hidden">
            <div className={`absolute inset-0 bg-emerald-500 transition-all duration-500 ${currentStep >= s ? 'w-full' : 'w-0'}`}></div>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 md:p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-50 min-h-[350px] flex flex-col">
        
        {currentStep === 1 && (
          <div className="animate-fade-in space-y-3 flex-grow">
            <header className="mb-2">
              <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Paso 1 de 4</span>
              <h2 className="text-lg font-bold text-slate-800">Tu Salud Primero</h2>
            </header>
            <div className="grid gap-2">
              <SafetyCard label="Embarazo o Lactancia" onCheck={() => handleSafetyCheck(true)} />
              <SafetyCard label="Menor de 18 años" onCheck={() => handleSafetyCheck(true)} />
              <SafetyCard label="Diabetes, TCA o patología cardíaca" onCheck={() => handleSafetyCheck(true)} />
              <SafetyCard label="Medicación Metabólica" onCheck={() => handleSafetyCheck(true)} />
            </div>
            <div className="bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
              <p className="text-[9px] text-emerald-700 font-bold text-center">
                👉 Si no marcas nada, simplemente pulsa "Continuar".
              </p>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-fade-in space-y-4 flex-grow">
            <header>
              <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Paso 2 de 4</span>
              <h2 className="text-lg font-bold text-slate-800">Tu Perfil</h2>
            </header>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-center">Sexo</label>
                <div className="flex gap-1.5">
                  <ToggleButton active={data.sex === 'female'} onClick={() => setData({...data, sex: 'female'})} label="Mujer" />
                  <ToggleButton active={data.sex === 'male'} onClick={() => setData({...data, sex: 'male'})} label="Hombre" />
                </div>
              </div>
              <div>
                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-center">Edad</label>
                <input type="number" value={data.age || ''} onFocus={() => setData({...data, age: '' as any})} onChange={e => setData({...data, age: e.target.value === '' ? '' as any : +e.target.value})} className="w-full p-2 bg-slate-50 border-0 rounded-lg text-center font-bold text-base focus:ring-1 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-center">Peso (kg)</label>
                <input type="number" value={data.weight || ''} onFocus={() => setData({...data, weight: '' as any})} onChange={e => setData({...data, weight: e.target.value === '' ? '' as any : +e.target.value})} className="w-full p-2 bg-slate-50 border-0 rounded-lg text-center font-bold text-base focus:ring-1 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-center">Altura (cm)</label>
                <input type="number" value={data.height || ''} onFocus={() => setData({...data, height: '' as any})} onChange={e => setData({...data, height: e.target.value === '' ? '' as any : +e.target.value})} className="w-full p-2 bg-slate-50 border-0 rounded-lg text-center font-bold text-base focus:ring-1 focus:ring-emerald-500" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-fade-in space-y-4 flex-grow">
            <header>
              <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Paso 3 de 4</span>
              <h2 className="text-lg font-bold text-slate-800">Tu Energía</h2>
            </header>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <ActivityBtn active={data.activity === ActivityLevel.SEDENTARY} label="Suave" desc="Poco activo" onClick={() => setData({...data, activity: ActivityLevel.SEDENTARY})} />
                <ActivityBtn active={data.activity === ActivityLevel.LIGHT} label="Activo" desc="1-2 días" onClick={() => setData({...data, activity: ActivityLevel.LIGHT})} />
                <ActivityBtn active={data.activity === ActivityLevel.MODERATE} label="Enérgico" desc="3-4 días" onClick={() => setData({...data, activity: ActivityLevel.MODERATE})} />
                <ActivityBtn active={data.activity === ActivityLevel.HIGH} label="Atlético" desc="Deporte diario" onClick={() => setData({...data, activity: ActivityLevel.HIGH})} />
              </div>
              <div className="flex gap-2">
                <ToggleButton active={data.diet === DietPreference.OMNIVORE} label="De todo" onClick={() => setData({...data, diet: DietPreference.OMNIVORE})} />
                <ToggleButton active={data.diet === DietPreference.VEGETARIAN} label="Vegetariano" onClick={() => setData({...data, diet: DietPreference.VEGETARIAN})} />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="animate-fade-in space-y-4 flex-grow">
            <header>
              <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Paso 4 de 4</span>
              <h2 className="text-lg font-bold text-slate-800">Horario y Ayuno</h2>
            </header>
            <div className="grid gap-1.5">
              <FastingOption active={data.fastingType === 'none'} onClick={() => setData({...data, fastingType: 'none'})} title="Tradicional" desc="Sin ayunos." icon="⏰" />
              <FastingOption active={data.fastingType === '12-20'} onClick={() => setData({...data, fastingType: '12-20'})} title="Ayuno 12h-20h" desc="Cenas tarde." icon="🌙" />
              <FastingOption active={data.fastingType === '9-17'} onClick={() => setData({...data, fastingType: '9-17'})} title="Ayuno 09h-17h" desc="Cenas pronto." icon="☀️" />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <select value={data.budget} onChange={e => setData({...data, budget: e.target.value as any})} className="p-2 bg-slate-50 border-0 rounded-lg font-bold text-[10px] text-slate-700">
                <option value="bajo">Económico</option><option value="medio">Medio</option><option value="alto">Gourmet</option>
              </select>
              <select value={data.cookingTime} onChange={e => setData({...data, cookingTime: e.target.value as any})} className="p-2 bg-slate-50 border-0 rounded-lg font-bold text-[10px] text-slate-700">
                <option value="rapido">Exprés</option><option value="normal">Cocinar</option>
              </select>
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2 pt-4 border-t border-slate-50">
          <button onClick={prev} className="p-2.5 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200">
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
          <button onClick={currentStep === totalSteps ? () => onComplete(data) : next} className="flex-grow py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs">
            {currentStep === totalSteps ? '¡Ver mi Plan! ✨' : 'Continuar'}
          </button>
        </div>
      </div>
    </div>
  );
};

const FastingOption = ({ active, onClick, title, desc, icon }: any) => (
  <button onClick={onClick} className={`w-full p-2.5 rounded-lg border-2 text-left flex items-center gap-2.5 transition-all ${active ? 'border-emerald-600 bg-emerald-50' : 'border-slate-50 bg-slate-50'}`}>
    <div className="text-lg">{icon}</div>
    <div className="flex-grow">
      <p className={`text-[10px] font-bold block ${active ? 'text-emerald-700' : 'text-slate-700'}`}>{title}</p>
      <p className="text-[8px] text-slate-400 leading-tight">{desc}</p>
    </div>
  </button>
);

const SafetyCard = ({ label, onCheck }: any) => (
  <label className="flex items-center gap-2 p-2 border border-slate-100 rounded-lg hover:bg-emerald-50 cursor-pointer group">
    <input type="checkbox" onChange={e => e.target.checked && onCheck()} className="w-3.5 h-3.5 rounded text-emerald-500" />
    <span className="text-[10px] text-slate-700 font-medium">{label}</span>
  </label>
);

const ToggleButton = ({ active, onClick, label }: any) => (
  <button onClick={onClick} className={`flex-1 py-2 rounded-lg font-bold text-[10px] transition-all ${active ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-400'}`}>{label}</button>
);

const ActivityBtn = ({ active, label, desc, onClick }: any) => (
  <button onClick={onClick} className={`p-2 rounded-lg border-2 text-left transition-all ${active ? 'border-emerald-600 bg-emerald-50' : 'border-slate-50 bg-slate-50 opacity-60'}`}>
    <p className={`text-[10px] font-bold block ${active ? 'text-emerald-700' : 'text-slate-700'}`}>{label}</p>
    <p className="text-[7px] text-slate-400 uppercase font-black tracking-widest">{desc}</p>
  </button>
);

export default Onboarding;
