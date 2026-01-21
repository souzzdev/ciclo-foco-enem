/**
 * Representa as metas semanais por matéria
 * Exemplo: { "Matemática": 7, "Português": 7 }
 */
export type WeeklyGoals = Record<string, number>;

/**
 * Representa as horas acumuladas por matéria na semana
 */
export type WeeklyAccumulated = Record<string, number>;

/**
 * Resultado da distribuição diária
 */
export interface DailyDistribution {
  /** Horas distribuídas por matéria no dia */
  distribution: Record<string, number>;
  /** Total de horas distribuídas no dia */
  totalDistributed: number;
}

/**
 * Resultado do resumo semanal
 */
export interface WeeklySummary {
  /** Total de horas estudadas por matéria na semana */
  hoursPerSubject: Record<string, number>;
  /** Total geral de horas estudadas na semana */
  totalHours: number;
  /** Percentual de conclusão por matéria */
  completionPercentage: Record<string, number>;
  /** Percentual geral de conclusão */
  overallCompletion: number;
}

/**
 * Calcula a distribuição proporcional das horas diárias entre as matérias
 * com base nas metas semanais definidas.
 * 
 * @param weeklyGoals - Metas semanais por matéria (em horas)
 * @param dailyHours - Total de horas estudadas no dia
 * @returns Distribuição das horas entre as matérias
 * 
 * @example
 * const goals = { "Matemática": 7, "Português": 7 };
 * const result = distributeDaily(goals, 2);
 * // result.distribution = { "Matemática": 1, "Português": 1 }
 */
export function distributeDaily(
  weeklyGoals: WeeklyGoals,
  dailyHours: number
): DailyDistribution {
  const subjects = Object.keys(weeklyGoals);
  
  if (subjects.length === 0 || dailyHours <= 0) {
    return {
      distribution: {},
      totalDistributed: 0,
    };
  }

  // Calcula o total de horas semanais planejadas
  const totalWeeklyGoal = Object.values(weeklyGoals).reduce((sum, hours) => sum + hours, 0);

  if (totalWeeklyGoal <= 0) {
    return {
      distribution: {},
      totalDistributed: 0,
    };
  }

  // Distribui proporcionalmente as horas do dia
  const distribution: Record<string, number> = {};
  let totalDistributed = 0;

  subjects.forEach((subject) => {
    const subjectGoal = weeklyGoals[subject] || 0;
    const proportion = subjectGoal / totalWeeklyGoal;
    const distributedHours = dailyHours * proportion;
    
    distribution[subject] = Math.round(distributedHours * 100) / 100; // 2 casas decimais
    totalDistributed += distribution[subject];
  });

  return {
    distribution,
    totalDistributed: Math.round(totalDistributed * 100) / 100,
  };
}

/**
 * Acumula as horas distribuídas ao longo da semana.
 * 
 * @param currentAccumulated - Horas já acumuladas por matéria
 * @param dailyDistribution - Distribuição do dia a ser adicionada
 * @returns Novo acumulado com as horas do dia somadas
 * 
 * @example
 * const accumulated = { "Matemática": 3, "Português": 3 };
 * const daily = { "Matemática": 1, "Português": 1 };
 * const result = accumulateHours(accumulated, daily);
 * // result = { "Matemática": 4, "Português": 4 }
 */
export function accumulateHours(
  currentAccumulated: WeeklyAccumulated,
  dailyDistribution: Record<string, number>
): WeeklyAccumulated {
  const newAccumulated: WeeklyAccumulated = { ...currentAccumulated };

  Object.entries(dailyDistribution).forEach(([subject, hours]) => {
    newAccumulated[subject] = (newAccumulated[subject] || 0) + hours;
    newAccumulated[subject] = Math.round(newAccumulated[subject] * 100) / 100;
  });

  return newAccumulated;
}

/**
 * Calcula o resumo semanal de horas estudadas.
 * 
 * @param weeklyGoals - Metas semanais por matéria (em horas)
 * @param accumulated - Horas acumuladas por matéria na semana
 * @returns Resumo semanal com totais e percentuais
 * 
 * @example
 * const goals = { "Matemática": 7, "Português": 7 };
 * const accumulated = { "Matemática": 7, "Português": 3.5 };
 * const summary = getWeeklySummary(goals, accumulated);
 * // summary.totalHours = 10.5
 * // summary.completionPercentage = { "Matemática": 100, "Português": 50 }
 */
