
import React, { useState, useEffect } from 'react';
import { UserData, WeeklyPlan } from '../types';
import { calculateTDEE, calculateTargetCalories } from '../constants';
import { generatePlan } from '../services/geminiService';

interface Props {
  onComplete: (user: UserData, plan: WeeklyPlan) => void;
  onCancel: () => void;
  onViewHistory: () => void;
  hasHistory: boolean;
}

const Onboarding: React.FC<Props> = ({ onComplete, onCancel, onViewHistory, hasHistory }) => {
  const [step, setStep] = useState(1);
  const [subStep4, setSubStep4] = useState(0); // 0 para actividad, 1 para objetivo (solo móvil)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [isBlocked, setIsBlocked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const [formData, setFormData] = useState<any>({
    name: '',
    age: 30,
    weight: 75,
    height: 175,
    gender: 'male',
    activityLevel: 'light',
    goal: 'lose',
    dietType: 'mediterranean',
    fasting: 'none',
    allergies: ''
  });

  const [safetyCheck, setSafetyCheck] = useState({
    pregnancy: false,
    under18: false,
    diabetesHeart: false,
    eatingDisorders: false
  });

  // Detección de dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ 
      ...prev, 
      [name]: value 
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev: any) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (name === 'age' || name === 'weight' || name === 'height') {
      setFormData((prev: any) => ({ ...prev, [name]: '' }));
      setFieldErrors((prev: any) => ({ ...prev, [name]: undefined }));
    }
  };

  const nextStep = () => {
    if (step === 1) {
      const hasMedicalCondition = Object.values(safetyCheck).some(val => val === true);
      if (hasMedicalCondition) {
        setIsBlocked(true);
        return;
      }
    } else if (step === 2) {
      const age = Number(formData.age);
      const weight = Number(formData.weight);
      const height = Number(formData.height);
      const errors: any = {};

      if (!formData.age || isNaN(age) || age < 14 || age > 100) {
        errors.age = "Edad no válida (14-100)";
      }
      if (!formData.weight || isNaN(weight) || weight < 35 || weight > 250) {
        errors.weight = "Peso no válido (35-250)";
      }
      if (!formData.height || isNaN(height) || height < 120 || height > 230) {
        errors.height = "Altura no válida (120-230)";
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      setFieldErrors({});
    } else if (step === 4 && isMobile && subStep4 === 0) {
      setSubStep4(1);
      return;
    }
    setStep(s => s + 1);
  };

  const prevStep = () => {
    if (step === 4 && isMobile && subStep4 === 1) {
      setSubStep4(0);
      return;
    }
    if (step === 1) onCancel();
    else setStep(s => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const finalData: UserData = {
        ...formData,
        name: formData.name.trim() || 'Usuario',
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height)
      };

      const tdee = calculateTDEE(
        finalData.gender,
        finalData.weight,
        finalData.height,
        finalData.age,
        finalData.activityLevel
      );
      const targetCals = calculateTargetCalories(tdee, finalData.goal);
      
      const plan = await generatePlan(finalData, targetCals);
      onComplete(finalData, plan);
    } catch (err: any) {
      setError(err.message || 'Error al generar el plan');
    } finally {
      setLoading(false);
    }
  };

  const Branding = () => (
    <div className="absolute top-4 md:top-6 left-6 text-left no-print">
      <p className="text-sm font-bold text-primary-700 leading-none">AdelgazaSaludable</p>
      <p className="text-[10px] text-gray-400 font-medium">SantiSystems</p>
    </div>
  );

  const FooterAESAN = () => (
    <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-100 w-full text-center max-w-2xl mx-auto">
      <p className="text-[10px] md:text-[11px] text-gray-400 leading-relaxed italic">
        Estas recetas siguen estrictamente las directrices nutricionales de la <span className="font-bold text-gray-500">AESAN</span>. 
        IA supervisada para garantizar que las sugerencias sean reales y saludables.
      </p>
      <p className="text-[9px] text-gray-300 mt-3 font-medium uppercase">SantiSystems 2026</p>
    </div>
  );

  const TopNavigation = () => (
    <div className="absolute top-4 md:top-6 right-6 flex flex-col items-end gap-2 no-print">
      {step >= 2 && (
        <button 
          onClick={onCancel}
          className="text-[10px] md:text-xs font-bold text-gray-500 hover:text-gray-700 flex items-center bg-white shadow-sm border border-gray-100 px-3 py-1.5 rounded-xl transition-all active:scale-95"
        >
          <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Inicio
        </button>
      )}
      <button 
        onClick={onViewHistory}
        className="text-[10px] md:text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center bg-white shadow-sm border border-primary-50 px-3 py-1.5 rounded-xl transition-all active:scale-95"
      >
        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Historial recetas
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6 text-center">
        <Branding />
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Generando Plan Saludable...</h2>
        <p className="text-gray-500 max-w-xs">Nuestra IA supervisada por la AESAN está configurando tus comidas.</p>
        <FooterAESAN />
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className="relative min-h-screen max-w-3xl mx-auto px-6 py-12 md:py-24 fade-in flex flex-col items-center justify-center text-center">
        <Branding />
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-red-100 space-y-6 w-full">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900">Aviso de Seguridad</h2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            Por tu seguridad, esta aplicación no es adecuada para tu situación. 
            <br />
            <strong>Consulta con un profesional sanitario.</strong>
          </p>
          <button
            onClick={() => onCancel()}
            className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98]"
          >
            Volver atrás
          </button>
        </div>
        <FooterAESAN />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen max-w-3xl mx-auto px-6 pt-16 md:pt-24 pb-8 md:pb-24 fade-in flex flex-col">
      <Branding />
      <TopNavigation />
      
      <button onClick={prevStep} className="mb-4 md:mb-8 flex items-center text-primary-600 font-semibold hover:text-primary-700 w-fit transition-transform hover:-translate-x-1">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        {step === 1 ? 'Volver' : 'Atrás'}
      </button>

      <div className="mb-6 md:mb-10 flex justify-between items-center px-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`h-2 flex-1 mx-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-primary-500' : 'bg-gray-200'}`} />
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl">
          <p>{error}</p>
        </div>
      )}

      <div className="flex-1 flex flex-col justify-start">
        {step === 1 && (
          <div className="space-y-6 md:space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 fade-in">
            <h2 className="text-xl md:text-2xl font-black text-gray-900">Tu Salud Primero</h2>
            <p className="text-gray-500 text-sm">Por favor, indícanos si te encuentras en alguna de las siguientes situaciones:</p>
            
            <div className="space-y-3 md:space-y-4">
              {[
                { id: 'pregnancy', label: 'Embarazo o Lactancia' },
                { id: 'under18', label: 'Menor de 18 años' },
                { id: 'diabetesHeart', label: 'Diabetes o cardiopatías' },
                { id: 'eatingDisorders', label: 'Trastornos alimentarios' }
              ].map((item) => (
                <label key={item.id} className="flex items-center p-4 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all">
                  <input
                    type="checkbox"
                    checked={(safetyCheck as any)[item.id]}
                    onChange={(e) => setSafetyCheck(prev => ({ ...prev, [item.id]: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 accent-primary-600"
                  />
                  <span className="ml-4 text-gray-700 font-semibold text-sm md:text-base">{item.label}</span>
                </label>
              ))}
            </div>

            <button
              onClick={nextStep}
              className="w-full py-4 md:py-5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98]"
            >
              Siguiente Paso
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 md:space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 fade-in">
            <h2 className="text-xl md:text-2xl font-black text-gray-900">Datos Físicos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sexo</label>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <button 
                    onClick={() => setFormData((p: any) => ({...p, gender: 'male'}))} 
                    className={`py-3 md:py-4 rounded-xl border font-bold transition-all text-sm md:text-base ${formData.gender === 'male' ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-500'}`}
                  >
                    Hombre
                  </button>
                  <button 
                    onClick={() => setFormData((p: any) => ({...p, gender: 'female'}))} 
                    className={`py-3 md:py-4 rounded-xl border font-bold transition-all text-sm md:text-base ${formData.gender === 'female' ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-500'}`}
                  >
                    Mujer
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 mb-1 md:mb-2">Edad</label>
                <input 
                  type="number" 
                  name="age" 
                  value={formData.age} 
                  onChange={handleChange} 
                  onFocus={handleFocus}
                  className={`w-full px-4 py-3 md:py-4 rounded-xl border outline-none text-lg md:text-xl font-bold text-gray-900 transition-colors ${fieldErrors.age ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} 
                />
                {fieldErrors.age && <p className="text-red-500 text-[11px] mt-1 font-bold">{fieldErrors.age}</p>}
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 mb-1 md:mb-2">Peso (kg)</label>
                <input 
                  type="number" 
                  name="weight" 
                  value={formData.weight} 
                  onChange={handleChange} 
                  onFocus={handleFocus}
                  className={`w-full px-4 py-3 md:py-4 rounded-xl border outline-none text-lg md:text-xl font-bold text-gray-900 transition-colors ${fieldErrors.weight ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} 
                />
                {fieldErrors.weight && <p className="text-red-500 text-[11px] mt-1 font-bold">{fieldErrors.weight}</p>}
              </div>

              <div className="md:col-span-2 flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 mb-1 md:mb-2">Altura (cm)</label>
                <input 
                  type="number" 
                  name="height" 
                  value={formData.height} 
                  onChange={handleChange} 
                  onFocus={handleFocus}
                  className={`w-full px-4 py-3 md:py-4 rounded-xl border outline-none text-lg md:text-xl font-bold text-gray-900 transition-colors ${fieldErrors.height ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} 
                />
                {fieldErrors.height && <p className="text-red-500 text-[11px] mt-1 font-bold">{fieldErrors.height}</p>}
              </div>
            </div>

            <button
              onClick={nextStep}
              className="w-full py-4 md:py-5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98]"
            >
              Siguiente
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 md:space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 fade-in text-center">
            <h2 className="text-xl md:text-2xl font-black text-gray-900">¿Cómo te llamas?</h2>
            <div className="max-w-md mx-auto">
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="w-full px-4 py-4 md:py-5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none text-xl md:text-2xl text-center font-bold text-gray-900 transition-all" 
                placeholder="Nombre (Opcional)" 
              />
              <p className="mt-4 text-xs md:text-sm text-gray-400">Puedes continuar sin introducir un nombre.</p>
            </div>

            <button
              onClick={nextStep}
              className="w-full py-4 md:py-5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98]"
            >
              Siguiente Paso
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 md:space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 fade-in">
            <h2 className="text-xl md:text-2xl font-black text-gray-900">
              {isMobile ? (subStep4 === 0 ? 'Nivel de Actividad' : 'Tu Objetivo') : 'Actividad y Objetivo'}
            </h2>
            
            <div className="space-y-6">
              {/* Parte de Actividad */}
              {(!isMobile || subStep4 === 0) && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 md:mb-4">Nivel de actividad:</label>
                  <div className="grid grid-cols-1 gap-2 md:gap-3">
                    {[
                      { id: 'sedentary', label: 'Sedentario', desc: 'Poco movimiento.' },
                      { id: 'light', label: 'Ligero', desc: 'Ejercicio suave 1-3 días.' },
                      { id: 'moderate', label: 'Moderado', desc: 'Deporte activo 3-5 días.' },
                      { id: 'heavy', label: 'Intenso', desc: 'Entrenamiento diario.' }
                    ].map((act) => (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => setFormData((p: any) => ({...p, activityLevel: act.id}))}
                        className={`p-3 md:p-4 rounded-xl md:rounded-2xl border text-left transition-all ${formData.activityLevel === act.id ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500' : 'bg-white border-gray-200 hover:border-primary-300'}`}
                      >
                        <p className={`font-bold text-sm md:text-base ${formData.activityLevel === act.id ? 'text-primary-700' : 'text-gray-900'}`}>{act.label}</p>
                        <p className="text-[10px] md:text-xs text-gray-500">{act.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Parte de Objetivo */}
              {(!isMobile || subStep4 === 1) && (
                <div className={`${!isMobile ? 'border-t pt-6 md:pt-8' : ''}`}>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 md:mb-4">Tu Objetivo:</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                    {[
                      { id: 'lose', label: 'Perder Peso' },
                      { id: 'maintain', label: 'Mantenerme' },
                      { id: 'gain', label: 'Ganar Músculo' }
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setFormData((p: any) => ({...p, goal: g.id}))}
                        className={`py-3 md:py-4 px-2 rounded-xl md:rounded-2xl border text-xs md:text-sm font-bold transition-all ${formData.goal === g.id ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-500'}`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={nextStep}
              className="w-full py-4 md:py-5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98]"
            >
              {isMobile && subStep4 === 0 ? 'Siguiente' : 'Continuar: Preferencias'}
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 md:space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 fade-in">
            <h2 className="text-xl md:text-2xl font-black text-gray-900">Ajustes Finales</h2>
            
            <div className="space-y-6 md:space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 md:mb-4">Ayuno Intermitente:</label>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  {[
                    { id: 'none', label: 'Sin Ayuno', desc: 'Horario tradicional.' },
                    { id: '16:8_morning', label: '16:8 - Sin Desayuno', desc: 'Comes desde las 12:00h.' },
                    { id: '16:8_evening', label: '16:8 - Sin Cena', desc: 'Terminas a las 16:00h.' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFormData((p: any) => ({...p, fasting: f.id}))}
                      className={`p-4 md:p-5 rounded-xl md:rounded-2xl border text-left transition-all ${formData.fasting === f.id ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500' : 'bg-white border-gray-200'}`}
                    >
                      <span className={`font-bold block text-sm md:text-base ${formData.fasting === f.id ? 'text-primary-700' : 'text-gray-900'}`}>{f.label}</span>
                      <p className="text-[10px] md:text-xs text-gray-500">{f.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6 md:pt-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Alergias:</label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 md:py-4 rounded-xl md:rounded-2xl border border-gray-200 outline-none text-base md:text-lg font-medium"
                  placeholder="Ej: gluten, lactosa..."
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-4 md:py-5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98]"
            >
              Generar Mi Plan
            </button>
          </div>
        )}
      </div>

      <FooterAESAN />
    </div>
  );
};

export default Onboarding;
