import { normalizeWord } from './normalizeWord'
import type { Card } from '../types/card'
import type { Sense } from '../types/sense'

export type LibraryFilter = 'all' | 'starred'
export type LibrarySort = 'recent' | 'familiarityAsc' | 'familiarityDesc' | 'az'

export interface LibraryQueryOptions {
  search: string
  filter: LibraryFilter
  sort: LibrarySort
}

export function filterAndSortCards(
  cards: Card[],
  sensesByCardId: Map<string, Sense[]>,
  { search, filter, sort }: LibraryQueryOptions,
): Card[] {
  const normalizedQuery = normalizeWord(search)
  const trimmedQuery = search.trim()

  let result = filter === 'starred' ? cards.filter((card) => card.isStarred) : cards

  if (normalizedQuery) {
    result = result.filter((card) => {
      if (card.normalizedWord.includes(normalizedQuery)) return true
      const senses = sensesByCardId.get(card.id) ?? []
      return senses.some((sense) => sense.chineseMeaning.includes(trimmedQuery))
    })
  }

  const sorted = [...result]
  switch (sort) {
    case 'recent':
      sorted.sort((a, b) => b.createdAt - a.createdAt)
      break
    case 'familiarityAsc':
      sorted.sort((a, b) => a.familiarityScore - b.familiarityScore)
      break
    case 'familiarityDesc':
      sorted.sort((a, b) => b.familiarityScore - a.familiarityScore)
      break
    case 'az':
      sorted.sort((a, b) => a.normalizedWord.localeCompare(b.normalizedWord))
      break
  }
  return sorted
}
