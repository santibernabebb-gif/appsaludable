
import React, { useState } from 'react';
import { UserData, WeeklyPlan } from '../types';
import { calculateTDEE, calculateTargetCalories } from '../constants';
import { generatePlan } from '../services/geminiService';

interface Props {
  onComplete: (user: UserData, plan: WeeklyPlan) => void;
  onCancel: () => void;
}

const Onboarding: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserData>({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'weight' || name === 'height' ? Number(value) : value
    }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    if (step === 1) onCancel();
    else setStep(s => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const tdee = calculateTDEE(
        formData.gender,
        formData.weight,
        formData.height,
        formData.age,
        formData.activityLevel
      );
      const targetCals = calculateTargetCalories(tdee, formData.goal);
      
      const plan = await generatePlan(formData, targetCals);
      onComplete(formData, plan);
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

  return (
    <div className="relative min-h-screen max-w-3xl mx-auto px-6 py-24 fade-in flex flex-col">
      <Branding />
      
      <button onClick={prevStep} className="mb-8 flex items-center text-primary-600 font-semibold hover:text-primary-700 w-fit">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        {step === 1 ? 'Volver' : 'Atrás'}
      </button>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Datos Básicos y Objetivo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sexo</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none">
                  <option value="male">Hombre</option>
                  <option value="female">Mujer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Edad</label>
                <input required type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Peso Actual (kg)</label>
                <input required type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Altura (cm)</label>
                <input required type="number" name="height" value={formData.height} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nivel de Actividad</label>
                <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none">
                  <option value="sedentary">Sedentario (Oficina)</option>
                  <option value="light">Ligero (1-3 días)</option>
                  <option value="moderate">Moderado (3-5 días)</option>
                  <option value="heavy">Intenso (Deporte diario)</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">Selecciona tu Objetivo Principal:</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'lose', label: 'Perder Peso' },
                  { id: 'maintain', label: 'Mantenerse' },
                  { id: 'gain', label: 'Ganar Músculo' }
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setFormData(p => ({...p, goal: g.id as any}))}
                    className={`py-4 px-4 rounded-xl border text-sm font-bold transition-all ${formData.goal === g.id ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-primary-400'}`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={nextStep}
              disabled={!formData.name}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ayuno Intermitente y Alergias</h2>
            <p className="text-sm text-gray-500 mb-6">Configura tus horarios de alimentación.</p>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">¿Deseas realizar Ayuno Intermitente?</label>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 'none', label: 'Sin Ayuno', desc: 'Ventana de 12-14h. Incluye todas las comidas (Desayuno a Cena).' },
                  { id: '16:8_morning', label: '16:8 - Mañana (Salta el desayuno)', desc: 'Comes de 12:00h a 20:00h. Ayunas 16h.' },
                  { id: '16:8_evening', label: '16:8 - Tarde (Salta la cena)', desc: 'Comes de 08:00h a 16:00h. Ayunas 16h.' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFormData(p => ({...p, fasting: f.id as any}))}
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Alergias o Restricciones (AESAN)</label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="Ej: gluten, lactosa, marisco, etc."
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Generar Plan Supervisado por AESAN
            </button>
          </div>
        )}
      </div>

      <FooterAESAN />
    </div>
  );
};

export default Onboarding;
