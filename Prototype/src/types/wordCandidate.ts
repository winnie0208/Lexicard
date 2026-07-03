// Transient / session-only: produced during handwriting or text-input word
// identification, never persisted to the database.
export interface WordCandidate {
  candidateWord: string
  confidenceScore: number
  cardExists: boolean
  cardId?: string
}
