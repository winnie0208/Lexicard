import { useMemo, useState, type DragEvent } from 'react'
import { Link } from 'react-router'
import { filterAndSortCards } from '../lib/cardLibraryQuery'
import { ChevronDownIcon, SearchIcon } from './icons'
import type { Card } from '../types/card'
import type { Sense } from '../types/sense'

interface WordListPanelProps {
  cards: Card[]
  sensesByCardId: Map<string, Sense[]>
  onDiscussCard: (card: Card) => void
}

// Drop target key used by AiConversationFeed's onDrop handler.
export const WORD_CARD_DRAG_TYPE = 'text/plain'

function WordListPanel({ cards, sensesByCardId, onDiscussCard }: WordListPanelProps) {
  const [search, setSearch] = useState('')
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)

  const visibleCards = useMemo(
    () => filterAndSortCards(cards, sensesByCardId, { search, filter: 'all', sort: 'recent' }),
    [cards, sensesByCardId, search],
  )

  function handleDragStart(event: DragEvent<HTMLLIElement>, card: Card) {
    event.dataTransfer.setData(WORD_CARD_DRAG_TYPE, card.id)
    event.dataTransfer.effectAllowed = 'copy'
  }

  function toggleExpanded(cardId: string) {
    setExpandedCardId((prev) => (prev === cardId ? null : cardId))
  }

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col gap-3 overflow-hidden rounded-card border border-rule bg-surface p-4">
      <div className="relative shrink-0">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-soft/60" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="搜尋"
          aria-label="搜尋單字"
          className="min-h-[44px] w-full rounded-full border border-rule bg-paper px-4 py-2.5 pl-11 text-base leading-6 tracking-wide text-ink placeholder:text-ink-soft/50 focus:border-accent focus:outline-none"
        />
      </div>

      {cards.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm font-semibold text-ink-soft">建立你的單字卡</p>
        </div>
      ) : visibleCards.length === 0 ? (
        <p className="text-sm text-ink-soft">找不到符合的單字。</p>
      ) : (
        <ul className="scrollbar-subtle -mr-3 min-h-0 min-w-0 flex-1 space-y-2 overflow-y-auto pr-3">
          {visibleCards.map((card) => {
            const isExpanded = expandedCardId === card.id
            const senses = sensesByCardId.get(card.id) ?? []
            const sortedSenses = [...senses].sort(
              (a, b) => Number(b.isPrimary) - Number(a.isPrimary),
            )
            return (
              <li
                key={card.id}
                draggable
                onDragStart={(event) => handleDragStart(event, card)}
                className="min-w-0 cursor-grab overflow-hidden rounded-2xl bg-paper-deep active:cursor-grabbing"
              >
                <button
                  type="button"
                  onClick={() => toggleExpanded(card.id)}
                  aria-expanded={isExpanded}
                  className="flex min-h-[44px] w-full min-w-0 items-center gap-2 px-3 py-2.5 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg font-semibold text-ink">
                      {card.word}
                    </p>
                    {card.partOfSpeech && (
                      <span className="mt-1 inline-block rounded-full bg-surface px-2 py-0.5 font-mono text-xs text-ink-soft">
                        {card.partOfSpeech}
                      </span>
                    )}
                  </div>
                  <ChevronDownIcon
                    className={`h-4 w-4 shrink-0 text-ink-soft transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`px-3 pb-3 transition-opacity duration-200 ${
                        isExpanded ? 'opacity-100 delay-100' : 'opacity-0'
                      }`}
                    >
                      {senses.length > 0 ? (
                        <ul className="space-y-1.5">
                          {sortedSenses.map((sense) => (
                            <li key={sense.id} className="rounded-xl bg-surface px-3 py-2">
                              <div className="flex min-w-0 items-center gap-2">
                                <p className="min-w-0 truncate text-base font-semibold text-ink">
                                  {sense.chineseMeaning}
                                </p>
                                {sense.isPrimary && (
                                  <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white">
                                    始
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-ink-soft">尚無詞義紀錄</p>
                      )}

                      <div className="mt-4 flex gap-2">
                        <Link
                          to={`/cards/${card.id}`}
                          className="flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-ink-soft px-3 text-xs font-semibold text-paper hover:bg-ink-soft/90"
                        >
                          查看詳情
                        </Link>
                        <button
                          type="button"
                          onClick={() => onDiscussCard(card)}
                          className="flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-accent px-3 text-xs font-semibold text-paper hover:bg-accent/90"
                        >
                          AI 討論
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default WordListPanel