export function getWeeklySummary(
  weeklyGoals: WeeklyGoals,
  accumulated: WeeklyAccumulated
): WeeklySummary {
  const hoursPerSubject: Record<string, number> = {};
  const completionPercentage: Record<string, number> = {};
  let totalHours = 0;
  let totalGoal = 0;

  // Para cada matéria nas metas, calcula horas e percentual
  Object.keys(weeklyGoals).forEach((subject) => {
    const goal = weeklyGoals[subject] || 0;
    const studied = accumulated[subject] || 0;
    
    hoursPerSubject[subject] = Math.round(studied * 100) / 100;
    totalHours += studied;
    totalGoal += goal;

    if (goal > 0) {
      completionPercentage[subject] = Math.round((studied / goal) * 100);
    } else {
      completionPercentage[subject] = 0;
    }
  });

  // Inclui matérias que foram estudadas mas não estavam nas metas
  Object.keys(accumulated).forEach((subject) => {
    if (!(subject in hoursPerSubject)) {
      hoursPerSubject[subject] = accumulated[subject];
      completionPercentage[subject] = 100; // Considerado completo pois não tinha meta
    }
  });

  const overallCompletion = totalGoal > 0 
    ? Math.round((totalHours / totalGoal) * 100) 
    : 0;

  return {
    hoursPerSubject,
    totalHours: Math.round(totalHours * 100) / 100,
    completionPercentage,
    overallCompletion,
  };
}

/**
 * Função principal que processa um dia de estudo e retorna o estado atualizado.
 * Combina distribuição, acumulação e resumo em uma única chamada.
 * 
 * @param weeklyGoals - Metas semanais por matéria (em horas)
 * @param currentAccumulated - Horas já acumuladas na semana
 * @param dailyHours - Horas estudadas no dia
 * @returns Objeto com distribuição do dia, novo acumulado e resumo
 * 
 * @example
 * const goals = { "Matemática": 7, "Português": 7 };
 * const accumulated = { "Matemática": 3, "Português": 3 };
 * const result = processStudyDay(goals, accumulated, 2);
 * // result.dailyDistribution = { "Matemática": 1, "Português": 1 }
 * // result.newAccumulated = { "Matemática": 4, "Português": 4 }
 * // result.summary.totalHours = 8
 */
export function processStudyDay(
  weeklyGoals: WeeklyGoals,
  currentAccumulated: WeeklyAccumulated,
  dailyHours: number
): {
  dailyDistribution: DailyDistribution;
  newAccumulated: WeeklyAccumulated;
  summary: WeeklySummary;
} {
  const dailyDistribution = distributeDaily(weeklyGoals, dailyHours);
  const newAccumulated = accumulateHours(currentAccumulated, dailyDistribution.distribution);
  const summary = getWeeklySummary(weeklyGoals, newAccumulated);

  return {
    dailyDistribution,
    newAccumulated,
    summary,
  };
}

/**
 * Calcula as horas restantes para atingir as metas semanais.
 * 
 * @param weeklyGoals - Metas semanais por matéria
 * @param accumulated - Horas já acumuladas
 * @returns Horas restantes por matéria (negativo indica excesso)
 */
export function getRemainingHours(
  weeklyGoals: WeeklyGoals,
  accumulated: WeeklyAccumulated
): Record<string, number> {
  const remaining: Record<string, number> = {};

  Object.keys(weeklyGoals).forEach((subject) => {
    const goal = weeklyGoals[subject] || 0;
    const studied = accumulated[subject] || 0;
    remaining[subject] = Math.round((goal - studied) * 100) / 100;
  });

  return remaining;
}

/**
 * Calcula as horas extras estudadas além das metas.
 * 
 * @param weeklyGoals - Metas semanais por matéria
 * @param accumulated - Horas já acumuladas
 * @returns Horas extras por matéria (apenas valores positivos)
 */
export function getExtraHours(
  weeklyGoals: WeeklyGoals,
  accumulated: WeeklyAccumulated
): { extraPerSubject: Record<string, number>; totalExtra: number } {
  const extraPerSubject: Record<string, number> = {};
  let totalExtra = 0;

  Object.keys(weeklyGoals).forEach((subject) => {
    const goal = weeklyGoals[subject] || 0;
    const studied = accumulated[subject] || 0;
    const extra = Math.max(0, studied - goal);
    
    if (extra > 0) {
      extraPerSubject[subject] = Math.round(extra * 100) / 100;
      totalExtra += extra;
    }
  });

  return {
    extraPerSubject,
    totalExtra: Math.round(totalExtra * 100) / 100,
  };
}
