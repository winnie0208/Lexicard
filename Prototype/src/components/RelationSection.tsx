import { useMemo, useRef, useState, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router'
import { db } from '../lib/db'
import {
  createRelation,
  deleteRelation,
  updateRelation,
} from '../lib/repositories/relationRepository'
import { normalizeWord } from '../lib/normalizeWord'
import { RELATION_TYPE_LABEL, type RelationType } from '../types/relation'
import type { RelationWithCard } from '../hooks/useCardDetail'
import type { Card } from '../types/card'
import type { Sense } from '../types/sense'
import LabeledInput from './LabeledInput'
import ConfirmDialog from './ConfirmDialog'
import CardActionsMenu from './CardActionsMenu'
import { useSnapAlign } from '../hooks/useSnapAlign'
import { useHorizontalWheelScroll } from '../hooks/useHorizontalWheelScroll'
import { useDragToScroll } from '../hooks/useDragToScroll'
import { PlusIcon, SearchIcon } from './icons'

const RELATION_TYPE_OPTIONS: { value: RelationType; label: string }[] = [
  { value: 'partOfSpeechVariant', label: RELATION_TYPE_LABEL.partOfSpeechVariant },
  { value: 'similarMeaning', label: RELATION_TYPE_LABEL.similarMeaning },
  { value: 'confusable', label: RELATION_TYPE_LABEL.confusable },
]

const RELATION_TYPE_SORT_ORDER: Record<RelationType, number> = {
  partOfSpeechVariant: 0,
  similarMeaning: 1,
  confusable: 2,
}

function primarySenseOf(senses: Sense[]): Sense | undefined {
  return senses.find((sense) => sense.isPrimary) ?? senses[0]
}

interface RelationSectionProps {
  cardId: string
  relationsWithCards: RelationWithCard[]
}

function RelationSection({ cardId, relationsWithCards }: RelationSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingRelationId, setEditingRelationId] = useState<string | null>(null)
  const [relationToDelete, setRelationToDelete] = useState<RelationWithCard | null>(null)
  const scrollRef = useRef<HTMLUListElement>(null)
  useSnapAlign(scrollRef, 20, [relationsWithCards.length])
  useHorizontalWheelScroll(scrollRef, [relationsWithCards.length])
  useDragToScroll(scrollRef, [relationsWithCards.length])

  const sortedRelationsWithCards = [...relationsWithCards].sort(
    (a, b) =>
      RELATION_TYPE_SORT_ORDER[a.relation.relationType] -
      RELATION_TYPE_SORT_ORDER[b.relation.relationType],
  )

  const editingRelation = relationsWithCards.find((item) => item.relation.id === editingRelationId)

  async function handleConfirmDelete() {
    if (!relationToDelete) return
    await deleteRelation(relationToDelete.relation.id)
    setRelationToDelete(null)
  }

  return (
    <>
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            關聯單字<span className="text-ink-soft">({relationsWithCards.length})</span>
          </h2>
          {!isAdding && (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              aria-label="新增關聯"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-paper-deep text-ink-soft hover:bg-accent-soft hover:text-accent"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {relationsWithCards.length === 0 && !isAdding && (
          <p className="text-sm text-ink-soft">尚未建立關聯。</p>
        )}

        {relationsWithCards.length > 0 && (
          <ul
            ref={scrollRef}
            className="-mx-5 flex cursor-grab items-stretch gap-2 overflow-x-auto px-5 pb-2 [-webkit-mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)] [mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)] [scrollbar-width:none] snap-x snap-mandatory scroll-px-5 [&::-webkit-scrollbar]:hidden"
          >
            {sortedRelationsWithCards
              .filter(({ relation }) => relation.id !== editingRelationId)
              .map(({ relation, otherCard, otherSense }) => (
                <RelationItem
                  key={relation.id}
                  relation={relation}
                  otherCard={otherCard}
                  otherSense={otherSense}
                  onEdit={() => setEditingRelationId(relation.id)}
                  onDelete={() => setRelationToDelete({ relation, otherCard, otherSense })}
                />
              ))}
          </ul>
        )}

        {editingRelation && (
          <div className="mt-3">
            <RelationEditForm
              relation={editingRelation.relation}
              otherCard={editingRelation.otherCard}
              otherSense={editingRelation.otherSense}
              onDone={() => setEditingRelationId(null)}
            />
          </div>
        )}

        {isAdding && (
          <AddRelationForm
            cardId={cardId}
            relationsWithCards={relationsWithCards}
            onDone={() => setIsAdding(false)}
          />
        )}
      </section>

      {relationToDelete && (
        <ConfirmDialog
          title={`確定要刪除與「${relationToDelete.otherCard?.word ?? '（已刪除的字卡）'}」的關聯嗎？`}
          description="刪除後無法恢復"
          onConfirm={() => void handleConfirmDelete()}
          onCancel={() => setRelationToDelete(null)}
        />
      )}
    </>
  )
}

