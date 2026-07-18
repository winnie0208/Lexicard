// In-progress inline edit of an existing sense (AI 討論摘要卡的行內編輯)：
// keyed by senseId in the add-word session store so an open edit survives
// route changes; an entry's presence means that sense's form is open.
export interface SenseEditDraft {
  chineseMeaning: string
  exampleSentence: string
  exampleSentenceTranslation: string
  note: string
}

export interface Sense {
  id: string
  cardId: string
  chineseMeaning: string
  exampleSentence: string
  exampleSentenceTranslation: string
  note: string
  isPrimary: boolean
  createdAt: number
  updatedAt: number
}
