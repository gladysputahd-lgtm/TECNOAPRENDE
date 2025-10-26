import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      // General
      'back': 'Regresar',
      'loading': 'Cargando...',
      'error_generic': 'Ocurrió un error. Por favor, intenta de nuevo.',

      // Sections
      'diagnosis': 'Diagnóstico',
      'tutorials': 'Tutoriales',
      'maintenance': 'Mantenimiento',
      'motivation': 'Motivación',
      'assistant': 'Asistente IA',
      'settings': 'Configuración',

      // Diagnosis
      'diagnosis_welcome': '¡Hola! Vamos a descubrir tu nivel de conocimiento digital.',
      'diagnosis_intro': 'Responde algunas preguntas para personalizar tu aprendizaje.',
      'start_diagnosis': 'Comenzar Diagnóstico',
      'next_question': 'Siguiente Pregunta',
      'finish_diagnosis': 'Finalizar',
      'skill_level_result': 'Tu nivel es: {{level}}',
      'beginner': 'Principiante',
      'intermediate': 'Intermedio',
      'advanced': 'Avanzado',

      // Tutorials
      'tutorials_title': 'Elige un tema para aprender',
      'computer': 'Computadora',
      'mobile': 'Celular',
      'software': 'Programas',
      'tutorial_content_for': 'Tutorial de {{topic}} para nivel {{level}}',

      // Maintenance
      'maintenance_title': 'Consejos de Mantenimiento',
      'maintenance_intro': 'Mantén tus dispositivos en buen estado con estos consejos.',
      'get_maintenance_tips': 'Obtener Consejos',
      
      // Motivation
      'motivation_title': '¡Tú Puedes!',
      'motivation_intro': 'Un mensaje para inspirar tu día de aprendizaje.',
      'get_motivation_tip': 'Generar Mensaje',

      // Assistant
      'assistant_welcome': '¡Hola! Soy Tecno-Guía. ¿Qué te gustaría aprender hoy? Puedes escribir o usar el micrófono.',
      'ask_a_question': 'Escribe tu pregunta...',
      'send': 'Enviar',
      'listening': 'Escuchando...',
      'suggestion1': '¿Cómo envío un correo?',
      'suggestion2': '¿Qué es un navegador?',
      'suggestion3': '¿Es seguro comprar en línea?',

      // Settings
      'settings_title': 'Configuración',
      'language': 'Idioma',
      'dark_mode': 'Modo Noche',
      'dyslexia_font': 'Fuente para Dislexia',
      'font_size': 'Tamaño del Texto',
    },
  },
  qu: {
    translation: {
      // General
      'back': 'Kutiy',
      'loading': 'Chaskichkan...',
      'error_generic': 'Huchay kan. Ama hina kaspa, kaqmanta ruray.',

      // Sections
      'diagnosis': 'Tiksi Yachay',
      'tutorials': 'Yachachikuykuna',
      'maintenance': 'Allichaykuna',
      'motivation': 'Kallpachay',
      'assistant': 'Yanapaq IA',
      'settings': 'Kamachiqkuna',

      // Diagnosis
      'diagnosis_welcome': '¡Rimaykullayki! Qanpa yachayniyki digital nisqata tarisunchik.',
      'diagnosis_intro': 'Tapukuykunata kutichiy yachanaykipaq.',
      'start_diagnosis': 'Tiksi Yachayta Qallariy',
      'next_question': 'Qatiq Tapukuy',
      'finish_diagnosis': 'Tukuy',
      'skill_level_result': 'Yachayniyki kaymi: {{level}}',
      'beginner': 'Qallariq',
      'intermediate': 'Chawpi',
      'advanced': 'Ñawpaq',

      // Tutorials
      'tutorials_title': 'Yachanaykipaq huk temata akllay',
      'computer': 'Antañiqiq',
      'mobile': 'Kuyuchina',
      'software': 'Llika Wakichikuna',
      'tutorial_content_for': '{{topic}} yachachikuy {{level}} yachayniyuqpaq',

      // Maintenance
      'maintenance_title': 'Allichaypaq Yuyaychaykuna',
      'maintenance_intro': 'Kay yuyaychaykunawan llika kapchiykikunata allinta hap\'iy.',
      'get_maintenance_tips': 'Yuyaychaykunata Chaskiy',

      // Motivation
      'motivation_title': '¡Qam Atinki!',
      'motivation_intro': 'Yachay p\'unchawnikipaq kallpachaq shimi.',
      'get_motivation_tip': 'Shimita Paqarichiy',

      // Assistant
      'assistant_welcome': '¡Allinllachu! Ñuqaqa Tecno-Guía kani. ¿Imatataq kunan yachayta munanki? Qillqaytam atinki utaq micrófono nisqawan rimaytam.',
      'ask_a_question': 'Tapukuyniykita qillqay...',
      'send': 'Kachay',
      'listening': 'Uyarispa...',
      'suggestion1': '¿Imaynatan correo kachani?',
      'suggestion2': '¿Ima huk navegador?',
      'suggestion3': '¿Allinchu internetpi rantikuy?',

      // Settings
      'settings_title': 'Kamachiqkuna',
      'language': 'Simi',
      'dark_mode': 'Tuta Modo',
      'dyslexia_font': 'Dislexia Ñawinchanapaq',
      'font_size': 'Qillqa Sayay',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });
  
// FIX: Explicitly type the return value as string to satisfy TypeScript across the app,
// as the default return type from i18n.t is too broad.
export const t = (key: string, options?: Record<string, any>): string => i18n.t(key, options) as string;

export default i18n;
