
import { GoogleGenAI, Modality, Type, Chat } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const textModel = 'gemini-2.5-pro';
const ttsModel = 'gemini-2.5-flash-preview-tts';

const languageMap: Record<string, string> = {
  es: 'Spanish',
  qu: 'Quechua',
};

const defaultDiagnosisQuestions: Record<string, any> = {
    es: [
        { question: "¿Usas computadora o celular todos los días?", options: ["Sí", "A veces", "Casi nunca"] },
        { question: "¿Sabes cómo enviar un correo electrónico con un archivo adjunto?", options: ["Sí, fácilmente", "Creo que sí", "No, necesito ayuda"] },
        { question: "¿Qué haces si un programa o aplicación se bloquea?", options: ["Lo reinicio", "Busco ayuda en internet", "No sé qué hacer"] }
    ],
    qu: [
        { question: "¿Sapa p'unchaw antañiqiqta utaq kuyuchinata llamk'achinkichu?", options: ["Arí", "Maynillanpi", "Mana hayk'aqpas"] },
        { question: "¿Yachankichu imaynata huk correo electrónico kachayta huk archivowan kuskachasqa?", options: ["Arí, ancha fácil", "Chayna nikuniman", "Manam, yanapayta munani"] },
        { question: "¿Imatataq ruranki huk programa utaq aplicación mana kuyuriqtin?", options: ["Kaqmanta qallarichini", "Internetpi yanapayta mask'ani", "Manam yachanichu imata ruranayta"] }
    ]
};

export const getDiagnosisQuestions = async (language: 'es' | 'qu'): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: textModel,
      contents: `Generate 3 multiple-choice diagnostic questions in ${languageMap[language]} to assess basic digital literacy. The topics should be computer usage, email, and basic troubleshooting. Provide only a JSON array of objects, where each object has "question" (string) and "options" (array of 3 strings).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['question', 'options'],
          },
        },
      },
    });
    
    const parsedData = JSON.parse(response.text);

    // Validate the structure of the parsed data to prevent crashes
    if (
      Array.isArray(parsedData) &&
      parsedData.length > 0 &&
      parsedData.every(
        (item: any) =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.question === 'string' &&
          Array.isArray(item.options) &&
          item.options.every((opt: any) => typeof opt === 'string')
      )
    ) {
      return parsedData;
    } else {
      console.warn("API response for diagnosis questions is malformed, using fallback.", parsedData);
      return defaultDiagnosisQuestions[language];
    }

  } catch (error) {
    console.error("Error generating or parsing diagnosis questions, using fallback.", error);
    return defaultDiagnosisQuestions[language];
  }
};

export const generateTutorial = async (topic: string, skillLevel: string, language: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: textModel,
    contents: `Create a simple, step-by-step tutorial in ${languageMap[language]} about "${topic}" for a person with a "${skillLevel}" skill level. Use simple language. Format as Markdown.`,
    config: {
      systemInstruction: "You are a patient and clear technology teacher for absolute beginners.",
    },
  });
  return response.text;
};

export const generateMaintenanceTips = async (language: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: textModel,
        contents: `Generate 3 essential and easy-to-understand preventive maintenance tips for computers and smartphones for a beginner. Provide them in ${languageMap[language]}. Format as a Markdown list.`,
        config: {
            systemInstruction: "You provide simple, actionable advice on device care.",
        },
    });
    return response.text;
};

export const generateMotivationalMessage = async (language: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: textModel,
        contents: `Generate a short, encouraging, and motivational message in ${languageMap[language]} for someone learning digital skills. Keep it simple and positive.`,
        config: {
            systemInstruction: "You are a source of positivity and encouragement.",
        },
    });
    return response.text;
};

export const startChat = (language: string): Chat => {
    return ai.chats.create({
        model: textModel,
        config: {
            systemInstruction: `You are 'Tecno-Guía', a friendly, patient, and very helpful AI assistant for the 'TecnoAprende' app. Your goal is to help people with very low digital literacy. Explain technology concepts in the simplest terms possible, using analogies related to everyday life. Always be encouraging and positive. All your responses MUST be in ${languageMap[language]}.`,
        },
    });
};

export const generateSpeech = async (text: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: ttsModel,
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("No audio data received from API.");
  }
  return base64Audio;
};
