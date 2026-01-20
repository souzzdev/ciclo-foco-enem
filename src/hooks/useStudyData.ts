import { useState, useEffect, useCallback } from 'react';
import { StudyData, StudyBlock, HistoryEntry, INITIAL_DATA } from '@/types/study';

const STORAGE_KEY = 'ciclo-estudos-enem';

export function useStudyData() {
  const [data, setData] = useState<StudyData>(INITIAL_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar dados do LocalStorage
  const carregarDados = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StudyData;
        setData(parsed);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
    setIsLoaded(true);
  }, []);

  // Salvar dados no LocalStorage
  const salvarDados = useCallback((newData: StudyData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  }, []);

  // Atualizar conteúdo de um bloco
  const atualizarConteudo = useCallback((blockId: number, content: string) => {
    setData(prev => {
      const newData = {
        ...prev,
        blocks: prev.blocks.map(block =>
          block.id === blockId ? { ...block, content } : block
        ),
      };
      salvarDados(newData);
      return newData;
    });
  }, [salvarDados]);

  // Helper para verificar e atualizar streak
  const updateStreak = (prev: StudyData): { currentStreak: number; longestStreak: number; todayBlocks: number } => {
    const today = new Date().toDateString();
    const lastDate = prev.lastStudyDate ? new Date(prev.lastStudyDate).toDateString() : null;
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let currentStreak = prev.currentStreak;
    let todayBlocks = prev.todayBlocks;

    if (lastDate === today) {
      // Mesmo dia, incrementa blocos do dia
      todayBlocks = prev.todayBlocks + 1;
    } else if (lastDate === yesterday) {
      // Dia seguinte, continua streak
      currentStreak = prev.currentStreak + 1;
      todayBlocks = 1;
    } else if (lastDate !== today) {
      // Quebrou streak ou primeiro estudo
      currentStreak = 1;
      todayBlocks = 1;
    }

    return {
      currentStreak,
      longestStreak: Math.max(prev.longestStreak, currentStreak),
      todayBlocks,
    };
  };

  // Concluir bloco atual e avançar ciclo
  const concluirBloco = useCallback((content: string) => {
    setData(prev => {
      const currentBlock = prev.blocks[prev.currentBlockIndex];
      
      // Criar entrada no histórico
      const historyEntry: HistoryEntry = {
        id: `${Date.now()}-${currentBlock.id}`,
        date: new Date().toISOString(),
        subject: currentBlock.subject,
        subjectType: currentBlock.subjectType,
        content: content || currentBlock.content || 'Estudo realizado',
        blockId: currentBlock.id,
        skipped: false,
      };

      // Calcular próximo índice
      const nextIndex = (prev.currentBlockIndex + 1) % prev.blocks.length;
      const completedCycle = nextIndex === 0;

      const streakUpdate = updateStreak(prev);

      const newData: StudyData = {
        ...prev,
        currentBlockIndex: nextIndex,
        completedCycles: completedCycle ? prev.completedCycles + 1 : prev.completedCycles,
        totalMinutesStudied: prev.totalMinutesStudied + currentBlock.duration,
        currentStreak: streakUpdate.currentStreak,
        longestStreak: streakUpdate.longestStreak,
        todayBlocks: streakUpdate.todayBlocks,
        lastStudyDate: new Date().toISOString(),
        history: [historyEntry, ...prev.history],
        blocks: prev.blocks.map(block =>
          block.id === currentBlock.id ? { ...block, content: '' } : block
        ),
      };

      salvarDados(newData);
      return newData;
    });
  }, [salvarDados]);

  // Pular bloco atual (com registro)
  const pularBloco = useCallback(() => {
    setData(prev => {
      const currentBlock = prev.blocks[prev.currentBlockIndex];
      
      const historyEntry: HistoryEntry = {
        id: `${Date.now()}-${currentBlock.id}-skip`,
        date: new Date().toISOString(),
        subject: currentBlock.subject,
        subjectType: currentBlock.subjectType,
        content: 'Bloco pulado',
        blockId: currentBlock.id,
        skipped: true,
      };

      const nextIndex = (prev.currentBlockIndex + 1) % prev.blocks.length;
      const completedCycle = nextIndex === 0;

      const newData: StudyData = {
        ...prev,
        currentBlockIndex: nextIndex,
        completedCycles: completedCycle ? prev.completedCycles + 1 : prev.completedCycles,
        skippedBlocks: prev.skippedBlocks + 1,
        history: [historyEntry, ...prev.history],
        blocks: prev.blocks.map(block =>
          block.id === currentBlock.id ? { ...block, content: '' } : block
        ),
      };

      salvarDados(newData);
      return newData;
    });
  }, [salvarDados]);

  // Limpar apenas o histórico
  const limparHistorico = useCallback(() => {
    setData(prev => {
      const newData = {
        ...prev,
        history: [],
      };
      salvarDados(newData);
      return newData;
    });
  }, [salvarDados]);

  // Atualizar blocos do ciclo
  const atualizarBlocos = useCallback((newBlocks: StudyBlock[], newDailyGoal: number) => {
    setData(prev => {
      // Ajusta o índice atual se necessário
      const newIndex = prev.currentBlockIndex >= newBlocks.length 
        ? 0 
        : prev.currentBlockIndex;
      
      const newData = {
        ...prev,
        blocks: newBlocks,
        currentBlockIndex: newIndex,
        dailyGoal: newDailyGoal,
      };
      salvarDados(newData);
      return newData;
    });
  }, [salvarDados]);

  // Carregar dados na inicialização
  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  return {
    data,
    isLoaded,
    currentBlock: data.blocks[data.currentBlockIndex],
    atualizarConteudo,
    concluirBloco,
    pularBloco,
    limparHistorico,
    atualizarBlocos,
  };
}
