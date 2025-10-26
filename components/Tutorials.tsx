import React, { useState } from 'react';
import { Language, SkillLevel } from '../types';
import { generateTutorial } from '../services/geminiService';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Spinner } from './common/Spinner';
import { ComputerIcon } from './icons/ComputerIcon';
import { MobileIcon } from './icons/MobileIcon';
import { SoftwareIcon } from './icons/SoftwareIcon';
import { t } from '../i18n';
import { AudioButton } from './common/AudioButton';

interface TutorialsProps {
  skillLevel: SkillLevel;
  language: Language;
  audioHandler: (text: string) => void;
  loadingAudioText: string | null;
  playingAudioText: string | null;
}

const tutorialTopics = [
  { id: 'computer', icon: <ComputerIcon className="w-12 h-12" />, label: t('computer') },
  { id: 'mobile', icon: <MobileIcon className="w-12 h-12" />, label: t('mobile') },
  { id: 'software', icon: <SoftwareIcon className="w-12 h-12" />, label: t('software') },
];

export const Tutorials: React.FC<TutorialsProps> = ({ skillLevel, language, audioHandler, loadingAudioText, playingAudioText }) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [tutorialContent, setTutorialContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectTopic = async (topic: string) => {
    setSelectedTopic(topic);
    setIsLoading(true);
    setError(null);
    setTutorialContent(null);
    try {
      const content = await generateTutorial(topic, skillLevel, language);
      setTutorialContent(content);
    } catch (err) {
      setError(t('error_generic'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedTopic(null);
    setTutorialContent(null);
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6 text-center">{t('tutorials_title')}</h1>
        <Spinner />
      </div>
    );
  }

  if (selectedTopic && tutorialContent) {
    return (
      <div>
        <Button onClick={handleBack} variant="ghost" className="mb-4">{t('back')}</Button>
        <Card>
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold mb-4">{t('tutorial_content_for', { topic: selectedTopic, level: t(skillLevel) })}</h2>
            <AudioButton
                text={tutorialContent}
                onClick={audioHandler}
                isLoading={loadingAudioText === tutorialContent}
                isPlaying={playingAudioText === tutorialContent}
            />
          </div>
          <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">{tutorialContent}</div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">{t('tutorials_title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tutorialTopics.map(topic => (
          <Card key={topic.id} onClick={() => handleSelectTopic(topic.label)} className="text-center cursor-pointer hover:shadow-xl hover:scale-105 transition-transform duration-200">
            <div className="flex justify-center mb-4 text-brand-primary">{topic.icon}</div>
            <h3 className="text-xl font-semibold">{topic.label}</h3>
          </Card>
        ))}
      </div>
    </div>
  );
};
