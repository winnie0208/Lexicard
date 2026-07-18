import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../lib/db'
import { getRelationsForCard } from '../lib/repositories/relationRepository'
import type { Card } from '../types/card'
import type { Relation } from '../types/relation'
import type { Sense } from '../types/sense'

export interface RelationWithCard {
  relation: Relation
  otherCard: Card | undefined
  otherSense: Sense | undefined
}

export function useCardDetail(cardId: string | undefined) {
  const card = useLiveQuery(() => (cardId ? db.cards.get(cardId) : undefined), [cardId])

  const senses = useLiveQuery(
    () => (cardId ? db.senses.where('cardId').equals(cardId).toArray() : []),
    [cardId],
  )

  const relationsWithCards = useLiveQuery(async (): Promise<RelationWithCard[]> => {
    if (!cardId) return []
    const relations = await getRelationsForCard(cardId)
    const otherIds = relations.map((relation) =>
      relation.sourceCardId === cardId ? relation.targetCardId : relation.sourceCardId,
    )
    // Card-level relation types (confusable, partOfSpeechVariant) have no
    // senseIds, so fetch senses individually and leave those slots undefined.
    const otherSenseIds = relations.map((relation) =>
      relation.sourceCardId === cardId ? relation.targetSenseId : relation.sourceSenseId,
    )
    const [otherCards, otherSenses] = await Promise.all([
      db.cards.bulkGet(otherIds),
      Promise.all(otherSenseIds.map((senseId) => (senseId ? db.senses.get(senseId) : undefined))),
    ])
    return relations.map((relation, index) => ({
      relation,
      otherCard: otherCards[index],
      otherSense: otherSenses[index],
    }))
  }, [cardId])

  return {
    card,
    senses: senses ?? [],
    relationsWithCards: relationsWithCards ?? [],
  }
}
