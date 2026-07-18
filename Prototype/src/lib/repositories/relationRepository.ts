import { db } from '../db'
import { generateId } from '../generateId'
import {
  isSenseLevelRelationType,
  type Relation,
  type RelationSource,
  type RelationType,
} from '../../types/relation'

export interface CreateRelationInput {
  sourceCardId: string
  targetCardId: string
  // Required only for sense-level relation types (similarMeaning); ignored
  // for card-level types (confusable, partOfSpeechVariant).
  sourceSenseId?: string
  targetSenseId?: string
  relationType: RelationType
  relationSource: RelationSource
  description?: string
}

export async function createRelation(input: CreateRelationInput): Promise<Relation> {
  const isSenseLevel = isSenseLevelRelationType(input.relationType)
  if (isSenseLevel && (!input.sourceSenseId || !input.targetSenseId)) {
    throw new Error('相似意思關聯必須指定雙方的 sense。')
  }
  const relation: Relation = {
    id: generateId(),
    sourceCardId: input.sourceCardId,
    targetCardId: input.targetCardId,
    sourceSenseId: isSenseLevel ? input.sourceSenseId : undefined,
    targetSenseId: isSenseLevel ? input.targetSenseId : undefined,
    relationType: input.relationType,
    relationSource: input.relationSource,
    description: input.description ?? '',
    createdAt: Date.now(),
  }
  await db.relations.add(relation)
  return relation
}

export async function getRelationsForCard(cardId: string): Promise<Relation[]> {
  const [asSource, asTarget] = await Promise.all([
    db.relations.where('sourceCardId').equals(cardId).toArray(),
    db.relations.where('targetCardId').equals(cardId).toArray(),
  ])
  return [...asSource, ...asTarget]
}

export function getRelationsBySenseId(senseId: string): Promise<Relation[]> {
  return db.relations
    .filter((relation) => relation.sourceSenseId === senseId || relation.targetSenseId === senseId)
    .toArray()
}

export async function updateRelation(
  id: string,
  changes: {
    description: string
    relationType: RelationType
    sourceSenseId?: string
    targetSenseId?: string
  },
): Promise<void> {
  const isSenseLevel = isSenseLevelRelationType(changes.relationType)
  if (isSenseLevel && (!changes.sourceSenseId || !changes.targetSenseId)) {
    throw new Error('相似意思關聯必須指定雙方的 sense。')
  }
  await db.relations.update(id, {
    description: changes.description,
    relationType: changes.relationType,
    sourceSenseId: isSenseLevel ? changes.sourceSenseId : undefined,
    targetSenseId: isSenseLevel ? changes.targetSenseId : undefined,
  })
}

export function deleteRelation(id: string): Promise<void> {
  return db.relations.delete(id)
}
