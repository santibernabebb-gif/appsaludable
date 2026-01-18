
import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { UserData } from '../types';
import { ArrowLeft, Check } from 'lucide-react';

const Wizard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    age: 30,
    sex: 'mujer',
    weight: 70,
    height: 165,
    activity: 'moderado',
    goal: 'perder',
    allergies: '',
    healthConditions: {
      pregnancy: false,
      underage: false,
      diabetesTca: false,
      metabolicMeds: false,
    }
  });

  const updateField = (field: keyof UserData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateHealth = (key: keyof UserData['healthConditions']) => {
    setFormData(prev => ({
      ...prev,
      healthConditions: {
        ...prev.healthConditions,
        [key]: !prev.healthConditions[key]
      }
    }));
  };

  const submitFinal = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/plan-base-week', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Error al generar el plan');
      const data = await response.json();
      sessionStorage.setItem('weeklyPlan', JSON.stringify(data));
      sessionStorage.setItem('userData', JSON.stringify(formData));
      navigate('/plan');
    } catch (err) {
      alert("Hubo un error generando el plan. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  const currentStep = location.pathname.split('/').pop();
  const stepNumber = currentStep === 'step-1' ? 1 : 
                     currentStep === 'step-2' ? 2 :
                     currentStep === 'step-3' ? 3 : 4;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center">
      {/* Progress Bar Container */}
      <div className="w-full mb-12">
        <div className="flex justify-between mb-4">
          {[1, 2, 3, 4].map(num => (
            <div key={num} className={`h-1.5 rounded-full transition-all duration-500 ${num <= stepNumber ? 'bg-[#00a86b]' : 'bg-gray-200'}`} style={{ width: '23%' }} />
          ))}
        </div>
        
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-emerald-100/30 border border-gray-50 relative overflow-hidden">
          <Routes>
            <Route path="step-1" element={
              <div className="space-y-8">
                <div>
                  <span className="text-[10px] font-bold text-[#00a86b] uppercase tracking-widest mb-2 block">PASO 1 DE 4</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Tu Salud Primero</h2>
                  <p className="text-slate-500">Confírmanos si te encuentras en alguna de estas situaciones:</p>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'pregnancy', label: 'Embarazo o Lactancia' },
                    { key: 'underage', label: 'Menor de 18 años' },
                    { key: 'diabetesTca', label: 'Diabetes, TCA o patología cardíaca' },
                    { key: 'metabolicMeds', label: 'Medicación Metabólica Especial' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => updateHealth(item.key as any)}
                      className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                        formData.healthConditions[item.key as keyof UserData['healthConditions']]
                          ? 'border-[#00a86b] bg-emerald-50/30 text-emerald-900'
                          : 'border-gray-100 bg-white hover:border-emerald-100 text-slate-700'
                      }`}
                    >
                      <span className="font-medium text-left">{item.label}</span>
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                        formData.healthConditions[item.key as keyof UserData['healthConditions']]
                          ? 'bg-[#00a86b] border-[#00a86b]'
                          : 'bg-white border-gray-200'
                      }`}>
                        {formData.healthConditions[item.key as keyof UserData['healthConditions']] && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-8">
                  <button 
                    onClick={() => navigate('/')}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => navigate('/wizard/step-2')}
                    className="flex-grow ml-4 bg-[#00a86b] hover:bg-[#008f5a] text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200/50 transition-all active:scale-95"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            } />

            <Route path="step-2" element={
              <div className="space-y-8">
                <div>
                  <span className="text-[10px] font-bold text-[#00a86b] uppercase tracking-widest mb-2 block">PASO 2 DE 4</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Datos Básicos</h2>
                  <p className="text-slate-500">¿Qué edad tienes y cuál es tu sexo biológico?</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Edad</label>
                    <input type="number" value={formData.age} onChange={(e) => updateField('age', Number(e.target.value))} className="input-field py-4" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Sexo</label>
                    <select value={formData.sex} onChange={(e) => updateField('sex', e.target.value)} className="input-field py-4">
                      <option value="mujer">Mujer</option>
                      <option value="hombre">Hombre</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-8">
                  <button onClick={() => navigate(-1)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                  <button onClick={() => navigate('/wizard/step-3')} className="flex-grow ml-4 bg-[#00a86b] hover:bg-[#008f5a] text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200/50">Continuar</button>
                </div>
              </div>
            } />

            <Route path="step-3" element={
              <div className="space-y-8">
                <div>
                  <span className="text-[10px] font-bold text-[#00a86b] uppercase tracking-widest mb-2 block">PASO 3 DE 4</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Composición</h2>
                  <p className="text-slate-500">Introduce tu peso actual y tu altura.</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Peso (kg)</label>
                    <input type="number" value={formData.weight} onChange={(e) => updateField('weight', Number(e.target.value))} className="input-field py-4" step="0.1" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Altura (cm)</label>
                    <input type="number" value={formData.height} onChange={(e) => updateField('height', Number(e.target.value))} className="input-field py-4" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-8">
                  <button onClick={() => navigate(-1)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                  <button onClick={() => navigate('/wizard/step-4')} className="flex-grow ml-4 bg-[#00a86b] hover:bg-[#008f5a] text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200/50">Continuar</button>
                </div>
              </div>
            } />

            <Route path="step-4" element={
              <div className="space-y-8">
                <div>
                  <span className="text-[10px] font-bold text-[#00a86b] uppercase tracking-widest mb-2 block">PASO 4 DE 4</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Finalizar Plan</h2>
                  <p className="text-slate-500">Tus metas y posibles restricciones.</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Actividad</label>
                    <select value={formData.activity} onChange={(e) => updateField('activity', e.target.value)} className="input-field py-4">
                      <option value="sedentario">Sedentario</option>
                      <option value="ligero">Ligero</option>
                      <option value="moderado">Moderado</option>
                      <option value="activo">Activo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Objetivo</label>
                    <select value={formData.goal} onChange={(e) => updateField('goal', e.target.value)} className="input-field py-4">
                      <option value="perder">Perder peso</option>
                      <option value="mantener">Mantener</option>
                      <option value="ganar">Ganar músculo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Alergias</label>
                    <textarea value={formData.allergies} onChange={(e) => updateField('allergies', e.target.value)} className="input-field py-4 h-20" placeholder="Ninguna..." />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-8">
                  <button onClick={() => navigate(-1)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                  <button 
                    onClick={submitFinal} 
                    disabled={loading}
                    className="flex-grow ml-4 bg-[#00a86b] hover:bg-[#008f5a] text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200/50 disabled:opacity-50"
                  >
                    {loading ? 'Generando...' : 'Ver Mi Plan'}
                  </button>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Wizard;
