import { db } from '../db'
import { generateId } from '../generateId'
import type { Relation, RelationSource, RelationType } from '../../types/relation'

export interface CreateRelationInput {
  sourceCardId: string
  targetCardId: string
  relationType: RelationType
  relationSource: RelationSource
  description?: string
}

export async function createRelation(input: CreateRelationInput): Promise<Relation> {
  const relation: Relation = {
    id: generateId(),
    sourceCardId: input.sourceCardId,
    targetCardId: input.targetCardId,
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

export function deleteRelation(id: string): Promise<void> {
  return db.relations.delete(id)
}
