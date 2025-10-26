import React, { useState } from 'react';
import { Language } from '../types';
import { generateMotivationalMessage } from '../services/geminiService';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Spinner } from './common/Spinner';
import { t } from '../i18n';
import { AudioButton } from './common/AudioButton';

interface MotivationProps {
    language: Language;
    audioHandler: (text: string) => void;
    loadingAudioText: string | null;
    playingAudioText: string | null;
}

export const Motivation: React.FC<MotivationProps> = ({ language, audioHandler, loadingAudioText, playingAudioText }) => {
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetMessage = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const generatedMessage = await generateMotivationalMessage(language);
            setMessage(generatedMessage);
        } catch (err) {
            setError(t('error_generic'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-center">{t('motivation_title')}</h1>
            <Card className="text-center">
                <p className="text-lg mb-6">{t('motivation_intro')}</p>
                <Button onClick={handleGetMessage} disabled={isLoading} size="large">
                    {isLoading ? t('loading') : t('get_motivation_tip')}
                </Button>

                {isLoading && <Spinner />}

                {error && <p className="text-red-500 mt-4">{error}</p>}
                
                {message && (
                    <div className="mt-8 p-6 bg-brand-primary/10 rounded-lg">
                        <div className="flex justify-between items-center">
                            <p className="text-xl italic font-semibold text-brand-dark dark:text-gray-200">"{message}"</p>
                            <AudioButton
                                text={message}
                                onClick={audioHandler}
                                isLoading={loadingAudioText === message}
                                isPlaying={playingAudioText === message}
                            />
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};
