
import React, { useState } from 'react';
import { UserData, WeeklyPlan } from '../types';
import { calculateTDEE, calculateTargetCalories } from '../constants';
import { generatePlan } from '../services/geminiService';

interface Props {
  onComplete: (user: UserData, plan: WeeklyPlan) => void;
  onCancel: () => void;
}

interface ValidationErrors {
  age?: string;
  weight?: string;
  height?: string;
}

const Onboarding: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  
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

  const validateField = (name: string, value: any) => {
    let errorMsg = '';
    const num = Number(value);
    
    if (name === 'age') {
      if (isNaN(num) || num <= 0 || num > 115) errorMsg = 'Edad no válida';
    } else if (name === 'weight') {
      if (isNaN(num) || num < 25 || num > 350) errorMsg = 'Peso fuera de rango';
    } else if (name === 'height') {
      if (isNaN(num) || num < 60 || num > 250) errorMsg = 'Altura no válida';
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: errorMsg || undefined
    }));
    return !errorMsg;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'age' || name === 'weight' || name === 'height') {
      if (value !== '') {
        validateField(name, value);
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (name === 'age' || name === 'weight' || name === 'height') {
      setFormData(prev => ({ ...prev, [name]: '' }));
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const nextStep = () => {
    if (step === 1) {
      const isAgeOk = validateField('age', formData.age);
      const isWeightOk = validateField('weight', formData.weight);
      const isHeightOk = validateField('height', formData.height);
      if (isAgeOk && isWeightOk && isHeightOk && formData.name) {
        setStep(2);
      }
    } else if (step === 2) {
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step === 1) onCancel();
    else setStep(s => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convertir a números finales para el cálculo
      const finalData: UserData = {
        ...formData,
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
    <div className="absolute top-6 left-6 text-left no-print">
      <p className="text-sm font-bold text-primary-700 leading-none">AdelgazaSaludable</p>
      <p className="text-[10px] text-gray-400 font-medium">SantiSystems</p>
    </div>
  );

  const FooterAESAN = () => (
    <div className="mt-12 pt-8 border-t border-gray-100 w-full text-center max-w-2xl mx-auto">
      <p className="text-[11px] text-gray-400 leading-relaxed italic">
        Estas recetas siguen estrictamente las directrices nutricionales de la <span className="font-bold text-gray-500">AESAN</span>. 
        IA supervisada para garantizar que las sugerencias sean reales y saludables.
      </p>
    </div>
  );

  const InputField = ({ label, name, type, value, placeholder = "" }: any) => {
    const hasError = !!errors[name as keyof ValidationErrors];
    return (
      <div className="flex flex-col">
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-lg ${
            hasError 
              ? 'border-red-500 ring-4 ring-red-100 bg-red-50 text-red-900' 
              : 'border-gray-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500'
          }`}
        />
        {hasError && <p className="mt-1.5 text-xs font-bold text-red-600 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          {errors[name as keyof ValidationErrors]}
        </p>}
      </div>
    );
  };

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

  const isStep1Disabled = !formData.name || !formData.age || !formData.weight || !formData.height || !!errors.age || !!errors.weight || !!errors.height;

  return (
    <div className="relative min-h-screen max-w-3xl mx-auto px-6 py-24 fade-in flex flex-col">
      <Branding />
      
      <button onClick={prevStep} className="mb-8 flex items-center text-primary-600 font-semibold hover:text-primary-700 w-fit transition-transform hover:-translate-x-1">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        {step === 1 ? 'Volver' : 'Atrás'}
      </button>

      <div className="mb-8 flex justify-between items-center px-2">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-2 flex-1 mx-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-primary-500' : 'bg-gray-200'}`} />
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl animate-bounce">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 fade-in">
            <h2 className="text-2xl font-black text-gray-900">Cuéntanos sobre ti</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none text-lg transition-all" placeholder="¿Cómo te llamas?" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sexo</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-lg focus:ring-4 focus:ring-primary-100">
                  <option value="male">Hombre</option>
                  <option value="female">Mujer</option>
                </select>
              </div>
              <InputField label="Edad" name="age" type="number" value={formData.age} />
              <InputField label="Peso Actual (kg)" name="weight" type="number" value={formData.weight} />
              <InputField label="Altura (cm)" name="height" type="number" value={formData.height} />
            </div>

            <button
              onClick={nextStep}
              disabled={isStep1Disabled}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente: Mi estilo de vida
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 fade-in">
            <h2 className="text-2xl font-black text-gray-900">Estilo de vida y Meta</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">¿Cuál es tu nivel de actividad?</label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'sedentary', label: 'Sedentario', desc: 'Poco o ningún ejercicio.' },
                    { id: 'light', label: 'Ligero', desc: 'Ejercicio suave 1-3 días/semana.' },
                    { id: 'moderate', label: 'Moderado', desc: 'Deporte intenso 3-5 días/semana.' },
                    { id: 'heavy', label: 'Muy Activo', desc: 'Entrenamiento diario intenso.' }
                  ].map((act) => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setFormData((p: any) => ({...p, activityLevel: act.id}))}
                      className={`p-4 rounded-2xl border text-left transition-all ${formData.activityLevel === act.id ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500' : 'bg-white border-gray-200 hover:border-primary-300'}`}
                    >
                      <p className="font-bold text-gray-900">{act.label}</p>
                      <p className="text-xs text-gray-500">{act.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-8">
                <label className="block text-sm font-semibold text-gray-700 mb-4">¿Cuál es tu objetivo principal?</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'lose', label: 'Perder Peso' },
                    { id: 'maintain', label: 'Mantenerme' },
                    { id: 'gain', label: 'Ganar Músculo' }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setFormData((p: any) => ({...p, goal: g.id}))}
                      className={`py-4 px-2 rounded-2xl border text-sm font-bold transition-all ${formData.goal === g.id ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-primary-400'}`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={nextStep}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98]"
            >
              Casi listo: Preferencias
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 fade-in">
            <h2 className="text-2xl font-black text-gray-900">Ajustes Finales</h2>
            
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">¿Deseas realizar Ayuno Intermitente?</label>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'none', label: 'Sin Ayuno', desc: 'Ventana tradicional. Todas las comidas incluidas.' },
                    { id: '16:8_morning', label: '16:8 - Mañana (Sin Desayuno)', desc: 'Comes de 12:00h a 20:00h.' },
                    { id: '16:8_evening', label: '16:8 - Tarde (Sin Cena)', desc: 'Comes de 08:00h a 16:00h.' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFormData((p: any) => ({...p, fasting: f.id}))}
                      className={`p-5 rounded-2xl border text-left transition-all ${formData.fasting === f.id ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500 shadow-sm' : 'bg-white border-gray-200 hover:border-primary-300'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-bold ${formData.fasting === f.id ? 'text-primary-700' : 'text-gray-900'}`}>{f.label}</span>
                        {formData.fasting === f.id && <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Alergias o Restricciones</label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all text-lg"
                  placeholder="Ej: gluten, marisco, nueces..."
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Generar Mi Plan Nutricional AESAN
            </button>
          </div>
        )}
      </div>

      <FooterAESAN />
    </div>
  );
};

export default Onboarding;
