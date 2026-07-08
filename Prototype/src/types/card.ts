export type PronunciationAccent = 'US'

export interface Card {
  id: string
  word: string
  normalizedWord: string
  // A Card has exactly one part of speech. The same word text used as a
  // different part of speech (e.g. "book" n. vs. v.) is a separate Card,
  // linked via a Relation of type 'partOfSpeechVariant'.
  partOfSpeech: string
  phonetic: string
  pronunciationAccent: PronunciationAccent
  isStarred: boolean
  repeatCount: number
  errorCount: number
  familiarityScore: number
  createdAt: number
  updatedAt: number
}
