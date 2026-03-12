/**
 * Hook para gerenciamento de matérias e ciclo de estudos
 */

import { useState, useEffect, useCallback } from 'react';
import { Subject, SubjectInput, CYCLE_LIMITS } from '@/types/subject';
import { createSubject, updateSubject, sortByPriority, distributeHours } from '@/lib/subjectCalculations';

const STORAGE_KEY = 'ciclo-estudos-subjects';
const CYCLE_KEY = 'ciclo-estudos-cycle-hours';

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [totalCycleHours, setTotalCycleHours] = useState(CYCLE_LIMITS.DEFAULT_HOURS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar dados do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Subject[];
        setSubjects(sortByPriority(parsed));
      }
      const cycleStored = localStorage.getItem(CYCLE_KEY);
      if (cycleStored) {
        setTotalCycleHours(JSON.parse(cycleStored));
      }
    } catch (error) {
      console.error('Erro ao carregar matérias:', error);
    }
    setIsLoaded(true);
  }, []);

  const saveToStorage = useCallback((data: Subject[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar matérias:', error);
    }
  }, []);

  const saveCycleHours = useCallback((hours: number) => {
    try {
      localStorage.setItem(CYCLE_KEY, JSON.stringify(hours));
    } catch (error) {
      console.error('Erro ao salvar horas do ciclo:', error);
    }
  }, []);

  // Recalcular distribuição de horas
  const recalculate = useCallback((subs: Subject[], hours: number): Subject[] => {
    if (subs.length === 0) return subs;
    return distributeHours(sortByPriority(subs), hours);
  }, []);

  const addSubject = useCallback((input: SubjectInput) => {
    setSubjects(prev => {
      const newSubject = createSubject(input, prev.length);
      const updated = recalculate([...prev, newSubject], totalCycleHours);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage, totalCycleHours, recalculate]);

  const editSubject = useCallback((id: string, updates: Partial<SubjectInput>) => {
    setSubjects(prev => {
      const updated = prev.map(subject =>
        subject.id === id ? updateSubject(subject, updates) : subject
      );
      const recalculated = recalculate(updated, totalCycleHours);
      saveToStorage(recalculated);
      return recalculated;
    });
  }, [saveToStorage, totalCycleHours, recalculate]);

  const removeSubject = useCallback((id: string) => {
    setSubjects(prev => {
      const filtered = prev.filter(subject => subject.id !== id);
      const recalculated = recalculate(filtered, totalCycleHours);
      saveToStorage(recalculated);
      return recalculated;
    });
  }, [saveToStorage, totalCycleHours, recalculate]);

  const toggleHourBlock = useCallback((subjectId: string, hourIndex: number) => {
    setSubjects(prev => {
      const updated = prev.map(subject => {
        if (subject.id !== subjectId) return subject;
        // Toggle: if clicking on a completed block, uncomplete it
        const newCompleted = hourIndex < subject.completedHours
          ? hourIndex
          : hourIndex + 1;
        return { ...subject, completedHours: Math.min(newCompleted, subject.hours) };
      });
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const setTotalHours = useCallback((hours: number) => {
    const clamped = Math.max(CYCLE_LIMITS.MIN_HOURS, Math.min(CYCLE_LIMITS.MAX_HOURS, hours));
    setTotalCycleHours(clamped);
    saveCycleHours(clamped);
    setSubjects(prev => {
      const recalculated = recalculate(prev, clamped);
      saveToStorage(recalculated);
      return recalculated;
    });
  }, [saveCycleHours, saveToStorage, recalculate]);

  const resetCycleProgress = useCallback(() => {
    setSubjects(prev => {
      const reset = prev.map(s => ({ ...s, completedHours: 0 }));
      saveToStorage(reset);
      return reset;
    });
  }, [saveToStorage]);

  const clearSubjects = useCallback(() => {
    setSubjects([]);
    saveToStorage([]);
  }, [saveToStorage]);

  return {
    subjects,
    isLoaded,
    totalCycleHours,
    addSubject,
    editSubject,
    removeSubject,
    clearSubjects,
    toggleHourBlock,
    setTotalHours,
    resetCycleProgress,
  };
}
