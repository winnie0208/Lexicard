import { useMemo, useState, type MouseEvent } from 'react'
import { Link } from 'react-router'
import EmptyState from '../components/EmptyState'
import FamiliarityIcon from '../components/FamiliarityIcon'
import LibraryMoreMenu from '../components/LibraryMoreMenu'
import SelectMenu from '../components/SelectMenu'
import { SearchIcon, SpeakerIcon, StarIcon } from '../components/icons'
import { useCardLibrary } from '../hooks/useCardLibrary'
import { filterAndSortCards, type LibraryFilter, type LibrarySort } from '../lib/cardLibraryQuery'
import { updateCard } from '../lib/repositories/cardRepository'
import emptyLibraryIllustration from '../assets/empty-library.png'
import type { Card } from '../types/card'

const SORT_OPTIONS: { value: LibrarySort; label: string }[] = [
  { value: 'recent', label: '最近新增' },
  { value: 'familiarityAsc', label: '熟悉度低到高' },
  { value: 'familiarityDesc', label: '熟悉度高到低' },
  { value: 'az', label: 'A–Z' },
]

const FILTER_OPTIONS: { value: LibraryFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'starred', label: '星號' },
]

function CardLibraryPage() {
  const { cards, sensesByCardId, isLoading } = useCardLibrary()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<LibraryFilter>('all')
  const [sort, setSort] = useState<LibrarySort>('recent')

  const visibleCards = useMemo(
    () => filterAndSortCards(cards, sensesByCardId, { search, filter, sort }),
    [cards, sensesByCardId, search, filter, sort],
  )

  const hasAnyCard = cards.length > 0
  const hasSearch = search.trim().length > 0

  function handleToggleStar(event: MouseEvent, card: Card) {
    event.preventDefault()
    event.stopPropagation()
    void updateCard(card.id, { isStarred: !card.isStarred })
  }

  function handlePlayPronunciation(event: MouseEvent, card: Card) {
    event.preventDefault()
    event.stopPropagation()
    if (!('speechSynthesis' in window)) return
    const utterance = new SpeechSynthesisUtterance(card.word)
    utterance.lang = 'en-US'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pt-6 pb-10">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <h1 className="font-display text-3xl font-bold text-ink">單字庫</h1>
          <p className="text-sm text-ink-soft">共 {cards.length} 字</p>
        </div>
        <LibraryMoreMenu />
      </header>

      <div className="mb-6 space-y-3">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-soft/60" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="搜尋"
            className="min-h-[44px] w-full rounded-full border border-rule bg-surface py-2.5 pr-4 pl-11 text-sm text-ink placeholder:text-ink-soft/50 focus:border-accent focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              aria-pressed={filter === option.value}
              className={`flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors ${
                filter === option.value
                  ? 'bg-accent-soft text-accent'
                  : 'bg-paper-deep text-ink-soft'
              }`}
            >
              {option.value === 'starred' && (
                <StarIcon
                  filled
                  className={`h-4 w-4 ${filter === option.value ? 'text-accent' : 'text-ink-soft'}`}
                />
              )}
              {option.label}
            </button>
          ))}
          <div className="ml-auto">
            <SelectMenu value={sort} options={SORT_OPTIONS} onChange={setSort} ariaLabel="排序" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <p className="py-16 text-center text-sm text-ink-soft">載入中…</p>
      ) : !hasAnyCard ? (
        <EmptyState
          title="建立你的第一張單字卡"
          illustrationSrc={emptyLibraryIllustration}
          actionTo="/add"
          actionLabel="新增單字"
          actionVariant="ink"
        />
      ) : visibleCards.length === 0 && hasSearch ? (
        <EmptyState
          title="找不到符合的單字"
          description={`沒有符合「${search.trim()}」的單字卡。`}
          actionTo="/add"
          actionLabel="新增此單字"
          secondaryAction={{ label: '清除搜尋', onClick: () => setSearch('') }}
        />
      ) : visibleCards.length === 0 && filter === 'starred' ? (
        <EmptyState
          title="尚未標記星號字卡"
          description="在單字詳情頁將常用單字標記星號，方便日後快速篩選。"
        />
      ) : (
        <ul className="space-y-3">
          {visibleCards.map((card, index) => (
            <li
              key={card.id}
              style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}
              className="animate-rise-in opacity-0"
            >
              <Link
                to={`/cards/${card.id}`}
                className="flex items-center gap-2 rounded-card bg-surface px-3 py-4 shadow-sm transition-transform active:scale-[0.99]"
              >
                <button
                  type="button"
                  onClick={(event) => handleToggleStar(event, card)}
                  aria-label={card.isStarred ? '取消星號' : '標記星號'}
                  aria-pressed={card.isStarred}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full active:bg-paper-deep"
                >
                  <StarIcon
                    filled={card.isStarred}
                    className={`h-5 w-5 ${card.isStarred ? 'text-gold' : 'text-rule'}`}
                  />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="truncate font-display text-xl font-semibold text-ink">
                      {card.word}
                    </p>
                    {card.phonetic && (
                      <span className="shrink-0 truncate font-mono text-xs text-ink-soft">
                        {card.phonetic}
                      </span>
                    )}
                    {card.partOfSpeech && (
                      <span className="shrink-0 rounded-full bg-paper-deep px-2 py-0.5 font-mono text-xs text-ink-soft">
                        {card.partOfSpeech}
                      </span>
                    )}
                  </div>
                  <div className="mt-1">
                    <FamiliarityIcon score={card.familiarityScore} />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(event) => handlePlayPronunciation(event, card)}
                  aria-label="播放發音"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-stone-100 hover:text-accent"
                >
                  <SpeakerIcon className="h-5 w-5" />
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CardLibraryPage