interface RelationWordRowProps {
  otherCard: Card | undefined
  otherSense: RelationWithCard['otherSense']
}

function RelationWordRow({ otherCard, otherSense }: RelationWordRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="truncate font-display text-2xl text-ink">
        {otherCard?.word ?? '（已刪除的字卡）'}
      </p>
      {otherCard?.partOfSpeech && (
        <span className="shrink-0 rounded-full bg-paper-deep px-2 py-0.5 font-mono text-xs text-ink-soft">
          {otherCard.partOfSpeech}
        </span>
      )}
      {otherSense && (
        <p className="truncate text-base font-semibold text-ink">{otherSense.chineseMeaning}</p>
      )}
    </div>
  )
}

function RelationTypeTag({ relation }: { relation: RelationWithCard['relation'] }) {
  const typeTagLabel =
    RELATION_TYPE_LABEL[relation.relationType] + (relation.relationSource === 'ai' ? ' ‧ AI' : '')

  return (
    <span className="whitespace-nowrap rounded-full bg-paper-deep px-2 py-0.5 text-sm font-semibold text-ink-soft">
      {typeTagLabel}
    </span>
  )
}

interface RelationItemProps {
  relation: RelationWithCard['relation']
  otherCard: Card | undefined
  otherSense: RelationWithCard['otherSense']
  onEdit: () => void
  onDelete: () => void
}

function RelationItem({ relation, otherCard, otherSense, onEdit, onDelete }: RelationItemProps) {
  const content = (
    <>
      <div className="min-w-0">
        <RelationWordRow otherCard={otherCard} otherSense={otherSense} />
        {relation.description && (
          <p className="mt-1 text-sm text-ink-soft">{relation.description}</p>
        )}
        <div className="mt-2 flex items-center">
          <RelationTypeTag relation={relation} />
        </div>
      </div>
      <CardActionsMenu onEdit={onEdit} onDelete={onDelete} />
    </>
  )

  const className =
    'flex h-full items-center justify-between gap-2 rounded-card bg-surface px-4 py-3 shadow-sm'

  if (!otherCard) {
    return (
      <li className="w-72 shrink-0 snap-start">
        <div className={className}>{content}</div>
      </li>
    )
  }

  return (
    <li className="w-72 shrink-0 snap-start">
      <Link
        to={`/cards/${otherCard.id}`}
        className={`${className} transition-transform active:scale-[0.99]`}
      >
        {content}
      </Link>
    </li>
  )
}

interface RelationEditFormProps {
  relation: RelationWithCard['relation']
  otherCard: Card | undefined
  otherSense: RelationWithCard['otherSense']
  onDone: () => void
}

