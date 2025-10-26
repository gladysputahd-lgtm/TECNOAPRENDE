
import React from 'react';
import { Language } from '../types';
import { Card } from './common/Card';
import { t } from '../i18n';

interface SettingsProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  useDyslexiaFont: boolean;
  setUseDyslexiaFont: (use: boolean) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void; }> = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer">
    <span className="font-semibold">{label}</span>
    <div className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-secondary/50 dark:peer-focus:ring-brand-secondary rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-brand-primary"></div>
    </div>
  </label>
);

export const Settings: React.FC<SettingsProps> = (props) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">{t('settings_title')}</h1>
      <Card>
        <div className="space-y-4">
          
          {/* Language Selector */}
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="font-semibold mb-2">{t('language')}</p>
            <div className="flex gap-2">
              <button
                onClick={() => props.setLanguage('es')}
                className={`flex-1 p-2 rounded-md font-bold transition-colors ${props.language === 'es' ? 'bg-brand-primary text-white' : 'bg-gray-200 dark:bg-gray-600'}`}
              >
                Español
              </button>
              <button
                onClick={() => props.setLanguage('qu')}
                className={`flex-1 p-2 rounded-md font-bold transition-colors ${props.language === 'qu' ? 'bg-brand-primary text-white' : 'bg-gray-200 dark:bg-gray-600'}`}
              >
                Quechua
              </button>
            </div>
          </div>

          <Toggle label={t('dark_mode')} checked={props.isDarkMode} onChange={props.setIsDarkMode} />
          <Toggle label={t('dyslexia_font')} checked={props.useDyslexiaFont} onChange={props.setUseDyslexiaFont} />
          
          {/* Font Size Slider */}
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <label htmlFor="font-size" className="font-semibold mb-2 block">{t('font_size')}</label>
            <input
              id="font-size"
              type="range"
              min="0.8"
              max="1.5"
              step="0.1"
              value={props.fontSize}
              onChange={(e) => props.setFontSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
            />
             <div className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400" style={{ fontSize: `${props.fontSize}rem` }}>
                Aa
             </div>
          </div>
          
        </div>
      </Card>
    </div>
  );
};
