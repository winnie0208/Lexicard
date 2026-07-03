import { useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import FamiliarityIcon from '../components/FamiliarityIcon'
import LibraryMoreMenu from '../components/LibraryMoreMenu'
import { useCardLibrary } from '../hooks/useCardLibrary'
import { filterAndSortCards, type LibraryFilter, type LibrarySort } from '../lib/cardLibraryQuery'

const SORT_OPTIONS: { value: LibrarySort; label: string }[] = [
  { value: 'recent', label: '最近新增' },
  { value: 'familiarityAsc', label: '熟悉度由低到高' },
  { value: 'familiarityDesc', label: '熟悉度由高到低' },
  { value: 'az', label: 'A-Z' },
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

  return (
    <div className="p-4 pb-8">
      <header className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">單字庫</h1>
          <p className="mt-1 text-sm text-gray-500">共 {cards.length} 張單字卡</p>
        </div>
        <LibraryMoreMenu />
      </header>

      <div className="mb-4 space-y-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="搜尋單字或中文意思"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
        />
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1 rounded-md bg-gray-100 p-1 text-sm">
            <button
              type="button"
              onClick={() => setFilter('all')}
              aria-pressed={filter === 'all'}
              className={`rounded px-3 py-1 ${
                filter === 'all' ? 'bg-white font-medium text-purple-600 shadow' : 'text-gray-500'
              }`}
            >
              全部
            </button>
            <button
              type="button"
              onClick={() => setFilter('starred')}
              aria-pressed={filter === 'starred'}
              className={`rounded px-3 py-1 ${
                filter === 'starred'
                  ? 'bg-white font-medium text-purple-600 shadow'
                  : 'text-gray-500'
              }`}
            >
              星號
            </button>
          </div>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as LibrarySort)}
            aria-label="排序"
            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <p className="py-16 text-center text-sm text-gray-400">載入中…</p>
      ) : !hasAnyCard ? (
        <EmptyState
          title="尚未建立任何單字卡"
          description="先建立你的第一張單字卡，開始累積字彙庫。"
          actionTo="/add"
          actionLabel="新增單字"
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
        <ul className="divide-y divide-gray-100">
          {visibleCards.map((card) => (
            <li key={card.id} className="flex items-center justify-between py-3">
              <span className="font-medium">{card.word}</span>
              <span className="flex items-center gap-3">
                <FamiliarityIcon score={card.familiarityScore} />
                <span
                  aria-hidden="true"
                  className={card.isStarred ? 'text-yellow-500' : 'text-gray-300'}
                >
                  {card.isStarred ? '★' : '☆'}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CardLibraryPage
