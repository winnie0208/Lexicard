import Dexie, { type EntityTable } from 'dexie'
import type { Card } from '../types/card'
import type { Sense } from '../types/sense'
import type { Relation } from '../types/relation'

export class LexiCardDB extends Dexie {
  cards!: EntityTable<Card, 'id'>
  senses!: EntityTable<Sense, 'id'>
  relations!: EntityTable<Relation, 'id'>

  constructor() {
    super('lexicard')
    this.version(1).stores({
      cards: 'id, normalizedWord, isStarred, familiarityScore, createdAt',
      senses: 'id, cardId, chineseMeaning',
      relations: 'id, sourceCardId, targetCardId',
    })
  }
}

export const db = new LexiCardDB()
