
import React from 'react';

export const HEALTH_LINKS = {
  NAOS: 'https://www.aesan.gob.es/AECOSAN/web/nutricion/seccion/estrategia_naos.htm',
  AESAN_RECOMMENDATIONS: 'https://www.aesan.gob.es/AECOSAN/web/nutricion/subseccion/recomendaciones_alimentacion.htm',
  MINISTRY_HEALTH: 'https://www.sanidad.gob.es/areas/promocionPrevencion/alimentacion/home.htm'
};

export const HEALTH_CRITERIA = [
  "Déficit calórico moderado (10–20 % del gasto total).",
  "Pérdida de peso progresiva: referencia 0,5–1 kg/semana.",
  "Patrón de Dieta Mediterránea como base.",
  "Énfasis en legumbres, frutas, verduras y aceite de oliva.",
  "Evitación de dietas milagro, detox o ayunos agresivos."
];

export const ICONS = {
  Alert: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  )
};
