import { type DragEvent } from 'react'
import { Link } from 'react-router'
import EmptyState from './EmptyState'
import FamiliarityIcon from './FamiliarityIcon'
import LabeledInput from './LabeledInput'
import SelectMenu from './SelectMenu'
import { CloseIcon } from './icons'
import { WORD_CARD_DRAG_TYPE } from './WordListPanel'
import { updateSense } from '../lib/repositories/senseRepository'
import aiDiscussEmptyIllustration from '../assets/ai-discuss-empty.png'
import type { Card } from '../types/card'
import type { Sense, SenseEditDraft } from '../types/sense'

export type ConversationMessage =
  | { role: 'user'; text: string }
  | { role: 'ai'; text: string }
  // Read-only summary of an existing card brought into the discussion,
  // rendered live from the db so edits/new senses show up immediately.
  // `highlightSenseId` emphasizes the sense matching what the user just
  // typed (輸入的中文為已存在語意時的強調 — PRD 3.2 重複判斷).
  | { role: 'ai-card-summary'; cardId: string; highlightSenseId?: string }

const MOCK_SUGGESTIONS = [
  { word: 'setting', partOfSpeech: 'n.', chineseMeaning: '環境；背景' },
  { word: 'reset', partOfSpeech: 'v.', chineseMeaning: '重設；重新設定' },
  { word: 'upset', partOfSpeech: 'adj.', chineseMeaning: '難過的；心煩的' },
]

const PART_OF_SPEECH_OPTIONS = [
  { value: '', label: '未選擇（必填）' },
  { value: 'v.', label: 'v.' },
  { value: 'n.', label: 'n.' },
  { value: 'adj.', label: 'adj.' },
  { value: 'adv.', label: 'adv.' },
  { value: 'prep.', label: 'prep.' },
  { value: 'phr.', label: 'phr.' },
]

interface AiConversationFeedProps {
  messages: ConversationMessage[]
  currentDiscussionCard: Card | undefined
  cardsById: Map<string, Card>
  sensesByCardId: Map<string, Sense[]>
  onClearTopic: () => void
  onDropCardId: (cardId: string) => void
  // Open inline sense edits in the summary cards, keyed by senseId. Owned by
  // the add-word session store (via the page) so an in-progress edit both
  // counts as unsaved work for the switch confirmation and survives route
  // changes; an entry's presence means that sense's form is open.
  senseEditDrafts: Record<string, SenseEditDraft>
  onSenseEditDraftsChange: (next: Record<string, SenseEditDraft>) => void
  // Whether to render the editable card preview. Discussing an existing card
  // with a clean draft shows only the read-only summary (PRD 3.2 既有字卡帶
  // 入討論); the editable preview appears once a new-sense draft has content.
  showCardPreview: boolean

  word: string
  onWordChange: (value: string) => void
  partOfSpeechOptions: string[]
  // Options whose card already contains the drafted meaning — labeled
  // 「意思相符」 in the PoS choice bubble (PRD 3.2 既有單字判斷).
  matchedPartOfSpeechOptions: string[]
  resolvedPartOfSpeech: string
  onSelectPartOfSpeech: (partOfSpeech: string) => void
  onPartOfSpeechChange: (value: string) => void
  needsPartOfSpeechChoice: boolean

  // 輸入含詞性但該單字沒有此詞性時的確認氣泡（確認建立新詞性字卡、改用
  // 既有詞性或取消 — PRD 3.2 既有單字判斷）。
  pendingPosConfirm: { word: string; partOfSpeech: string } | null
  pendingPosExistingOptions: string[]
  onConfirmPendingPos: () => void
  onPickPendingPos: (partOfSpeech: string) => void
  onCancelPendingPos: () => void

  // Card-level phonetic draft; only editable for brand-new cards — existing
  // cards keep their phonetic, so the field is hidden while discussing one.
  phonetic: string
  onPhoneticChange: (value: string) => void

  chineseMeaning: string
  onChineseMeaningChange: (value: string) => void
  exampleSentence: string
  onExampleSentenceChange: (value: string) => void
  exampleSentenceTranslation: string
  onExampleSentenceTranslationChange: (value: string) => void
  note: string
  onNoteChange: (value: string) => void
  isRequiredFilled: boolean
}

