import React, { useState } from 'react';
import { Language } from '../types';
import { generateMaintenanceTips } from '../services/geminiService';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Spinner } from './common/Spinner';
import { t } from '../i18n';
import { AudioButton } from './common/AudioButton';

interface MaintenanceProps {
    language: Language;
    audioHandler: (text: string) => void;
    loadingAudioText: string | null;
    playingAudioText: string | null;
}

export const Maintenance: React.FC<MaintenanceProps> = ({ language, audioHandler, loadingAudioText, playingAudioText }) => {
    const [tips, setTips] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetTips = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const generatedTips = await generateMaintenanceTips(language);
            setTips(generatedTips);
        } catch (err) {
            setError(t('error_generic'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-center">{t('maintenance_title')}</h1>
            <Card className="text-center">
                <p className="text-lg mb-6">{t('maintenance_intro')}</p>
                <Button onClick={handleGetTips} disabled={isLoading} size="large">
                    {isLoading ? t('loading') : t('get_maintenance_tips')}
                </Button>

                {isLoading && <Spinner />}
                
                {error && <p className="text-red-500 mt-4">{error}</p>}
                
                {tips && (
                    <div className="mt-8 text-left">
                       <div className="flex justify-between items-start">
                         <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">{tips}</div>
                         <AudioButton
                            text={tips}
                            onClick={audioHandler}
                            isLoading={loadingAudioText === tips}
                            isPlaying={playingAudioText === tips}
                         />
                       </div>
                    </div>
                )}
            </Card>
        </div>
    );
};
