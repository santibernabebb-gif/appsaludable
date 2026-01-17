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
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const totalSteps = 4;

  const validateCurrentStep = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (currentStep === 2) {
      // Validación de Edad
      if (!data.age && data.age !== 0) {
        newErrors.age = "Campo obligatorio";
      } else if (data.age > 110) {
        newErrors.age = "Edad excesiva";
      } else if (data.age < 18) {
        newErrors.age = "Edad mínima 18";
      }

      // Validación de Peso
      if (!data.weight && data.weight !== 0) {
        newErrors.weight = "Campo obligatorio";
      } else if (data.weight > 350) {
        newErrors.weight = "Peso excesivo";
      } else if (data.weight < 35) {
        newErrors.weight = "Peso erróneo";
      }

      // Validación de Altura
      if (!data.height && data.height !== 0) {
        newErrors.height = "Campo obligatorio";
      } else if (data.height > 250) {
        newErrors.height = "Altura excesiva";
      } else if (data.height < 100) {
        newErrors.height = "Altura errónea";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    // Si hay un error en este campo, lo limpiamos inmediatamente al escribir
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const next = () => {
    if (validateCurrentStep()) {
      setCurrentStep(s => Math.min(s + 1, totalSteps));
    }
  };

  const prev = () => {
    if (currentStep === 1) {
      onCancel();
    } else {
      setCurrentStep(s => s - 1);
      setErrors({});
    }
  };

  const handleSafetyCheck = (checked: boolean) => {
    if (checked) setSafetyBlocked(true);
  };

  if (safetyBlocked) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-10 bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-emerald-50 animate-fade-in text-center">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 transform -rotate-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Priorizamos tu Salud</h2>
        <p className="text-base text-slate-500 mb-10 leading-relaxed font-medium">
          SantiSystems detecta que, para tu perfil actual, lo más seguro es <strong>consultar con un médico o nutricionista colegiado</strong> antes de iniciar cualquier plan nutricional automatizado. Tu seguridad es lo primero.
        </p>
        <button 
          onClick={onCancel}
          className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Entendido, volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 w-full flex-grow flex flex-col justify-center animate-fade-in">
      {/* Progress Bar */}
      <div className="mb-10 flex items-center justify-between gap-4 max-w-md mx-auto w-full">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className="flex-1 h-2.5 rounded-full bg-slate-200 relative overflow-hidden shadow-inner">
            <div 
              className={`absolute inset-0 bg-emerald-500 transition-all duration-700 ease-out ${currentStep >= s ? 'w-full' : 'w-0'}`}
            ></div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-slate-200/60 border border-slate-50 min-h-[550px] flex flex-col justify-between">
        
        {currentStep === 1 && (
          <div className="animate-fade-in space-y-8 flex-grow">
            <header className="mb-6 text-center sm:text-left">
              <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg mb-2">Paso 1 de 4</div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Tu Salud Primero</h2>
              <div className="bg-slate-50 p-5 rounded-[1.5rem] mt-5 border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                  Confírmanos si tienes alguna de estas situaciones para garantizar tu seguridad.
                  <span className="text-emerald-700 font-black text-[11px] uppercase block mt-3 border-t border-slate-200 pt-3 tracking-wide">
                    ⚠️ NOTA: Si marcas alguna casilla no podrás continuar. Si no tienes nada de esto, simplemente pulsa 'Siguiente Paso'.
                  </span>
                </p>
              </div>
            </header>
            <div className="grid gap-3 sm:grid-cols-2">
              <SafetyCard label="Embarazo o Lactancia" onCheck={() => handleSafetyCheck(true)} />
              <SafetyCard label="Menor de 18 años" onCheck={() => handleSafetyCheck(true)} />
              <SafetyCard label="Diabetes o cardiopatías" onCheck={() => handleSafetyCheck(true)} />
              <SafetyCard label="Trastornos alimentarios" onCheck={() => handleSafetyCheck(true)} />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-fade-in space-y-8 flex-grow">
            <header>
              <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg mb-2">Paso 2 de 4</div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Perfil Físico</h2>
              <p className="text-sm text-slate-500 font-medium mt-2 italic">Introduce tus datos para que SantiSystems ajuste las calorías de tu menú.</p>
            </header>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Sexo</label>
                <div className="flex gap-3">
                  <ToggleButton active={data.sex === 'female'} onClick={() => handleInputChange('sex', 'female')} label="Mujer" />
                  <ToggleButton active={data.sex === 'male'} onClick={() => handleInputChange('sex', 'male')} label="Hombre" />
                </div>
              </div>
              
              <div className="col-span-1">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Edad</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={data.age || ''} 
                    onFocus={() => handleInputChange('age', '')}
                    onChange={e => handleInputChange('age', e.target.value === '' ? '' : +e.target.value)} 
                    className={`w-full p-5 bg-slate-50 border-2 rounded-2xl text-center font-black text-2xl transition-all ${errors.age ? 'border-red-400 bg-red-50 text-red-900' : 'border-transparent focus:border-emerald-500 focus:bg-white'}`} 
                  />
                  {errors.age && (
                    <div className="absolute -bottom-6 left-0 right-0 text-center">
                      <p className="text-[10px] text-red-500 font-black uppercase animate-fade-in">{errors.age}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-1">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Peso (kg)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={data.weight || ''} 
                    onFocus={() => handleInputChange('weight', '')}
                    onChange={e => handleInputChange('weight', e.target.value === '' ? '' : +e.target.value)} 
                    className={`w-full p-5 bg-slate-50 border-2 rounded-2xl text-center font-black text-2xl transition-all ${errors.weight ? 'border-red-400 bg-red-50 text-red-900' : 'border-transparent focus:border-emerald-500 focus:bg-white'}`} 
                  />
                  {errors.weight && (
                    <div className="absolute -bottom-6 left-0 right-0 text-center">
                      <p className="text-[10px] text-red-500 font-black uppercase animate-fade-in">{errors.weight}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-1 lg:mx-auto lg:w-full">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Altura (cm)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={data.height || ''} 
                    onFocus={() => handleInputChange('height', '')}
                    onChange={e => handleInputChange('height', e.target.value === '' ? '' : +e.target.value)} 
                    className={`w-full p-5 bg-slate-50 border-2 rounded-2xl text-center font-black text-2xl transition-all ${errors.height ? 'border-red-400 bg-red-50 text-red-900' : 'border-transparent focus:border-emerald-500 focus:bg-white'}`} 
                  />
                  {errors.height && (
                    <div className="absolute -bottom-6 left-0 right-0 text-center">
                      <p className="text-[10px] text-red-500 font-black uppercase animate-fade-in">{errors.height}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-fade-in space-y-8 flex-grow">
            <header>
              <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg mb-2">Paso 3 de 4</div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Estilo de Vida</h2>
              <p className="text-sm text-slate-500 font-medium mt-2">¿Cómo es tu actividad física y qué tipo de dieta prefieres?</p>
            </header>
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ActivityBtn active={data.activity === ActivityLevel.SEDENTARY} label="Poca" desc="Sedentario" onClick={() => setData({...data, activity: ActivityLevel.SEDENTARY})} />
                <ActivityBtn active={data.activity === ActivityLevel.LIGHT} label="Ligera" desc="1-2 días" onClick={() => setData({...data, activity: ActivityLevel.LIGHT})} />
                <ActivityBtn active={data.activity === ActivityLevel.MODERATE} label="Media" desc="3-4 días" onClick={() => setData({...data, activity: ActivityLevel.MODERATE})} />
                <ActivityBtn active={data.activity === ActivityLevel.HIGH} label="Alta" desc="Diario" onClick={() => setData({...data, activity: ActivityLevel.HIGH})} />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <ToggleButton active={data.diet === DietPreference.OMNIVORE} label="Dieta Omnívora (De todo)" onClick={() => setData({...data, diet: DietPreference.OMNIVORE})} />
                <ToggleButton active={data.diet === DietPreference.VEGETARIAN} label="Dieta Vegetariana" onClick={() => setData({...data, diet: DietPreference.VEGETARIAN})} />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="animate-fade-in space-y-8 flex-grow">
            <header>
              <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg mb-2">Paso 4 de 4</div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Ajustes Finales</h2>
              <p className="text-sm text-slate-500 font-medium mt-2">Personaliza tus horarios y preferencias de cocina.</p>
            </header>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <FastingOption active={data.fastingType === 'none'} onClick={() => setData({...data, fastingType: 'none'})} title="Horario Clásico" desc="Comidas repartidas durante todo el día." icon="⏰" />
              <FastingOption active={data.fastingType === '12-20'} onClick={() => setData({...data, fastingType: '12-20'})} title="Ayuno Intermitente (12h-20h)" desc="Ventana de alimentación desde el mediodía." icon="🌙" />
              <FastingOption active={data.fastingType === '9-17'} onClick={() => setData({...data, fastingType: '9-17'})} title="Ayuno Intermitente (9h-17h)" desc="Para quienes prefieren terminar pronto su día." icon="☀️" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Presupuesto</label>
                <select value={data.budget} onChange={e => setData({...data, budget: e.target.value as any})} className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-black text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/30">
                  <option value="bajo">Económico</option>
                  <option value="medio">Equilibrado</option>
                  <option value="alto">Gourmet</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Cocinado</label>
                <select value={data.cookingTime} onChange={e => setData({...data, cookingTime: e.target.value as any})} className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-black text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/30">
                  <option value="rapido">Rápido (Exprés)</option>
                  <option value="normal">Con tiempo (Elaborado)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 flex gap-4 pt-10 border-t border-slate-100">
          <button onClick={prev} className="px-8 py-5 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-2 group">
            <svg className="w-5 h-5 rotate-180 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
          <button 
            onClick={currentStep === totalSteps ? () => onComplete(data) : next}
            className="flex-grow py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 transition-all text-sm md:text-base transform active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {currentStep === totalSteps ? '¡Generar Plan SantiSystems! ✨' : 'Siguiente Paso'}
            {currentStep !== totalSteps && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>}
          </button>
        </div>
      </div>
    </div>
  );
};

const FastingOption = ({ active, onClick, title, desc, icon }: any) => (
  <button onClick={onClick} className={`w-full p-5 rounded-2xl border-2 text-left flex items-center gap-5 transition-all transform ${active ? 'border-emerald-600 bg-emerald-50 shadow-md translate-x-1' : 'border-slate-50 bg-slate-50 hover:bg-slate-100'}`}>
    <div className="text-3xl shrink-0 bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm">{icon}</div>
    <div className="flex-grow">
      <p className={`text-base font-black block ${active ? 'text-emerald-800' : 'text-slate-700'}`}>{title}</p>
      <p className="text-[12px] text-slate-400 font-bold leading-tight mt-0.5">{desc}</p>
    </div>
  </button>
);

const SafetyCard = ({ label, onCheck }: any) => (
  <label className="flex items-center gap-4 p-5 border-2 border-slate-50 rounded-2xl hover:bg-emerald-50 cursor-pointer transition-all group">
    <input type="checkbox" onChange={e => e.target.checked && onCheck()} className="w-6 h-6 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0 transition-all cursor-pointer" />
    <span className="text-sm text-slate-700 font-bold group-hover:text-emerald-800 transition-colors">{label}</span>
  </label>
);

const ToggleButton = ({ active, onClick, label }: any) => (
  <button onClick={onClick} className={`flex-1 py-5 rounded-2xl font-black text-sm transition-all shadow-sm ${active ? 'bg-emerald-600 text-white shadow-emerald-200 ring-4 ring-emerald-50' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{label}</button>
);

const ActivityBtn = ({ active, label, desc, onClick }: any) => (
  <button onClick={onClick} className={`p-5 rounded-2xl border-2 text-left transition-all transform ${active ? 'border-emerald-600 bg-emerald-50 shadow-md scale-[1.02]' : 'border-slate-50 bg-slate-50 opacity-70 hover:opacity-100'}`}>
    <p className={`text-base font-black block ${active ? 'text-emerald-800' : 'text-slate-700'}`}>{label}</p>
    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">{desc}</p>
  </button>
);

export default Onboarding;