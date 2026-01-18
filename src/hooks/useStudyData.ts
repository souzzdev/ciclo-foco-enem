import { useState, useEffect, useCallback } from 'react';
import { StudyData, HistoryEntry, INITIAL_DATA } from '@/types/study';

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
      };

      // Calcular próximo índice
      const nextIndex = (prev.currentBlockIndex + 1) % prev.blocks.length;
      const completedCycle = nextIndex === 0;

      const newData: StudyData = {
        ...prev,
        currentBlockIndex: nextIndex,
        completedCycles: completedCycle ? prev.completedCycles + 1 : prev.completedCycles,
        totalMinutesStudied: prev.totalMinutesStudied + currentBlock.duration,
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
    limparHistorico,
  };
}
