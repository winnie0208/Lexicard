export type FamiliarityLevel = 'unfamiliar' | 'normal' | 'familiar'

export const FAMILIARITY_MIN = 0
export const FAMILIARITY_MAX = 100
export const FAMILIARITY_INITIAL_SCORE = 50

// PRD 第 5 章熟悉度規則的分數變化量，供 Phase 5／7 重複新增與快速學習作答時套用。
export const FAMILIARITY_SCORE_DELTA = {
  correctAnswer: 10,
  wrongAnswer: -15,
  duplicateExistingSense: -15,
  duplicateNewSense: -5,
} as const

export const FAMILIARITY_LEVEL_LABEL: Record<FamiliarityLevel, string> = {
  unfamiliar: '陌生',
  normal: '一般',
  familiar: '熟悉',
}

export const FAMILIARITY_LEVEL_BOOK_COUNT: Record<FamiliarityLevel, 1 | 2 | 3> = {
  unfamiliar: 1,
  normal: 2,
  familiar: 3,
}

export function clampFamiliarityScore(score: number): number {
  return Math.min(FAMILIARITY_MAX, Math.max(FAMILIARITY_MIN, Math.round(score)))
}

export function getFamiliarityLevel(score: number): FamiliarityLevel {
  if (score < 40) return 'unfamiliar'
  if (score < 70) return 'normal'
  return 'familiar'
}