function AiConversationFeed({
  messages,
  currentDiscussionCard,
  cardsById,
  sensesByCardId,
  onClearTopic,
  onDropCardId,
  senseEditDrafts,
  onSenseEditDraftsChange,
  showCardPreview,
  word,
  onWordChange,
  partOfSpeechOptions,
  matchedPartOfSpeechOptions,
  resolvedPartOfSpeech,
  onSelectPartOfSpeech,
  onPartOfSpeechChange,
  needsPartOfSpeechChoice,
  pendingPosConfirm,
  pendingPosExistingOptions,
  onConfirmPendingPos,
  onPickPendingPos,
  onCancelPendingPos,
  phonetic,
  onPhoneticChange,
  chineseMeaning,
  onChineseMeaningChange,
  exampleSentence,
  onExampleSentenceChange,
  exampleSentenceTranslation,
  onExampleSentenceTranslationChange,
  note,
  onNoteChange,
  isRequiredFilled,
}: AiConversationFeedProps) {
  function handleDragOver(event: DragEvent<HTMLElement>) {
    if (event.dataTransfer.types.includes(WORD_CARD_DRAG_TYPE)) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'copy'
    }
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    const cardId = event.dataTransfer.getData(WORD_CARD_DRAG_TYPE)
    if (!cardId) return
    event.preventDefault()
    onDropCardId(cardId)
  }

  const hasContent = messages.length > 0
  const currentDiscussionSenses = currentDiscussionCard
    ? (sensesByCardId.get(currentDiscussionCard.id) ?? [])
    : []

  return (
    <section
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex h-full min-h-0 min-w-0 flex-col"
    >
      {word.trim().length > 0 && (
        <div className="mb-2 shrink-0 border-b border-rule/60 pb-2">
          <div className="flex min-w-0 items-start justify-between gap-2 rounded-2xl bg-gold-soft px-3 py-2.5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate font-display text-lg font-semibold text-ink">{word}</p>
                {resolvedPartOfSpeech && (
                  <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 font-mono text-xs text-ink-soft">
                    {resolvedPartOfSpeech}
                  </span>
                )}
                {currentDiscussionCard && (
                  <FamiliarityIcon score={currentDiscussionCard.familiarityScore} />
                )}
              </div>
              {currentDiscussionSenses.length > 0 && (
                <p className="mt-0.5 truncate text-xs text-ink-soft">
                  {currentDiscussionSenses.map((sense) => sense.chineseMeaning).join('、')}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClearTopic}
              aria-label="清除目前討論"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-surface"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="scrollbar-subtle min-h-0 flex-1 space-y-5 overflow-y-auto pr-3">
        {!hasContent && (
          <div className="flex h-full items-center justify-center">
            <EmptyState
              illustrationSrc={aiDiscussEmptyIllustration}
              title={
                <>
                  與 AI 討論學習
                  <br />
                  建立單字卡
                </>
              }
              bordered={false}
            />
          </div>
        )}

        {messages.map((message, index) => {
          if (message.role === 'user') {
            return (
              <div key={index} className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl bg-accent px-3 py-2 text-base whitespace-pre-wrap text-paper break-words">
                  {message.text}
                </p>
              </div>
            )
          }
          if (message.role === 'ai-card-summary') {
            const summaryCard = cardsById.get(message.cardId)
            if (!summaryCard) return null
            return (
              <ExistingCardSummaryCard
                key={index}
                card={summaryCard}
                senses={sensesByCardId.get(summaryCard.id) ?? []}
                highlightSenseId={message.highlightSenseId}
                senseEditDrafts={senseEditDrafts}
                onSenseEditDraftsChange={onSenseEditDraftsChange}
              />
            )
          }
          return (
            <p key={index} className="text-base whitespace-pre-wrap text-ink break-words">
              {message.text}
            </p>
          )
        })}

        {needsPartOfSpeechChoice && (
          <div className="flex justify-start">
            <div className="max-w-[92%] space-y-2 rounded-2xl bg-paper-deep p-3">
              <p className="text-sm text-ink">這個字有多種詞性，先選一個吧：</p>
              <div className="flex flex-wrap gap-2">
                {partOfSpeechOptions.map((partOfSpeech) => {
                  const isSelected = resolvedPartOfSpeech === partOfSpeech
                  return (
                    <button
                      key={partOfSpeech}
                      type="button"
                      onClick={() => onSelectPartOfSpeech(partOfSpeech)}
                      className={`flex min-h-[44px] items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors ${
                        isSelected
                          ? 'bg-accent text-paper'
                          : 'bg-surface text-ink-soft hover:bg-accent-soft hover:text-accent'
                      }`}
                    >
                      {partOfSpeech}
                      {matchedPartOfSpeechOptions.includes(partOfSpeech) && (
                        <span className="rounded-full bg-gold-soft px-1.5 py-0.5 text-[10px] font-normal text-ink">
                          意思相符
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {pendingPosConfirm && (
          <div className="flex justify-start">
            <div className="max-w-[92%] space-y-2 rounded-2xl bg-paper-deep p-3">
              <p className="text-sm text-ink">
                「{pendingPosConfirm.word}」沒有 {pendingPosConfirm.partOfSpeech}
                ，是否繼續建立「{pendingPosConfirm.word}」（{pendingPosConfirm.partOfSpeech}
                ）新字卡？
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onConfirmPendingPos}
                  className="min-h-[44px] rounded-full bg-accent px-4 text-sm font-semibold text-paper hover:bg-accent/90"
                >
                  繼續建立
                </button>
                {pendingPosExistingOptions.map((partOfSpeech) => (
                  <button
                    key={partOfSpeech}
                    type="button"
                    onClick={() => onPickPendingPos(partOfSpeech)}
                    className="min-h-[44px] rounded-full bg-surface px-4 text-sm font-semibold text-ink-soft hover:bg-accent-soft hover:text-accent"
                  >
                    改用 {partOfSpeech}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={onCancelPendingPos}
                  className="min-h-[44px] rounded-full px-4 text-sm font-semibold text-ink-soft hover:bg-surface"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {showCardPreview && (
          <div className="flex justify-start">
            <div className="min-w-0 w-[92%] max-w-[480px] space-y-2 rounded-2xl bg-paper-deep p-3">
              {/* 既有卡走「新增語意」模式：單字／詞性由上方摘要卡與釘選卡呈
                  現，表單只留 sense 欄位（PRD 3.2 重複判斷）；全新單字才顯
                  示完整卡片欄位。 */}
              {currentDiscussionCard ? (
                <div className="space-y-1.5">
                  {/* 「新增語意」為區塊標題在上，單字＋詞性（與摘要卡頭部
                      同款）在其下（使用者回饋，LOG-20260717-06）。 */}
                  <div>
                    <p className="text-sm font-semibold text-ink">新增語意</p>
                    <p className="text-xs text-ink-soft">
                      這個意思還不在字卡上，填齊後按「新增語意」即可加入
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-lg font-semibold text-ink">
                      {currentDiscussionCard.word}
                    </p>
                    {currentDiscussionCard.partOfSpeech && (
                      <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 font-mono text-xs text-ink-soft">
                        {currentDiscussionCard.partOfSpeech}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-ink">單字卡片預覽</p>
                  <p className="text-xs text-ink-soft">
                    目前依規則式自動分流，AI 尚未串接，請確認或補充內容
                  </p>
                </div>
              )}
              {!currentDiscussionCard && (
                <>
                  <LabeledInput
                    id="word-word"
                    label="單字"
                    required
                    placeholder="必填"
                    value={word}
                    onChange={onWordChange}
                  />
                  <div>
                    <label
                      htmlFor="word-part-of-speech"
                      className="mb-1 block text-xs font-medium tracking-wide text-ink-soft"
                    >
                      詞性
                    </label>
                    <SelectMenu
                      value={resolvedPartOfSpeech}
                      options={PART_OF_SPEECH_OPTIONS}
                      onChange={onPartOfSpeechChange}
                      ariaLabel="詞性"
                      triggerClassName="flex min-h-[44px] w-full items-center justify-between rounded-lg border border-rule bg-stone-100 px-3 py-2 text-base leading-6 tracking-wide font-semibold text-ink"
                    />
                  </div>
                  <LabeledInput
                    id="word-phonetic"
                    label="音標"
                    required
                    placeholder="必填（AI 串接後自動生成）"
                    value={phonetic}
                    onChange={onPhoneticChange}
                  />
                </>
              )}
              <LabeledInput
                id="word-meaning"
                label="詞義"
                required
                placeholder="必填"
                value={chineseMeaning}
                onChange={onChineseMeaningChange}
              />
              <LabeledInput
                id="word-example"
                label="例句"
                required
                placeholder="必填"
                value={exampleSentence}
                onChange={onExampleSentenceChange}
              />
              <LabeledInput
                id="word-example-translation"
                label="例句翻譯"
                required
                placeholder="必填"
                value={exampleSentenceTranslation}
                onChange={onExampleSentenceTranslationChange}
              />
              <LabeledInput
                id="word-note"
                label="備註"
                placeholder="選填"
                value={note}
                onChange={onNoteChange}
              />

              <button
                type="submit"
                disabled={!isRequiredFilled}
                className="min-h-[44px] w-full rounded-full bg-accent px-5 text-sm font-semibold text-paper hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent"
              >
                {currentDiscussionCard ? '新增語意' : '建立字卡'}
              </button>
            </div>
          </div>
        )}

        {messages.some((message) => message.role === 'ai') && (
          <div className="space-y-2 pt-1">
            <p className="text-sm font-semibold text-ink">以下是可繼續延伸學習的相關單字</p>
            <ul className="flex flex-wrap gap-2">
              {MOCK_SUGGESTIONS.map((suggestion) => (
                <li
                  key={`${suggestion.word}-${suggestion.partOfSpeech}`}
                  className="min-w-[132px] rounded-2xl border border-rule/80 bg-paper-deep px-3 py-2 shadow-sm"
                  title="延伸建議預覽，AI 尚未串接"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-base font-semibold text-ink">
                      {suggestion.word}
                    </span>
                    <span className="shrink-0 rounded-full bg-surface px-1.5 py-0.5 font-mono text-[11px] text-ink-soft">
                      {suggestion.partOfSpeech}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-ink">{suggestion.chineseMeaning}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

// Read-only summary of an existing card in the conversation flow. Content is
// read-only by default; each sense has an edit entry that expands inline
// editable fields (PRD 3.2 既有字卡帶入討論). Which forms are open — and
// what has been typed into them — lives in the session store's
// senseEditDrafts, so edits survive route changes and the same sense shown
// in two summary cards stays in sync.
function ExistingCardSummaryCard({
  card,
  senses,
  highlightSenseId,
  senseEditDrafts,
  onSenseEditDraftsChange,
}: {
  card: Card
  senses: Sense[]
  // 強調與使用者輸入相符的語意（PRD 3.2 重複判斷——中文為已存在語意時）。
  highlightSenseId?: string
  senseEditDrafts: Record<string, SenseEditDraft>
  onSenseEditDraftsChange: (next: Record<string, SenseEditDraft>) => void
}) {
  function startSenseEdit(sense: Sense) {
    onSenseEditDraftsChange({
      ...senseEditDrafts,
      [sense.id]: {
        chineseMeaning: sense.chineseMeaning,
        exampleSentence: sense.exampleSentence,
        exampleSentenceTranslation: sense.exampleSentenceTranslation,
        note: sense.note,
      },
    })
  }

  function endSenseEdit(senseId: string) {
    const next = { ...senseEditDrafts }
    delete next[senseId]
    onSenseEditDraftsChange(next)
  }

  return (
    <div className="flex justify-start">
      <div className="min-w-0 w-[92%] max-w-[480px] space-y-2 rounded-2xl bg-paper-deep p-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display text-lg font-semibold text-ink">{card.word}</p>
          {card.partOfSpeech && (
            <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 font-mono text-xs text-ink-soft">
              {card.partOfSpeech}
            </span>
          )}
          {card.phonetic && (
            <span className="font-mono text-xs text-ink-soft">{card.phonetic}</span>
          )}
          <FamiliarityIcon score={card.familiarityScore} />
        </div>

        {senses.length === 0 && <p className="text-sm text-ink-soft">這張字卡還沒有詞義。</p>}

        {senses.map((sense, index) => {
          const draft = senseEditDrafts[sense.id]
          return draft ? (
            <SenseInlineEditForm
              key={sense.id}
              sense={sense}
              draft={draft}
              onDraftChange={(patch) =>
                onSenseEditDraftsChange({
                  ...senseEditDrafts,
                  [sense.id]: { ...draft, ...patch },
                })
              }
              onDone={() => endSenseEdit(sense.id)}
            />
          ) : (
            <div
              key={sense.id}
              className={`rounded-xl p-2.5 ${
                highlightSenseId === sense.id ? 'bg-gold-soft ring-1 ring-accent/60' : 'bg-surface'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 text-sm font-semibold text-ink">
                  {index + 1}. {sense.chineseMeaning}
                  {sense.isPrimary && (
                    <span className="ml-1.5 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white">
                      始
                    </span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => startSenseEdit(sense)}
                  className="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold text-ink-soft hover:bg-paper-deep hover:text-accent"
                >
                  編輯
                </button>
              </div>
              <p className="mt-0.5 text-sm text-ink">{sense.exampleSentence}</p>
              <p className="text-xs text-ink-soft">{sense.exampleSentenceTranslation}</p>
              {sense.note && <p className="mt-0.5 text-xs text-ink-soft">備註：{sense.note}</p>}
            </div>
          )
        })}

        <div className="pt-1">
          <Link
            to={`/cards/${card.id}`}
            className="inline-flex min-h-[44px] min-w-[112px] items-center justify-center rounded-full bg-ink-soft px-3 text-xs font-semibold text-paper transition-colors hover:bg-ink-soft/90"
          >
            查看詳情
          </Link>
        </div>
      </div>
    </div>
  )
}

// Controlled by the session store's draft (via props) instead of local
// state, so typed-but-unsaved edits survive route changes.
function SenseInlineEditForm({
  sense,
  draft,
  onDraftChange,
  onDone,
}: {
  sense: Sense
  draft: SenseEditDraft
  onDraftChange: (patch: Partial<SenseEditDraft>) => void
  onDone: () => void
}) {
  const isValid =
    draft.chineseMeaning.trim().length > 0 &&
    draft.exampleSentence.trim().length > 0 &&
    draft.exampleSentenceTranslation.trim().length > 0

  async function handleSave() {
    if (!isValid) return
    await updateSense(sense.id, {
      chineseMeaning: draft.chineseMeaning.trim(),
      exampleSentence: draft.exampleSentence.trim(),
      exampleSentenceTranslation: draft.exampleSentenceTranslation.trim(),
      note: draft.note.trim(),
    })
    onDone()
  }

  return (
    <div className="space-y-2 rounded-xl bg-surface p-2.5">
      <LabeledInput
        id={`summary-sense-meaning-${sense.id}`}
        label="詞義"
        required
        placeholder="必填"
        value={draft.chineseMeaning}
        onChange={(value) => onDraftChange({ chineseMeaning: value })}
      />
      <LabeledInput
        id={`summary-sense-example-${sense.id}`}
        label="例句"
        required
        placeholder="必填"
        value={draft.exampleSentence}
        onChange={(value) => onDraftChange({ exampleSentence: value })}
      />
      <LabeledInput
        id={`summary-sense-example-translation-${sense.id}`}
        label="例句翻譯"
        required
        placeholder="必填"
        value={draft.exampleSentenceTranslation}
        onChange={(value) => onDraftChange({ exampleSentenceTranslation: value })}
      />
      <LabeledInput
        id={`summary-sense-note-${sense.id}`}
        label="備註"
        placeholder="選填"
        value={draft.note}
        onChange={(value) => onDraftChange({ note: value })}
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onDone}
          className="min-h-[36px] rounded-full px-3 text-sm font-semibold text-ink-soft hover:bg-paper-deep"
        >
          取消
        </button>
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={!isValid}
          className="min-h-[36px] rounded-full bg-accent px-4 text-sm font-semibold text-paper hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          儲存
        </button>
      </div>
    </div>
  )
}

export default AiConversationFeed
