export type RelationType = 'extension' | 'confusable' | 'similarMeaning' | 'partOfSpeechVariant'

export type RelationSource = 'manual' | 'ai'

export const RELATION_TYPE_LABEL: Record<RelationType, string> = {
  extension: '延伸單字',
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
  relationType: RelationType
  relationSource: RelationSource
  description: string
  createdAt: number
}