function RelationEditForm({ relation, otherCard, otherSense, onDone }: RelationEditFormProps) {
  const [description, setDescription] = useState(relation.description)
  const [relationType, setRelationType] = useState<RelationType>(relation.relationType)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await updateRelation(relation.id, { description: description.trim(), relationType })
    onDone()
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="space-y-3 rounded-card border border-rule bg-surface p-4"
    >
      <h3 className="font-display text-base font-normal text-ink-soft">編輯關聯</h3>

      <RelationWordRow otherCard={otherCard} otherSense={otherSense} />

      <div>
        <span className="mb-1 block text-xs font-medium tracking-wide text-ink-soft">類型</span>
        <div className="flex flex-wrap gap-2">
          {RELATION_TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRelationType(option.value)}
              aria-pressed={relationType === option.value}
              className={`flex h-11 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
                relationType === option.value
                  ? 'bg-accent-soft text-accent'
                  : 'bg-paper-deep text-ink-soft'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <LabeledInput
        id={`relation-description-${relation.id}`}
        label="備註"
        placeholder="選填"
        value={description}
        onChange={setDescription}
      />
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onDone}
          className="min-h-[44px] rounded-full px-4 text-sm font-semibold text-ink-soft hover:bg-paper-deep"
        >
          取消
        </button>
        <button
          type="submit"
          className="min-h-[44px] rounded-full bg-accent px-5 text-sm font-semibold text-paper hover:bg-accent/90"
        >
          儲存
        </button>
      </div>
    </form>
  )
}

interface AddRelationFormProps {
  cardId: string
  relationsWithCards: RelationWithCard[]
  onDone: () => void
}

function AddRelationForm({ cardId, relationsWithCards, onDone }: AddRelationFormProps) {
  const allCards = useLiveQuery(() => db.cards.toArray(), [])
  const allSenses = useLiveQuery(() => db.senses.toArray(), [])

  const [targetQuery, setTargetQuery] = useState('')
  const [selectedTarget, setSelectedTarget] = useState<Card | undefined>(undefined)
  const [targetSenseId, setTargetSenseId] = useState<string | undefined>(undefined)
  const [relationType, setRelationType] = useState<RelationType>('confusable')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  const sensesByCardId = useMemo(() => {
    const map = new Map<string, Sense[]>()
    for (const sense of allSenses ?? []) {
      const list = map.get(sense.cardId)
      if (list) {
        list.push(sense)
      } else {
        map.set(sense.cardId, [sense])
      }
    }
    return map
  }, [allSenses])

  const trimmedQuery = targetQuery.trim()
  const suggestions = useMemo(() => {
    if (!trimmedQuery || selectedTarget) return []
    const normalizedQuery = normalizeWord(targetQuery)
    const matchingCards = (allCards ?? []).filter(
      (card) => card.id !== cardId && card.normalizedWord.includes(normalizedQuery),
    )
    return matchingCards.flatMap((card) =>
      (sensesByCardId.get(card.id) ?? []).map((sense) => ({ card, sense })),
    )
  }, [allCards, sensesByCardId, targetQuery, trimmedQuery, selectedTarget, cardId])

  const selectedSense = selectedTarget
    ? (sensesByCardId.get(selectedTarget.id) ?? []).find((sense) => sense.id === targetSenseId)
    : undefined

  function handleSelectSuggestion(card: Card, sense: Sense) {
    setSelectedTarget(card)
    setTargetQuery(card.word)
    setTargetSenseId(sense.id)
    setError(null)
  }

  function handleResetTarget() {
    setSelectedTarget(undefined)
    setTargetSenseId(undefined)
    setTargetQuery('')
    setError(null)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!selectedTarget || !targetSenseId) {
      setError('請從搜尋結果中選擇單字。')
      return
    }
    const alreadyLinked = relationsWithCards.some(
      (item) =>
        item.otherCard?.id === selectedTarget.id && item.relation.relationType === relationType,
    )
    if (alreadyLinked) {
      setError('這兩張字卡已經有相同類型的關聯了。')
      return
    }
    const sourceSense = primarySenseOf(sensesByCardId.get(cardId) ?? [])
    if (!sourceSense) {
      setError('目前字卡尚無詞義，無法建立關聯。')
      return
    }

    await createRelation({
      sourceCardId: cardId,
      targetCardId: selectedTarget.id,
      sourceSenseId: sourceSense.id,
      targetSenseId,
      relationType,
      relationSource: 'manual',
      description: description.trim(),
    })
    handleResetTarget()
    setDescription('')
    onDone()
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="mt-3 space-y-3 rounded-card border border-rule bg-surface p-4"
    >
      <h3 className="font-display text-base font-normal text-ink-soft">新增關聯</h3>

      <div className="relative">
        {selectedTarget ? (
          <div className="flex min-h-[44px] items-center gap-2 rounded-full border border-rule bg-surface py-2 pr-2 pl-4">
            <span className="truncate font-display text-sm font-semibold text-ink">
              {selectedTarget.word}
            </span>
            {selectedTarget.partOfSpeech && (
              <span className="shrink-0 rounded-full bg-paper-deep px-1.5 py-0.5 font-mono text-xs text-ink-soft">
                {selectedTarget.partOfSpeech}
              </span>
            )}
            {selectedSense && (
              <span className="truncate text-xs text-ink-soft">{selectedSense.chineseMeaning}</span>
            )}
            <button
              type="button"
              onClick={handleResetTarget}
              className="ml-auto shrink-0 rounded-full px-2 py-1 text-xs font-semibold text-ink-soft hover:bg-paper-deep"
            >
              重新搜尋
            </button>
          </div>
        ) : (
          <>
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-soft/60" />
            <input
              id="relation-target-word"
              required
              placeholder="輸入已存在的單字"
              value={targetQuery}
              onChange={(event) => {
                setTargetQuery(event.target.value)
                setSelectedTarget(undefined)
                setError(null)
              }}
              className="min-h-[44px] w-full rounded-full border border-rule bg-surface py-2.5 pr-4 pl-11 text-lg font-semibold text-ink placeholder:text-base placeholder:font-normal placeholder:text-ink-soft/50 focus:border-accent focus:outline-none"
            />
            {trimmedQuery.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-2xl border border-rule bg-surface shadow-lg">
                {suggestions.length > 0 ? (
                  suggestions.map(({ card, sense }) => (
                    <li key={sense.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectSuggestion(card, sense)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-paper-deep"
                      >
                        <span className="font-display text-sm font-semibold text-ink">
                          {card.word}
                        </span>
                        {card.partOfSpeech && (
                          <span className="shrink-0 rounded-full bg-paper-deep px-1.5 py-0.5 font-mono text-xs text-ink-soft">
                            {card.partOfSpeech}
                          </span>
                        )}
                        <span className="truncate text-xs text-ink-soft">
                          {sense.chineseMeaning}
                        </span>
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-sm text-ink-soft">找不到符合的單字</li>
                )}
              </ul>
            )}
          </>
        )}
      </div>

      <div>
        <span className="mb-1 block text-xs font-medium tracking-wide text-ink-soft">類型</span>
        <div className="flex flex-wrap gap-2">
          {RELATION_TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRelationType(option.value)}
              aria-pressed={relationType === option.value}
              className={`flex h-11 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
                relationType === option.value
                  ? 'bg-accent-soft text-accent'
                  : 'bg-paper-deep text-ink-soft'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <LabeledInput
        id="relation-description"
        label="備註"
        placeholder="選填"
        value={description}
        onChange={setDescription}
      />
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onDone}
          className="min-h-[44px] rounded-full px-4 text-sm font-semibold text-ink-soft hover:bg-paper-deep"
        >
          取消
        </button>
        <button
          type="submit"
          className="min-h-[44px] rounded-full bg-accent px-5 text-sm font-semibold text-paper hover:bg-accent/90"
        >
          新增
        </button>
      </div>
    </form>
  )
}

export default RelationSection
