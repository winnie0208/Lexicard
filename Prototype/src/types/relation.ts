export type RelationType = 'confusable' | 'similarMeaning' | 'partOfSpeechVariant'

export type RelationSource = 'manual' | 'ai'

export const RELATION_TYPE_LABEL: Record<RelationType, string> = {
  confusable: '易混淆單字',
  similarMeaning: '相似意思',
  partOfSpeechVariant: '詞性變化',
}

export interface Relation {
  // id/createdAt are not in the PRD's Relation field table but are required for
  // a Dexie primary key and for individual relation deletion (Phase 3).
  id: string
  sourceCardId: string
  targetCardId: string
  // Pairing level depends on relationType (PRD 3.3 關聯配對): similarMeaning
  // links two specific senses so both senseIds are required; confusable and
  // partOfSpeechVariant are card-level properties so senseIds stay undefined.
  sourceSenseId?: string
  targetSenseId?: string
  relationType: RelationType
  relationSource: RelationSource
  description: string
  createdAt: number
}

export function isSenseLevelRelationType(relationType: RelationType): boolean {
  return relationType === 'similarMeaning'
}
