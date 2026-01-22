import { useState, useEffect, useCallback } from 'react';
import { ReviewSettings, DEFAULT_REVIEW_SETTINGS, ReviewInterval } from '@/types/review';

const STORAGE_KEY = 'ciclo-estudos-review-settings';

export function useReviewSettings() {
  const [settings, setSettings] = useState<ReviewSettings>(DEFAULT_REVIEW_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar configurações do LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ReviewSettings;
        setSettings(parsed);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de revisão:', error);
    }
    setIsLoaded(true);
  }, []);

  // Atualizar intervalo de revisão
  const updateInterval = useCallback((intervalDays: ReviewInterval) => {
    const newSettings: ReviewSettings = {
      ...settings,
      intervalDays,
    };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Erro ao salvar configurações de revisão:', error);
    }
  }, [settings]);

  return {
    settings,
    isLoaded,
    updateInterval,
  };
}
