import React, { useState, useEffect, useCallback } from 'react';
import { Section, SkillLevel, Language } from './types';
import { Diagnosis } from './components/Diagnosis';
import { Tutorials } from './components/Tutorials';
import { Maintenance } from './components/Maintenance';
import { Motivation } from './components/Motivation';
import { Assistant } from './components/Assistant';
import { Settings } from './components/Settings';
import { HomeIcon } from './components/icons/HomeIcon';
import { BookOpenIcon } from './components/icons/BookOpenIcon';
import { WrenchIcon } from './components/icons/WrenchIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { ChatBubbleLeftRightIcon } from './components/icons/ChatBubbleLeftRightIcon';
import { Cog6ToothIcon } from './components/icons/CogIcon';
import { t } from './i18n';
import i18n from './i18n';
import { generateSpeech } from './services/geminiService';
import { decode, decodeAudioData } from './utils/audioUtils';

const App: React.FC = () => {
  const [section, setSection] = useState<Section>(Section.DIAGNOSIS);
  const [skillLevel, setSkillLevel] = useState<SkillLevel | null>(null);
  const [language, setLanguage] = useState<Language>('es');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [useDyslexiaFont, setUseDyslexiaFont] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(1);

  // Audio state
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loadingAudioText, setLoadingAudioText] = useState<string | null>(null);
  const [playingAudioText, setPlayingAudioText] = useState<string | null>(null);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.body.style.backgroundColor = isDarkMode ? '#134e4a' : '#f0fdfa'; 
  }, [isDarkMode]);

  useEffect(() => {
    document.body.classList.toggle('font-lexend', useDyslexiaFont);
    document.body.classList.toggle('font-sans', !useDyslexiaFont);
  }, [useDyslexiaFont]);
  

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize * 16}px`;
  }, [fontSize]);

  useEffect(() => {
    setAudioContext(new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 }));
    return () => {
      audioSource?.stop();
      audioContext?.close();
    };
  }, []);

  const handlePlayAudio = useCallback(async (text: string) => {
    if (isPlaying && playingAudioText === text) {
      audioSource?.stop();
      setIsPlaying(false);
      setPlayingAudioText(null);
      return;
    }

    if (audioSource) {
      audioSource.stop();
    }

    if (!audioContext) return;
    setLoadingAudioText(text);
    setIsPlaying(false);

    try {
      const base64Audio = await generateSpeech(text);
      const audioData = decode(base64Audio);
      const buffer = await decodeAudioData(audioData, audioContext, 24000, 1);
      
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.onended = () => {
        setIsPlaying(false);
        setPlayingAudioText(null);
      };
      source.start();
      setAudioSource(source);
      setIsPlaying(true);
      setPlayingAudioText(text);
    } catch (error) {
      console.error("Error playing audio:", error);
      alert(t('error_generic'));
    } finally {
      setLoadingAudioText(null);
    }
  }, [audioContext, audioSource, isPlaying, playingAudioText]);


  const renderSection = () => {
    const commonAudioProps = {
      audioHandler: handlePlayAudio,
      loadingAudioText: loadingAudioText,
      playingAudioText: playingAudioText,
    };
    switch (section) {
      case Section.DIAGNOSIS:
        return <Diagnosis setSkillLevel={setSkillLevel} language={language} onComplete={() => setSection(Section.TUTORIALS)} {...commonAudioProps} />;
      case Section.TUTORIALS:
        return <Tutorials skillLevel={skillLevel || SkillLevel.BEGINNER} language={language} {...commonAudioProps} />;
      case Section.MAINTENANCE:
        return <Maintenance language={language} {...commonAudioProps} />;
      case Section.MOTIVATION:
        return <Motivation language={language} {...commonAudioProps} />;
      case Section.ASSISTANT:
        return <Assistant language={language} {...commonAudioProps} />;
      case Section.SETTINGS:
        return <Settings language={language} setLanguage={setLanguage} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} useDyslexiaFont={useDyslexiaFont} setUseDyslexiaFont={setUseDyslexiaFont} fontSize={fontSize} setFontSize={setFontSize} />;
      default:
        return <Diagnosis setSkillLevel={setSkillLevel} language={language} onComplete={() => setSection(Section.TUTORIALS)} {...commonAudioProps} />;
    }
  };
  
  const NavButton: React.FC<{ targetSection: Section; icon: React.ReactNode; label: string }> = ({ targetSection, icon, label }) => (
    <button
      onClick={() => setSection(targetSection)}
      className={`flex flex-col items-center justify-center gap-1 w-full p-2 rounded-lg transition-colors ${section === targetSection ? 'text-brand-primary bg-brand-primary/10' : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'}`}
      aria-current={section === targetSection ? 'page' : undefined}
    >
      <div className="w-6 h-6">{icon}</div>
      <span className="text-xs font-medium text-center leading-tight">{label}</span>
    </button>
  );

  const HeaderButton: React.FC<{ targetSection: Section; icon: React.ReactNode; label: string }> = ({ targetSection, icon, label }) => (
    <button
        onClick={() => setSection(targetSection)}
        className={`p-2 rounded-full transition-colors ${section === targetSection ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'}`}
        aria-label={label}
        title={label}
    >
        {icon}
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-brand-light dark:bg-brand-dark text-gray-800 dark:text-gray-200">
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center p-3 sm:p-4">
          <h1 className="text-2xl font-bold text-brand-primary">TECNOAPRENDE</h1>
          <div className="flex items-center gap-2">
            <HeaderButton targetSection={Section.ASSISTANT} icon={<ChatBubbleLeftRightIcon className="w-6 h-6"/>} label={t('assistant')} />
            <HeaderButton targetSection={Section.SETTINGS} icon={<Cog6ToothIcon className="w-6 h-6"/>} label={t('settings')} />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {renderSection()}
        </div>
      </main>

      <nav className="bg-white dark:bg-gray-800 shadow-t-lg sticky bottom-0">
        <div className="max-w-4xl mx-auto grid grid-cols-4 p-1 sm:p-2 gap-1">
          <NavButton targetSection={Section.DIAGNOSIS} icon={<HomeIcon />} label={t('diagnosis')} />
          <NavButton targetSection={Section.TUTORIALS} icon={<BookOpenIcon />} label={t('tutorials')} />
          <NavButton targetSection={Section.MAINTENANCE} icon={<WrenchIcon />} label={t('maintenance')} />
          <NavButton targetSection={Section.MOTIVATION} icon={<SparklesIcon />} label={t('motivation')} />
        </div>
      </nav>
    </div>
  );
};

export default App;