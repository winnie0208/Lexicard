import { db } from '../db'
import { normalizeWord } from '../normalizeWord'
import { generateId } from '../generateId'
import { FAMILIARITY_INITIAL_SCORE } from '../familiarity'
import type { Card } from '../../types/card'

export interface CreateCardInput {
  word: string
  partOfSpeech?: string
  phonetic?: string
}

export type UpdateCardInput = Partial<Omit<Card, 'id' | 'createdAt' | 'updatedAt'>>

export async function createCard(input: CreateCardInput): Promise<Card> {
  const now = Date.now()
  const card: Card = {
    id: generateId(),
    word: input.word,
    normalizedWord: normalizeWord(input.word),
    partOfSpeech: input.partOfSpeech ?? '',
    phonetic: input.phonetic ?? '',
    pronunciationAccent: 'US',
    isStarred: false,
    repeatCount: 0,
    errorCount: 0,
    familiarityScore: FAMILIARITY_INITIAL_SCORE,
    createdAt: now,
    updatedAt: now,
  }
  await db.cards.add(card)
  return card
}

export function getCardById(id: string): Promise<Card | undefined> {
  return db.cards.get(id)
}

export function getAllCards(): Promise<Card[]> {
  return db.cards.toArray()
}

export function findCardByNormalizedWord(word: string): Promise<Card | undefined> {
  return db.cards.where('normalizedWord').equals(normalizeWord(word)).first()
}

export async function updateCard(id: string, changes: UpdateCardInput): Promise<Card | undefined> {
  await db.cards.update(id, { ...changes, updatedAt: Date.now() })
  return db.cards.get(id)
}

export async function deleteCard(id: string): Promise<void> {
  await db.transaction('rw', db.cards, db.senses, db.relations, async () => {
    await db.senses.where('cardId').equals(id).delete()
    await db.relations.where('sourceCardId').equals(id).delete()
    await db.relations.where('targetCardId').equals(id).delete()
    await db.cards.delete(id)
  })
}
