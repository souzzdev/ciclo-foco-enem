/**
 * Hook unificado para gerenciamento do ciclo de estudos
 * Combina matérias + progresso + persistência
 */

import { useState, useEffect, useCallback } from 'react';
import { Subject, SubjectInput, CYCLE_LIMITS } from '@/types/subject';
import { CycleData, HistoryEntry, CycleHistoryEntry, INITIAL_CYCLE_DATA } from '@/types/study';
import {
  createSubject,
  updateSubject,
  calculateHoursDistribution,
} from '@/lib/subjectCalculations';

const STORAGE_KEY_SUBJECTS = 'ciclo-foco-subjects';
const STORAGE_KEY_CYCLE = 'ciclo-foco-cycle';

export function useCycleData() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [cycleData, setCycleData] = useState<CycleData>(INITIAL_CYCLE_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const storedSubjects = localStorage.getItem(STORAGE_KEY_SUBJECTS);
      if (storedSubjects) {
        setSubjects(JSON.parse(storedSubjects));
      }

      const storedCycle = localStorage.getItem(STORAGE_KEY_CYCLE);
      if (storedCycle) {
        setCycleData({ ...INITIAL_CYCLE_DATA, ...JSON.parse(storedCycle) });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save subjects
  const saveSubjects = useCallback((data: Subject[]) => {
    try {
      localStorage.setItem(STORAGE_KEY_SUBJECTS, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar materias:', error);
    }
  }, []);

  // Save cycle data
  const saveCycle = useCallback((data: CycleData) => {
    try {
      localStorage.setItem(STORAGE_KEY_CYCLE, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar ciclo:', error);
    }
  }, []);

  // Recalculate hours distribution
  const recalculateHours = useCallback((subjs: Subject[], totalHours: number): Subject[] => {
    return calculateHoursDistribution(subjs, totalHours);
  }, []);

  // Add subject
  const addSubject = useCallback((input: SubjectInput) => {
    setSubjects(prev => {
      const newSubject = createSubject(input, prev.length);
      const updated = [...prev, newSubject];
      const withHours = recalculateHours(updated, cycleData.totalCycleTime);
      saveSubjects(withHours);
      return withHours;
    });
  }, [cycleData.totalCycleTime, recalculateHours, saveSubjects]);

  // Edit subject
  const editSubject = useCallback((id: string, updates: Partial<SubjectInput>) => {
    setSubjects(prev => {
      const updated = prev.map(s => s.id === id ? updateSubject(s, updates) : s);
      const withHours = recalculateHours(updated, cycleData.totalCycleTime);
      saveSubjects(withHours);
      return withHours;
    });
  }, [cycleData.totalCycleTime, recalculateHours, saveSubjects]);

  // Remove subject
  const removeSubject = useCallback((id: string) => {
    setSubjects(prev => {
      const updated = prev.filter(s => s.id !== id);
      const withHours = recalculateHours(updated, cycleData.totalCycleTime);
      saveSubjects(withHours);
      return withHours;
    });
  }, [cycleData.totalCycleTime, recalculateHours, saveSubjects]);

  // Reorder subjects
  const reorderSubjects = useCallback((fromIndex: number, toIndex: number) => {
    setSubjects(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      saveSubjects(updated);
      return updated;
    });
  }, [saveSubjects]);

  // Toggle hour completion for a subject
  const toggleHour = useCallback((subjectId: string, hourIndex: number) => {
    setSubjects(prev => {
      const subject = prev.find(s => s.id === subjectId);
      if (!subject) return prev;

      const isCompleting = hourIndex >= subject.completedHours;
      const newCompleted = isCompleting ? hourIndex + 1 : hourIndex;

      const updated = prev.map(s =>
        s.id === subjectId
          ? { ...s, completedHours: Math.min(Math.max(0, newCompleted), s.hours) }
          : s
      );

      // Update streak and history if completing
      if (isCompleting) {
        const today = new Date().toDateString();
        const lastDate = cycleData.lastStudyDate
          ? new Date(cycleData.lastStudyDate).toDateString()
          : null;
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        let currentStreak = cycleData.currentStreak;
        let todayBlocks = cycleData.todayBlocks;

        if (lastDate === today) {
          todayBlocks = cycleData.todayBlocks + 1;
        } else if (lastDate === yesterday) {
          currentStreak = cycleData.currentStreak + 1;
          todayBlocks = 1;
        } else {
          currentStreak = 1;
          todayBlocks = 1;
        }

        const historyEntry: HistoryEntry = {
          id: `${Date.now()}-${subjectId}`,
          date: new Date().toISOString(),
          subjectId,
          subjectName: subject.name,
          subjectColor: subject.color,
          content: `1h de ${subject.name} concluida`,
          skipped: false,
        };

        const newCycleData: CycleData = {
          ...cycleData,
          totalMinutesStudied: cycleData.totalMinutesStudied + 60,
          currentStreak,
          longestStreak: Math.max(cycleData.longestStreak, currentStreak),
          lastStudyDate: new Date().toISOString(),
          todayBlocks,
          history: [historyEntry, ...cycleData.history],
        };

        setCycleData(newCycleData);
        saveCycle(newCycleData);
      }

      saveSubjects(updated);
      return updated;
    });
  }, [cycleData, saveCycle, saveSubjects]);

  // Update cycle intensity (total hours)
  const updateIntensity = useCallback((totalHours: number) => {
    const clamped = Math.max(CYCLE_LIMITS.MIN_HOURS, Math.min(CYCLE_LIMITS.MAX_HOURS, totalHours));

    setCycleData(prev => {
      const newData = { ...prev, totalCycleTime: clamped };
      saveCycle(newData);
      return newData;
    });

    setSubjects(prev => {
      const withHours = recalculateHours(prev, clamped);
      saveSubjects(withHours);
      return withHours;
    });
  }, [recalculateHours, saveCycle, saveSubjects]);

  // Reset cycle (keep subjects and distribution, zero progress)
  const resetCycle = useCallback(() => {
    // Save current cycle to history
    const totalCompleted = subjects.reduce((sum, s) => sum + s.completedHours, 0);
    const totalHours = subjects.reduce((sum, s) => sum + s.hours, 0);

    if (totalCompleted > 0) {
      const cycleEntry: CycleHistoryEntry = {
        id: `cycle-${Date.now()}`,
        completedAt: new Date().toISOString(),
        totalHours,
        completedHours: totalCompleted,
        subjects: subjects.map(s => ({
          name: s.name,
          color: s.color,
          hours: s.hours,
          completedHours: s.completedHours,
        })),
      };

      setCycleData(prev => {
        const newData: CycleData = {
          ...prev,
          completedCycles: prev.completedCycles + 1,
          cycleHistory: [cycleEntry, ...prev.cycleHistory],
        };
        saveCycle(newData);
        return newData;
      });
    }

    // Zero out completed hours
    setSubjects(prev => {
      const reset = prev.map(s => ({ ...s, completedHours: 0 }));
      saveSubjects(reset);
      return reset;
    });
  }, [subjects, saveCycle, saveSubjects]);

  // Clear history
  const clearHistory = useCallback(() => {
    setCycleData(prev => {
      const newData = { ...prev, history: [] };
      saveCycle(newData);
      return newData;
    });
  }, [saveCycle]);

  // Calculate totals
  const totalHoursAssigned = subjects.reduce((sum, s) => sum + s.hours, 0);
  const totalHoursCompleted = subjects.reduce((sum, s) => sum + s.completedHours, 0);
  const progressPercentage = totalHoursAssigned > 0
    ? Math.round((totalHoursCompleted / totalHoursAssigned) * 100)
    : 0;

  return {
    subjects,
    cycleData,
    isLoaded,
    totalHoursAssigned,
    totalHoursCompleted,
    progressPercentage,
    addSubject,
    editSubject,
    removeSubject,
    reorderSubjects,
    toggleHour,
    updateIntensity,
    resetCycle,
    clearHistory,
  };
}
