
import React from 'react';
import { SpeakerWaveIcon, SpeakerXMarkIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

interface AudioButtonProps {
  text: string;
  onClick: (text: string) => void;
  isLoading: boolean;
  isPlaying: boolean;
  className?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({ text, onClick, isLoading, isPlaying, className = '' }) => {
  const getIcon = () => {
    if (isLoading) {
      return <ArrowPathIcon className="h-6 w-6 animate-spin" />;
    }
    if (isPlaying) {
      return <SpeakerXMarkIcon className="h-6 w-6" />;
    }
    return <SpeakerWaveIcon className="h-6 w-6" />;
  };

  const getLabel = () => {
    if (isLoading) return 'Cargando audio...';
    if (isPlaying) return 'Detener audio';
    return `Escuchar`;
  };

  return (
    <button
      onClick={() => onClick(text)}
      disabled={isLoading || !text}
      aria-label={getLabel()}
      title={getLabel()}
      className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed ${
        isPlaying ? 'bg-brand-accent text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
      } ${className}`}
    >
      {getIcon()}
    </button>
  );
};
