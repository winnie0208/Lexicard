import { db } from '../db'
import { generateId } from '../generateId'
import type { Relation, RelationSource, RelationType } from '../../types/relation'

export interface CreateRelationInput {
  sourceCardId: string
  targetCardId: string
  sourceSenseId: string
  targetSenseId: string
  relationType: RelationType
  relationSource: RelationSource
  description?: string
}

export async function createRelation(input: CreateRelationInput): Promise<Relation> {
  const relation: Relation = {
    id: generateId(),
    sourceCardId: input.sourceCardId,
    targetCardId: input.targetCardId,
    sourceSenseId: input.sourceSenseId,
    targetSenseId: input.targetSenseId,
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
  changes: { description: string; relationType: RelationType },
): Promise<void> {
  await db.relations.update(id, changes)
}

export function deleteRelation(id: string): Promise<void> {
  return db.relations.delete(id)
}
