import { db } from '../db'
import { generateId } from '../generateId'
import type { Sense } from '../../types/sense'

export interface CreateSenseInput {
  cardId: string
  partOfSpeech: string
  chineseMeaning: string
  usageContext?: string
  exampleSentence?: string
  exampleSentenceTranslation?: string
  isPrimary?: boolean
}

export type UpdateSenseInput = Partial<Omit<Sense, 'id' | 'cardId' | 'createdAt' | 'updatedAt'>>

export async function createSense(input: CreateSenseInput): Promise<Sense> {
  const now = Date.now()
  const sense: Sense = {
    id: generateId(),
    cardId: input.cardId,
    partOfSpeech: input.partOfSpeech,
    chineseMeaning: input.chineseMeaning,
    usageContext: input.usageContext ?? '',
    exampleSentence: input.exampleSentence ?? '',
    exampleSentenceTranslation: input.exampleSentenceTranslation ?? '',
    isPrimary: input.isPrimary ?? false,
    createdAt: now,
    updatedAt: now,
  }
  await db.senses.add(sense)
  return sense
}

export function getSenseById(id: string): Promise<Sense | undefined> {
  return db.senses.get(id)
}

export function getSensesByCardId(cardId: string): Promise<Sense[]> {
  return db.senses.where('cardId').equals(cardId).toArray()
}

export async function updateSense(
  id: string,
  changes: UpdateSenseInput,
): Promise<Sense | undefined> {
  await db.senses.update(id, { ...changes, updatedAt: Date.now() })
  return db.senses.get(id)
}

export function deleteSense(id: string): Promise<void> {
  return db.senses.delete(id)
}

export async function setPrimarySense(cardId: string, senseId: string): Promise<void> {
  await db.transaction('rw', db.senses, async () => {
    const senses = await db.senses.where('cardId').equals(cardId).toArray()
    const now = Date.now()
    await Promise.all(
      senses.map((sense) =>
        db.senses.update(sense.id, { isPrimary: sense.id === senseId, updatedAt: now }),
      ),
    )
  })
}
