import React, { useState, useEffect } from 'react';
import { DiagnosisQuestion, Language, SkillLevel } from '../types';
import { getDiagnosisQuestions } from '../services/geminiService';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { t } from '../i18n';
import { AudioButton } from './common/AudioButton';

interface DiagnosisProps {
  setSkillLevel: (level: SkillLevel) => void;
  language: Language;
  onComplete: () => void;
  audioHandler: (text: string) => void;
  loadingAudioText: string | null;
  playingAudioText: string | null;
}

export const Diagnosis: React.FC<DiagnosisProps> = ({ setSkillLevel, language, onComplete, audioHandler, loadingAudioText, playingAudioText }) => {
  const [questions, setQuestions] = useState<DiagnosisQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getDiagnosisQuestions(language);
        setQuestions(data);
      } catch (err) {
        setError(t('error_generic'));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [language]);

  const handleAnswer = (optionIndex: number) => {
    setAnswers([...answers, optionIndex]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishDiagnosis([...answers, optionIndex]);
    }
  };

  const finishDiagnosis = (finalAnswers: number[]) => {
    const score = finalAnswers.reduce((acc, curr) => acc + curr, 0);
    const average = score / finalAnswers.length;
    let level: SkillLevel;
    if (average < 1) {
      level = SkillLevel.ADVANCED;
    } else if (average < 2) {
      level = SkillLevel.INTERMEDIATE;
    } else {
      level = SkillLevel.BEGINNER;
    }
    setSkillLevel(level);
    onComplete();
  };
  
  const currentQuestion = questions[currentQuestionIndex];

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  if (!isStarted) {
    return (
      <Card className="text-center">
        <h1 className="text-3xl font-bold mb-4">{t('diagnosis_welcome')}</h1>
        <p className="text-lg mb-6">{t('diagnosis_intro')}</p>
        <div className="flex items-center justify-center gap-4">
            <Button onClick={() => setIsStarted(true)} size="large">{t('start_diagnosis')}</Button>
            <AudioButton
                text={`${t('diagnosis_welcome')} ${t('diagnosis_intro')}`}
                onClick={audioHandler}
                isLoading={loadingAudioText === `${t('diagnosis_welcome')} ${t('diagnosis_intro')}`}
                isPlaying={playingAudioText === `${t('diagnosis_welcome')} ${t('diagnosis_intro')}`}
            />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Pregunta {currentQuestionIndex + 1} de {questions.length}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-1">
          <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <h2 className="text-2xl font-semibold mb-6 flex-grow">{currentQuestion?.question}</h2>
        <AudioButton
            text={currentQuestion?.question}
            onClick={audioHandler}
            isLoading={loadingAudioText === currentQuestion?.question}
            isPlaying={playingAudioText === currentQuestion?.question}
        />
      </div>
      <div className="space-y-3">
        {currentQuestion?.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className="w-full text-left p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-brand-primary/20 dark:hover:bg-brand-secondary/30 transition-colors font-medium text-lg"
          >
            {option}
          </button>
        ))}
      </div>
    </Card>
  );
};
