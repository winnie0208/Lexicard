import { useRef, useState, type FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../lib/db'
import {
  createSense,
  deleteSense,
  setPrimarySense,
  updateSense,
} from '../lib/repositories/senseRepository'
import { getRelationsBySenseId } from '../lib/repositories/relationRepository'
import { PlusIcon } from './icons'
import LabeledInput from './LabeledInput'
import ConfirmDialog from './ConfirmDialog'
import CardActionsMenu from './CardActionsMenu'
import { useSnapAlign } from '../hooks/useSnapAlign'
import { useHorizontalWheelScroll } from '../hooks/useHorizontalWheelScroll'
import { useDragToScroll } from '../hooks/useDragToScroll'
import type { Sense } from '../types/sense'

interface SenseSectionProps {
  cardId: string
  senses: Sense[]
}

function SenseSection({ cardId, senses }: SenseSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingSenseId, setEditingSenseId] = useState<string | null>(null)
  const [senseToDelete, setSenseToDelete] = useState<Sense | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  useSnapAlign(scrollRef, 20, [senses.length])
  useHorizontalWheelScroll(scrollRef, [senses.length])
  useDragToScroll(scrollRef, [senses.length])

  const sortedSenses = [...senses].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))

  return (
    <>
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            詞義<span className="text-ink-soft">({senses.length})</span>
          </h2>
          {!isAdding && (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              aria-label="新增詞義"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-paper-deep text-ink-soft hover:bg-accent-soft hover:text-accent"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {senses.length === 0 && !isAdding ? (
          <p className="text-sm text-ink-soft">尚未新增詞義。</p>
        ) : (
          <div
            ref={scrollRef}
            className="-mx-5 flex cursor-grab items-stretch gap-3 overflow-x-auto px-5 pb-2 [-webkit-mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)] [mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)] [scrollbar-width:none] snap-x snap-mandatory scroll-px-5 [&::-webkit-scrollbar]:hidden"
          >
            {sortedSenses
              .filter((sense) => sense.id !== editingSenseId)
              .map((sense) => (
                <div
                  key={sense.id}
                  className="w-72 shrink-0 snap-start rounded-card bg-surface p-4 shadow-sm"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <p className="truncate font-display text-xl font-semibold text-ink">
                        {sense.chineseMeaning}
                      </p>
                      {sense.isPrimary && (
                        <span className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-sm font-semibold text-accent">
                          始
                        </span>
                      )}
                    </div>
                    <CardActionsMenu
                      onEdit={() => setEditingSenseId(sense.id)}
                      onDelete={() => setSenseToDelete(sense)}
                    />
                  </div>
                  {sense.usageContext && (
                    <p className="mt-1 text-sm text-ink-soft">{sense.usageContext}</p>
                  )}
                  {sense.exampleSentence && (
                    <p className="mt-2 text-lg leading-tight font-semibold text-ink">
                      {sense.exampleSentence}
                    </p>
                  )}
                  {sense.exampleSentenceTranslation && (
                    <p className="mt-1 text-base text-ink">{sense.exampleSentenceTranslation}</p>
                  )}
                  {sense.note && (
                    <p className="mt-2 border-t border-dashed border-rule pt-2 text-sm text-ink-soft/70">
                      #{sense.note}
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}

        {editingSenseId && (
          <div className="mt-3">
            <SenseForm
              cardId={cardId}
              initialSense={senses.find((sense) => sense.id === editingSenseId)}
              otherSenses={senses.filter((sense) => sense.id !== editingSenseId)}
              onDone={() => setEditingSenseId(null)}
            />
          </div>
        )}

        {isAdding && (
          <div className="mt-3">
            <SenseForm cardId={cardId} otherSenses={senses} onDone={() => setIsAdding(false)} />
          </div>
        )}
      </section>

      {senseToDelete && (
        <DeleteSenseDialog
          sense={senseToDelete}
          onCancel={() => setSenseToDelete(null)}
          onConfirm={() => setSenseToDelete(null)}
        />
      )}
    </>
  )
}

interface DeleteSenseDialogProps {
  sense: Sense
  onCancel: () => void
  onConfirm: () => void
}

function DeleteSenseDialog({ sense, onCancel, onConfirm }: DeleteSenseDialogProps) {
  const affected = useLiveQuery(async () => {
    const relations = await getRelationsBySenseId(sense.id)
    const otherIds = relations.map((relation) =>
      relation.sourceSenseId === sense.id ? relation.targetCardId : relation.sourceCardId,
    )
    const otherCards = await db.cards.bulkGet(otherIds)
    return relations.map((relation, index) => ({ relation, otherCard: otherCards[index] }))
  }, [sense.id])

  async function handleConfirm() {
    await deleteSense(sense.id)
    onConfirm()
  }

  return (
    <ConfirmDialog
      title={`確定要刪除「${sense.chineseMeaning}」嗎？`}
      description="刪除後無法恢復"
      onConfirm={() => void handleConfirm()}
      onCancel={onCancel}
    >
      {affected && affected.length > 0 && (
        <div className="mt-3 rounded-lg bg-paper px-3 py-2 text-sm text-ink">
          <p className="font-semibold text-ink-soft">將與以下單字解除關聯：</p>
          <p className="mt-1.5">
            {affected.map(({ relation, otherCard }, index) => (
              <span key={relation.id} className="inline-block">
                <span className="text-base font-semibold">
                  {otherCard?.word ?? '（已刪除的字卡）'}
                </span>
                {otherCard?.partOfSpeech && (
                  <span className="ml-1 rounded-full bg-paper-deep px-1.5 py-0.5 font-mono text-xs text-ink-soft">
                    {otherCard.partOfSpeech}
                  </span>
                )}
                {index < affected.length - 1 && <span className="mr-1">、</span>}
              </span>
            ))}
          </p>
        </div>
      )}
    </ConfirmDialog>
  )
}

interface SenseFormProps {
  cardId: string
  initialSense?: Sense
  otherSenses: Sense[]
  onDone: () => void
}

function SenseForm({ cardId, initialSense, otherSenses, onDone }: SenseFormProps) {
  const [chineseMeaning, setChineseMeaning] = useState(initialSense?.chineseMeaning ?? '')
  const [usageContext, setUsageContext] = useState(initialSense?.usageContext ?? '')
  const [exampleSentence, setExampleSentence] = useState(initialSense?.exampleSentence ?? '')
  const [exampleSentenceTranslation, setExampleSentenceTranslation] = useState(
    initialSense?.exampleSentenceTranslation ?? '',
  )
  const [note, setNote] = useState(initialSense?.note ?? '')
  const [wantsPrimary, setWantsPrimary] = useState(
    initialSense?.isPrimary ?? otherSenses.length === 0,
  )
  const [pendingDuplicateConfirm, setPendingDuplicateConfirm] = useState(false)

  const formInstanceId = initialSense?.id ?? 'new'
  const trimmedMeaning = chineseMeaning.trim()
  const isDuplicate =
    trimmedMeaning.length > 0 &&
    otherSenses.some((other) => other.chineseMeaning.trim() === trimmedMeaning)
  const isRequiredFilled =
    trimmedMeaning.length > 0 &&
    usageContext.trim().length > 0 &&
    exampleSentence.trim().length > 0 &&
    exampleSentenceTranslation.trim().length > 0

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!isRequiredFilled) return
    if (isDuplicate && !pendingDuplicateConfirm) {
      setPendingDuplicateConfirm(true)
      return
    }

    const fields = {
      chineseMeaning,
      usageContext,
      exampleSentence,
      exampleSentenceTranslation,
      note,
    }

    let senseId: string
    if (initialSense) {
      await updateSense(initialSense.id, fields)
      senseId = initialSense.id
    } else {
      const created = await createSense({ cardId, ...fields, isPrimary: otherSenses.length === 0 })
      senseId = created.id
    }
    if (wantsPrimary) {
      await setPrimarySense(cardId, senseId)
    }
    onDone()
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="space-y-2 rounded-card border border-rule bg-surface p-4"
    >
      <h3 className="font-display text-base font-normal text-ink-soft">
        {initialSense ? '編輯詞義' : '新增詞義'}
      </h3>

      <LabeledInput
        id={`sense-meaning-${formInstanceId}`}
        label="詞義"
        required
        placeholder="必填"
        value={chineseMeaning}
        onChange={(value) => {
          setChineseMeaning(value)
          setPendingDuplicateConfirm(false)
        }}
      />
      <LabeledInput
        id={`sense-context-${formInstanceId}`}
        label="使用情境"
        required
        placeholder="必填"
        value={usageContext}
        onChange={setUsageContext}
      />
      <LabeledInput
        id={`sense-example-${formInstanceId}`}
        label="例句"
        required
        placeholder="必填"
        value={exampleSentence}
        onChange={setExampleSentence}
      />
      <LabeledInput
        id={`sense-example-translation-${formInstanceId}`}
        label="例句翻譯"
        required
        placeholder="必填"
        value={exampleSentenceTranslation}
        onChange={setExampleSentenceTranslation}
      />
      <LabeledInput
        id={`sense-note-${formInstanceId}`}
        label="備註"
        placeholder="選填"
        value={note}
        onChange={setNote}
      />

      <label className="flex min-h-[44px] items-center gap-2 text-sm font-semibold text-ink-soft">
        <input
          type="checkbox"
          checked={wantsPrimary}
          onChange={(event) => setWantsPrimary(event.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        設為原始意思
      </label>

      {isDuplicate && pendingDuplicateConfirm && (
        <div className="rounded-2xl bg-gold-soft px-3 py-2 text-sm text-ink">
          此中文意思已存在，是否仍要保存？
        </div>
      )}

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
          disabled={!isRequiredFilled}
          className="min-h-[44px] rounded-full bg-accent px-5 text-sm font-semibold text-paper hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent"
        >
          {isDuplicate && pendingDuplicateConfirm ? '仍要保存' : '儲存'}
        </button>
      </div>
    </form>
  )
}

export default SenseSection
