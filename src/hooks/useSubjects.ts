/**
 * Hook para gerenciamento de matérias personalizadas
 * Responsável por CRUD e persistência no localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import { Subject, SubjectInput } from '@/types/subject';
import { createSubject, updateSubject, sortByPriority } from '@/lib/subjectCalculations';

const STORAGE_KEY = 'ciclo-estudos-subjects';

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Subject[];
        setSubjects(sortByPriority(parsed));
      }
    } catch (error) {
      console.error('Erro ao carregar matérias:', error);
    }
    setIsLoaded(true);
  }, []);

  // Salvar dados no localStorage
  const saveToStorage = useCallback((data: Subject[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar matérias:', error);
    }
  }, []);

  // Adicionar nova matéria
  const addSubject = useCallback((input: SubjectInput) => {
    setSubjects(prev => {
      const newSubject = createSubject(input);
      const updated = sortByPriority([...prev, newSubject]);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // Atualizar matéria existente
  const editSubject = useCallback((id: string, updates: Partial<SubjectInput>) => {
    setSubjects(prev => {
      const updated = prev.map(subject =>
        subject.id === id ? updateSubject(subject, updates) : subject
      );
      const sorted = sortByPriority(updated);
      saveToStorage(sorted);
      return sorted;
    });
  }, [saveToStorage]);

  // Remover matéria
  const removeSubject = useCallback((id: string) => {
    setSubjects(prev => {
      const updated = prev.filter(subject => subject.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // Limpar todas as matérias
  const clearSubjects = useCallback(() => {
    setSubjects([]);
    saveToStorage([]);
  }, [saveToStorage]);

  return {
    subjects,
    isLoaded,
    addSubject,
    editSubject,
    removeSubject,
    clearSubjects,
  };
}
