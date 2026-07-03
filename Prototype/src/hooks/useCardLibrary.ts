import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../lib/db'
import type { Card } from '../types/card'
import type { Sense } from '../types/sense'

export interface CardLibraryData {
  cards: Card[]
  sensesByCardId: Map<string, Sense[]>
  isLoading: boolean
}

export function useCardLibrary(): CardLibraryData {
  const cards = useLiveQuery(() => db.cards.toArray(), [])
  const senses = useLiveQuery(() => db.senses.toArray(), [])

  const sensesByCardId = new Map<string, Sense[]>()
  for (const sense of senses ?? []) {
    const list = sensesByCardId.get(sense.cardId)
    if (list) {
      list.push(sense)
    } else {
      sensesByCardId.set(sense.cardId, [sense])
    }
  }

  return {
    cards: cards ?? [],
    sensesByCardId,
    isLoading: cards === undefined || senses === undefined,
  }
}
