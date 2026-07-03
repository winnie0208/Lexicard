export type PronunciationAccent = 'US'

export interface Card {
  id: string
  word: string
  normalizedWord: string
  phonetic: string
  pronunciationAccent: PronunciationAccent
  note: string
  isStarred: boolean
  repeatCount: number
  errorCount: number
  familiarityScore: number
  createdAt: number
  updatedAt: number
}
