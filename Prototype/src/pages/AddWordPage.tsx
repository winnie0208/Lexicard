import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import AiConversationFeed, { type ConversationMessage } from '../components/AiConversationFeed'
import ConfirmDialog from '../components/ConfirmDialog'
import WordCaptureInput from '../components/WordCaptureInput'
import WordListPanel from '../components/WordListPanel'
import { CloseIcon } from '../components/icons'
import { useCardLibrary } from '../hooks/useCardLibrary'
import { useMediaQuery } from '../hooks/useMediaQuery'
import {
  createCard,
  findCardsByNormalizedWord,
  updateCard,
} from '../lib/repositories/cardRepository'
import { createSense, getSensesByCardId } from '../lib/repositories/senseRepository'
import { normalizeWord } from '../lib/normalizeWord'
import { parseFreeformWordInput } from '../lib/parseFreeformWordInput'
import { FAMILIARITY_SCORE_DELTA, clampFamiliarityScore } from '../lib/familiarity'
import {
  CLEAR_COMPLEX_CONVERSATION_DEMO_EVENT,
  LOAD_COMPLEX_CONVERSATION_DEMO_EVENT,
} from '../lib/devEvents'
import {
  getAddWordSessionState,
  subscribeAddWordSession,
  updateAddWordSession,
  type PendingPosConfirm,
} from '../lib/addWordSessionStore'
import type { Card } from '../types/card'
import type { SenseEditDraft } from '../types/sense'

const FIELD_LABELS: Record<string, string> = {
  word: '單字',
  partOfSpeech: '詞性',
  chineseMeaning: '詞義',
  exampleSentence: '例句',
  exampleSentenceTranslation: '例句翻譯',
}

// Dev-only demo data covering the busiest realistic AI 討論 state at once: an
// existing multi-sense word as the current discussion topic, a long
// back-and-forth with both matched and unmatched rule-based replies, and a
// dirty new-sense draft — so the scroll/layout can be checked under
// worst-case content instead of the empty state.
const DEMO_WORD = 'set'
const DEMO_PART_OF_SPEECH = 'n.'

// Bounds for the user-draggable split between AI 對話 and the 輸入 pane
// (handwriting mode only — text mode stacks them vertically with the input
// sized to its content, so there's no width to negotiate there); the default
// width lives with the rest of the session state in addWordSessionStore.
const MIN_INPUT_PANE_WIDTH = 220
const MIN_FEED_WIDTH = 240

const DEMO_MESSAGES: ConversationMessage[] = [
  { role: 'user', text: 'set' },
  { role: 'ai', text: '已依規則式判斷幫你填入：單字。請到下面的字卡預覽確認或補充其他欄位。' },
  { role: 'user', text: 'n. 一套、一組' },
  { role: 'ai', text: '已依規則式判斷幫你填入：詞義。請到下面的字卡預覽確認或補充其他欄位。' },
  { role: 'user', text: 'Please set the book on the table. 請把書放在桌上。' },
  {
    role: 'ai',
    text: '已依規則式判斷幫你填入：例句、例句翻譯。請到下面的字卡預覽確認或補充其他欄位。',
  },
  {
    role: 'user',
    text: '那 set、put、place 這三個字在「放置」的意思上到底有什麼差別？我常常搞混，尤其是寫作文的時候不知道該用哪一個，可以幫我整理一下嗎？最好附上例句對照。',
  },
  {
    role: 'ai',
    text: '簡單來說：put 是最general的「放」，幾乎任何情境都能用；set 通常強調「放置後調整到特定狀態或位置」，例如 set the table（擺好餐桌）、set an alarm（設定鬧鐘）；place 則語氣較正式，強調「小心地放在特定位置」，例如 place the vase on the shelf（把花瓶放在架上）。你可以先從例句練習，之後我們可以針對每個字各建立一張字卡方便比較。',
  },
  { role: 'user', text: '謝謝，那可以順便看一下我之前建立的 set 名詞卡片內容嗎？' },
  {
    role: 'ai',
    text: '目前規則式判斷不出這段內容要放進哪個欄位，你可以直接到下面的字卡預覽手動填寫。',
  },
]

function AddWordPage() {
  const { cards, sensesByCardId } = useCardLibrary()

  // 討論狀態（對話訊息、目前討論字、sense 草稿、輸入區偏好）存於模組層
  // session store，路由切換不清空、重新整理才重置（LOG-20260717-02 方案 A）。
  // Setter helpers keep the previous useState call sites unchanged.
  const session = useSyncExternalStore(subscribeAddWordSession, getAddWordSessionState)
  const {
    messages,
    word,
    selectedPartOfSpeech,
    chineseMeaning,
    exampleSentence,
    exampleSentenceTranslation,
    note,
    // Card-level phonetic draft for brand-new cards only — existing cards
    // keep their phonetic (PRD: 詞性、音標由建立時決定，詳情頁不可編輯), so
    // the preview hides this field once the word resolves to an existing card.
    phonetic,
    pendingPosConfirm,
    senseEditDrafts,
    inputDraft,
    inputMode,
    inputPaneWidth,
  } = session

  const setWord = (value: string) => updateAddWordSession({ word: value })
  const setSelectedPartOfSpeech = (value: string) =>
    updateAddWordSession({ selectedPartOfSpeech: value })
  const setChineseMeaning = (value: string) => updateAddWordSession({ chineseMeaning: value })
  const setExampleSentence = (value: string) => updateAddWordSession({ exampleSentence: value })
  const setExampleSentenceTranslation = (value: string) =>
    updateAddWordSession({ exampleSentenceTranslation: value })
  const setNote = (value: string) => updateAddWordSession({ note: value })
  const setPhonetic = (value: string) => updateAddWordSession({ phonetic: value })
  const setPendingPosConfirm = (value: PendingPosConfirm | null) =>
    updateAddWordSession({ pendingPosConfirm: value })
  const setMessages = (
    next: ConversationMessage[] | ((prev: ConversationMessage[]) => ConversationMessage[]),
  ) =>
    updateAddWordSession((prev) => ({
      messages: typeof next === 'function' ? next(prev.messages) : next,
    }))
  const setSenseEditDrafts = (value: Record<string, SenseEditDraft>) =>
    updateAddWordSession({ senseEditDrafts: value })
  const setInputDraft = (value: string) => updateAddWordSession({ inputDraft: value })
  const setInputMode = (value: 'handwriting' | 'text') => updateAddWordSession({ inputMode: value })
  const setInputPaneWidth = (value: number) => updateAddWordSession({ inputPaneWidth: value })

  // Card waiting for the user to confirm discarding a dirty sense draft
  // before it becomes the new discussion topic (PRD 3.2 既有字卡帶入討論).
  const [pendingDiscussCard, setPendingDiscussCard] = useState<Card | null>(null)

  // Open inline sense edits in the feed's summary cards (from the session
  // store) — in-progress edits count as unsaved work for the switch
  // confirmation, same as a dirty preview draft.
  const hasOpenSenseEdits = Object.keys(senseEditDrafts).length > 0

  const [isWordListOpen, setIsWordListOpen] = useState(false)
  const isHandwritingAllowed = useMediaQuery('(min-width: 640px)')

  const [isResizingInputPane, setIsResizingInputPane] = useState(false)
  const mergedCardRef = useRef<HTMLDivElement>(null)
  const resizeStartRef = useRef<{ pointerX: number; startWidth: number } | null>(null)
  // Below the breakpoint, handwriting is forced to text regardless of the
  // user's last explicit choice — derived here instead of force-corrected
  // via an effect, so widening back past the breakpoint restores whichever
  // mode the user had picked before.
  const effectiveInputMode = isHandwritingAllowed ? inputMode : 'text'

  // 查詢結果自帶「查的是哪個字」——useLiveQuery 在依賴變更後、新查詢完成前
  // 會回傳上一次的結果，單看 undefined 偵測不到這種過渡狀態；比對字串不符
  // 即視為查詢中，避免預覽卡等 UI 用舊資料判斷而閃現。
  const existingCardsQuery = useLiveQuery(async () => {
    const trimmedWord = word.trim()
    if (!trimmedWord) return { queriedWord: '', cards: [] as Card[] }
    return { queriedWord: trimmedWord, cards: await findCardsByNormalizedWord(trimmedWord) }
  }, [word])

  const isCardLookupPending =
    existingCardsQuery === undefined || existingCardsQuery.queriedWord !== word.trim()

  const existingCardsForWord = isCardLookupPending ? [] : existingCardsQuery.cards

  const partOfSpeechOptions = existingCardsForWord
    .map((card) => card.partOfSpeech.trim())
    .filter(
      (partOfSpeech, index, options) => partOfSpeech && options.indexOf(partOfSpeech) === index,
    )

  const resolvedPartOfSpeech =
    selectedPartOfSpeech || (partOfSpeechOptions.length === 1 ? partOfSpeechOptions[0] : '')

  const needsPartOfSpeechChoice = partOfSpeechOptions.length > 1 && !resolvedPartOfSpeech

  // 詞性選擇氣泡中標示「意思相符」的詞性：草稿中文與該詞性卡的某個語意
  // 完全相同（暫時方案；Phase 4 由 AI 判斷相近語意）。
  const trimmedDraftMeaning = chineseMeaning.trim()
  const matchedPartOfSpeechOptions = trimmedDraftMeaning
    ? existingCardsForWord
        .filter((card) =>
          (sensesByCardId.get(card.id) ?? []).some(
            (sense) => sense.chineseMeaning.trim() === trimmedDraftMeaning,
          ),
        )
        .map((card) => card.partOfSpeech.trim())
    : []

  // 「建立新詞性字卡」確認氣泡中可改選的既有詞性。
  const pendingPosExistingOptions = pendingPosConfirm
    ? cards
        .filter((card) => card.normalizedWord === normalizeWord(pendingPosConfirm.word))
        .map((card) => card.partOfSpeech.trim())
        .filter(
          (partOfSpeech, index, options) => partOfSpeech && options.indexOf(partOfSpeech) === index,
        )
    : []

  // The existing card matching the word currently being discussed, if any —
  // drives both the create-flow phonetic default and the "目前討論" header's
  // existing-sense summary, so dragging in an existing card or typing a
  // word that already exists both resolve through the same place.
  const currentDiscussionCard =
    existingCardsForWord.find(
      (card) =>
        resolvedPartOfSpeech &&
        card.partOfSpeech.trim().toLowerCase() === resolvedPartOfSpeech.toLowerCase(),
    ) ??
    // Fall back to the single existing card only when no explicit PoS is in
    // play — an explicitly different PoS means a brand-new card is being
    // built (一卡一詞性), so the existing card must not hijack the flow.
    (existingCardsForWord.length === 1 && !resolvedPartOfSpeech
      ? existingCardsForWord[0]
      : undefined)

  const resolvedPhonetic = currentDiscussionCard?.phonetic ?? ''

  // 除備註外，預覽卡所有欄位皆為必填（PRD 3.2 AI 生成預覽）。音標只在
  // 建立全新卡時要求——既有卡的音標由建立時決定，欄位也不顯示。
  const isRequiredFilled =
    word.trim().length > 0 &&
    !isCardLookupPending &&
    !needsPartOfSpeechChoice &&
    resolvedPartOfSpeech.trim().length > 0 &&
    (currentDiscussionCard !== undefined || phonetic.trim().length > 0) &&
    chineseMeaning.trim().length > 0 &&
    exampleSentence.trim().length > 0 &&
    exampleSentenceTranslation.trim().length > 0

  const cardsById = new Map(cards.map((card) => [card.id, card]))

  const isSenseDraftDirty =
    chineseMeaning.trim().length > 0 ||
    exampleSentence.trim().length > 0 ||
    exampleSentenceTranslation.trim().length > 0 ||
    note.trim().length > 0 ||
    phonetic.trim().length > 0

  // Discussing an existing card with a clean draft shows only the read-only
  // summary in the feed; the editable preview appears for new words or once
  // a new-sense draft has content (PRD 3.2 既有字卡帶入討論). A dirty draft
  // with an empty word still shows the preview — otherwise a rule-based
  // mis-classification (e.g. filling 例句 only) leaves invisible dirty state
  // the user can neither see nor clear. While a PoS choice or new-PoS
  // confirmation is pending, the form stays hidden — the discussion target
  // isn't settled yet, so showing editable card fields would be premature.
  const showCardPreview =
    (word.trim().length > 0 || isSenseDraftDirty) &&
    (!currentDiscussionCard || isSenseDraftDirty) &&
    !isCardLookupPending &&
    !needsPartOfSpeechChoice &&
    !pendingPosConfirm

  async function handleCaptureSubmit(text: string) {
    const parsed = parseFreeformWordInput(text)
    // 新輸入取代尚未回應的「建立新詞性字卡」確認。
    if (pendingPosConfirm) setPendingPosConfirm(null)

    // 尚無目前討論字且輸入含單字時，先查該單字是否已存在——存在則走
    // 線索收斂流程（PRD 3.2 既有單字判斷），不存在才走新字卡填欄位流程。
    if (parsed.word && !word.trim()) {
      const candidates = await findCardsByNormalizedWord(parsed.word)
      if (candidates.length > 0) {
        await resolveExistingWordInput(text, parsed, candidates)
        return
      }
    }

    const filledFields: string[] = []

    if (parsed.word && !word.trim()) {
      setWord(parsed.word)
      setSelectedPartOfSpeech(parsed.partOfSpeech ?? '')
      filledFields.push(FIELD_LABELS.word)
      if (parsed.partOfSpeech) filledFields.push(FIELD_LABELS.partOfSpeech)
    }
    if (parsed.chineseMeaning && !chineseMeaning.trim()) {
      setChineseMeaning(parsed.chineseMeaning)
      filledFields.push(FIELD_LABELS.chineseMeaning)
    }
    if (parsed.exampleSentence && !exampleSentence.trim()) {
      setExampleSentence(parsed.exampleSentence)
      filledFields.push(FIELD_LABELS.exampleSentence)
    }
    if (parsed.exampleSentenceTranslation && !exampleSentenceTranslation.trim()) {
      setExampleSentenceTranslation(parsed.exampleSentenceTranslation)
      filledFields.push(FIELD_LABELS.exampleSentenceTranslation)
    }

    const aiReply =
      filledFields.length > 0
        ? `已依規則式判斷幫你填入：${filledFields.join('、')}。請到下面的字卡預覽確認或補充其他欄位。`
        : '目前規則式判斷不出這段內容要放進哪個欄位，你可以直接到下面的字卡預覽手動填寫。'

    setMessages((prev) => [...prev, { role: 'user', text }, { role: 'ai', text: aiReply }])
  }

  // 輸入的單字已存在時的線索收斂：依「詞性線索 → 中文線索」自動判定要討論
  // 哪張卡，只在收斂不了時才引導使用者選擇（PRD 3.2 既有單字判斷）。中文
  // 語意比對目前為字串完全相同（暫時方案）；Phase 4 改由 AI 判斷相近語意。
  async function resolveExistingWordInput(
    text: string,
    parsed: ReturnType<typeof parseFreeformWordInput>,
    candidates: Card[],
  ) {
    const meaning = parsed.chineseMeaning?.trim() ?? ''
    const posInput = parsed.partOfSpeech?.trim() ?? ''
    const appendUserMessage = () => setMessages((prev) => [...prev, { role: 'user', text }])

    if (posInput) {
      const cardWithPos = candidates.find(
        (card) => card.partOfSpeech.trim().toLowerCase() === posInput.toLowerCase(),
      )
      if (cardWithPos) {
        appendUserMessage()
        await resolveExistingCardTopic(cardWithPos, parsed)
        return
      }
      // 該單字沒有此詞性 → 對話流引導確認後才建立新詞性字卡。
      appendUserMessage()
      setPendingPosConfirm({
        word: candidates[0].word,
        partOfSpeech: posInput,
        chineseMeaning: meaning,
        exampleSentence: parsed.exampleSentence ?? '',
        exampleSentenceTranslation: parsed.exampleSentenceTranslation ?? '',
      })
      return
    }

    if (candidates.length === 1) {
      appendUserMessage()
      await resolveExistingCardTopic(candidates[0], parsed)
      return
    }

    // 多詞性：先用中文線索收斂——恰好命中一張卡就直接採用該詞性。語意直接
    // 查資料庫，不用 render 快取，避免頁面剛載入就輸入時比對到空資料。
    if (meaning) {
      const senseLists = await Promise.all(candidates.map((card) => getSensesByCardId(card.id)))
      const hits = candidates.filter((_candidate, index) =>
        senseLists[index].some((sense) => sense.chineseMeaning.trim() === meaning),
      )
      if (hits.length === 1) {
        appendUserMessage()
        await resolveExistingCardTopic(hits[0], parsed)
        return
      }
    }

    // 收斂不了：設定單字與草稿後顯示詞性選擇氣泡（命中的詞性會標示
    // 「意思相符」），選定後由 handleSelectPartOfSpeech 接續分支。
    setWord(candidates[0].word)
    setSelectedPartOfSpeech('')
    if (meaning) setChineseMeaning(meaning)
    if (parsed.exampleSentence) setExampleSentence(parsed.exampleSentence)
    if (parsed.exampleSentenceTranslation) {
      setExampleSentenceTranslation(parsed.exampleSentenceTranslation)
    }
    setMessages((prev) => [
      ...prev,
      { role: 'user', text },
      {
        role: 'ai',
        text: `「${candidates[0].word}」有多個詞性，先在下方選一個要討論的詞性吧。`,
      },
    ])
  }

  // 詞性確定後的中文分支：無中文 → 唯讀摘要卡＋開場；中文已存在 → 唯讀摘要
  // 卡強調該語意＋背景熟悉度紀錄（不通知）；中文為新 → 唯讀摘要卡＋新增語意
  // 表單（PRD 3.2 重複判斷）。
  async function resolveExistingCardTopic(
    card: Card,
    input?: {
      chineseMeaning?: string
      exampleSentence?: string
      exampleSentenceTranslation?: string
    },
  ) {
    setWord(card.word)
    setSelectedPartOfSpeech(card.partOfSpeech)
    const cardLabel = card.partOfSpeech
      ? `「${card.word}」（${card.partOfSpeech}）`
      : `「${card.word}」`
    const meaning = input?.chineseMeaning?.trim() ?? ''
    // 直接查資料庫，不依賴 render 快取（同上，避免載入初期的 race）。
    const senses = await getSensesByCardId(card.id)

    if (!meaning) {
      clearSenseDraft()
      const senseText = senses.length > 0 ? `目前有 ${senses.length} 個詞義` : '目前還沒有詞義'
      setMessages((prev) => [
        ...prev,
        { role: 'ai-card-summary', cardId: card.id },
        {
          role: 'ai',
          text: `我們來討論「${card.word}」吧！這張字卡${senseText}。可以新增新的語境、討論易混淆字，或練習用法，想從哪裡開始？`,
        },
      ])
      return
    }

    const matchedSense = senses.find((sense) => sense.chineseMeaning.trim() === meaning)
    if (matchedSense) {
      clearSenseDraft()
      // 重複輸入已存在的語意：背景熟悉度紀錄（PRD 重複判斷），訊息不提及扣分。
      await updateCard(card.id, {
        repeatCount: card.repeatCount + 1,
        familiarityScore: clampFamiliarityScore(
          card.familiarityScore + FAMILIARITY_SCORE_DELTA.duplicateExistingSense,
        ),
      })
      setMessages((prev) => [
        ...prev,
        { role: 'ai-card-summary', cardId: card.id, highlightSenseId: matchedSense.id },
        {
          role: 'ai',
          text: `${cardLabel}已經有「${meaning}」這個意思了，已在上方卡片幫你標示出來，可以複習一下或繼續討論。`,
        },
      ])
      return
    }

    // 新語意：摘要卡後直接接「新增語意」表單，不另發引導訊息（使用者回饋）。
    setChineseMeaning(meaning)
    setExampleSentence(input?.exampleSentence ?? '')
    setExampleSentenceTranslation(input?.exampleSentenceTranslation ?? '')
    setNote('')
    setPhonetic('')
    setMessages((prev) => [...prev, { role: 'ai-card-summary', cardId: card.id }])
  }

  // 詞性選擇氣泡選定後的接續：該詞性對應既有卡 → 進入中文分支；否則僅記錄
  // 選擇（氣泡只列既有詞性，理論上不會走到）。
  function handleSelectPartOfSpeech(partOfSpeech: string) {
    const card = existingCardsForWord.find(
      (candidate) =>
        candidate.partOfSpeech.trim().toLowerCase() === partOfSpeech.trim().toLowerCase(),
    )
    if (card) {
      void resolveExistingCardTopic(card, {
        chineseMeaning,
        exampleSentence,
        exampleSentenceTranslation,
      })
      return
    }
    setSelectedPartOfSpeech(partOfSpeech)
  }

  // 「{單字}沒有{詞性}，是否繼續建立新字卡？」確認氣泡的三個出口。
  function handleConfirmPendingPosCard() {
    if (!pendingPosConfirm) return
    const pending = pendingPosConfirm
    setPendingPosConfirm(null)
    setWord(pending.word)
    setSelectedPartOfSpeech(pending.partOfSpeech)
    setChineseMeaning(pending.chineseMeaning)
    setExampleSentence(pending.exampleSentence)
    setExampleSentenceTranslation(pending.exampleSentenceTranslation)
    setNote('')
    setPhonetic('')
    setMessages((prev) => [
      ...prev,
      {
        role: 'ai',
        text: `好的，幫你準備「${pending.word}」（${pending.partOfSpeech}）的新字卡，請在下方補齊欄位後建立。`,
      },
    ])
  }

  function handlePickExistingPosForPending(partOfSpeech: string) {
    if (!pendingPosConfirm) return
    const pending = pendingPosConfirm
    const card = cards.find(
      (candidate) =>
        candidate.normalizedWord === normalizeWord(pending.word) &&
        candidate.partOfSpeech.trim().toLowerCase() === partOfSpeech.trim().toLowerCase(),
    )
    setPendingPosConfirm(null)
    if (!card) return
    void resolveExistingCardTopic(card, pending)
  }

  function handleCancelPendingPosConfirm() {
    setPendingPosConfirm(null)
  }

  // Loads an existing card as the current discussion topic — dragging a card
  // in or typing a word that already exists both resolve to the same single
  // "目前討論" topic (see currentDiscussionCard above), so this just routes
  // the existing card's word/PoS through the same state the free-text parser
  // writes to. Clears any in-progress sense draft since it belonged to
  // whatever was previously being discussed — a dirty draft asks for
  // confirmation first instead of silently discarding the user's edits.
  function handleDiscussCard(card: Card) {
    setIsWordListOpen(false)
    const isSameTopic = card.word === word.trim() && card.partOfSpeech === resolvedPartOfSpeech
    if ((isSenseDraftDirty || hasOpenSenseEdits) && !isSameTopic) {
      setPendingDiscussCard(card)
      return
    }
    applyDiscussCard(card)
  }

  function applyDiscussCard(card: Card) {
    setWord(card.word)
    setSelectedPartOfSpeech(card.partOfSpeech)
    setChineseMeaning('')
    setExampleSentence('')
    setExampleSentenceTranslation('')
    setNote('')
    setPhonetic('')
    setPendingPosConfirm(null)
    // Read-only summary + a locally templated opening message (no AI call —
    // PRD 3.2 既有字卡帶入討論) so the conversation has a starting point.
    const senseCount = (sensesByCardId.get(card.id) ?? []).length
    const senseText = senseCount > 0 ? `目前有 ${senseCount} 個詞義` : '目前還沒有詞義'
    setMessages((prev) => [
      ...prev,
      { role: 'ai-card-summary', cardId: card.id },
      {
        role: 'ai',
        text: `我們來討論「${card.word}」吧！這張字卡${senseText}。可以新增新的語境、討論易混淆字，或練習用法，想從哪裡開始？`,
      },
    ])
  }

  function handleDropCardId(cardId: string) {
    const card = cards.find((candidate) => candidate.id === cardId)
    if (card) handleDiscussCard(card)
  }

  function clearSenseDraft() {
    setChineseMeaning('')
    setExampleSentence('')
    setExampleSentenceTranslation('')
    setNote('')
    setPhonetic('')
  }

  function handleClearTopic() {
    setWord('')
    setSelectedPartOfSpeech('')
    setPendingPosConfirm(null)
    clearSenseDraft()
  }

  // Drag-to-resize the AI 對話／輸入 split in handwriting mode. Uses pointer
  // capture (not window mousemove listeners) so the divider keeps receiving
  // move/up events even once the pointer leaves it during a fast drag.
  function handleResizePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault()
    resizeStartRef.current = { pointerX: event.clientX, startWidth: inputPaneWidth }
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsResizingInputPane(true)
  }

  function handleResizePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const resizeStart = resizeStartRef.current
    if (!resizeStart) return
    const deltaX = event.clientX - resizeStart.pointerX
    const containerWidth = mergedCardRef.current?.clientWidth ?? 0
    const maxInputPaneWidth = Math.max(MIN_INPUT_PANE_WIDTH, containerWidth - MIN_FEED_WIDTH)
    const nextWidth = Math.min(
      maxInputPaneWidth,
      Math.max(MIN_INPUT_PANE_WIDTH, resizeStart.startWidth - deltaX),
    )
    setInputPaneWidth(nextWidth)
  }

  function handleResizePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    resizeStartRef.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
    setIsResizingInputPane(false)
  }

  // Dev-only: populate the busiest realistic AI 討論 state in one click so
  // the scroll/layout can be checked against worst-case content. Requires
  // the dev seed data (`set` n., 5 senses) to already be loaded.
  function handleLoadComplexDemo() {
    setMessages(DEMO_MESSAGES)
    setWord(DEMO_WORD)
    setSelectedPartOfSpeech(DEMO_PART_OF_SPEECH)
    setChineseMeaning('調整、設定')
    setExampleSentence('Please set the alarm for 7am.')
    setExampleSentenceTranslation('請把鬧鐘設定在早上七點。')
    setNote('與現有「一套、一組」等意思不同，是新的動作類語意。')
  }

  function handleClearDemo() {
    handleClearTopic()
    setMessages([])
    // Clearing the feed unmounts the summary cards, so drop any in-progress
    // inline sense edits with it.
    setSenseEditDrafts({})
  }

  // Triggered from the single global Dev 工具 bar (DevSeedPanel) so this
  // page doesn't need its own separate dev-tool strip.
  useEffect(() => {
    if (!import.meta.env.DEV) return
    window.addEventListener(LOAD_COMPLEX_CONVERSATION_DEMO_EVENT, handleLoadComplexDemo)
    window.addEventListener(CLEAR_COMPLEX_CONVERSATION_DEMO_EVENT, handleClearDemo)
    return () => {
      window.removeEventListener(LOAD_COMPLEX_CONVERSATION_DEMO_EVENT, handleLoadComplexDemo)
      window.removeEventListener(CLEAR_COMPLEX_CONVERSATION_DEMO_EVENT, handleClearDemo)
    }
  })

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!isRequiredFilled) return

    const trimmedWord = word.trim()
    const trimmedPartOfSpeech = resolvedPartOfSpeech.trim()
    const trimmedMeaning = chineseMeaning.trim()

    const candidates = await findCardsByNormalizedWord(trimmedWord)
    const candidatePartOfSpeechOptions = candidates
      .map((card) => card.partOfSpeech.trim())
      .filter(
        (partOfSpeech, index, options) => partOfSpeech && options.indexOf(partOfSpeech) === index,
      )
    if (candidatePartOfSpeechOptions.length > 1 && !trimmedPartOfSpeech) return

    const existingCard = candidates.find(
      (card) => card.partOfSpeech.trim().toLowerCase() === trimmedPartOfSpeech.toLowerCase(),
    )

    // 建卡後停留在本頁，以對話流訊息與唯讀摘要卡回報結果；查看詳情入口
    // 統一放在摘要卡底部。熟悉度增減為背景紀錄，訊息不提及扣分。
    if (!existingCard) {
      const card = await createCard({
        word,
        partOfSpeech: resolvedPartOfSpeech,
        phonetic: phonetic.trim() || resolvedPhonetic,
      })
      await createSense({
        cardId: card.id,
        chineseMeaning,
        exampleSentence,
        exampleSentenceTranslation,
        note,
        isPrimary: true,
      })
      clearSenseDraft()
      // 建卡成功訊息後附上該卡的唯讀摘要卡，讓成果直接留在對話流中
      // （PRD 3.2 建立字卡後行為）。
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `已建立「${trimmedWord}」的單字卡，可以繼續討論或輸入下一個單字。`,
        },
        { role: 'ai-card-summary', cardId: card.id },
      ])
      return
    }

    const existingSenses = await getSensesByCardId(existingCard.id)
    const isCoveredByExistingSense = existingSenses.some(
      (sense) => sense.chineseMeaning.trim() === trimmedMeaning,
    )

    if (isCoveredByExistingSense) {
      await updateCard(existingCard.id, {
        repeatCount: existingCard.repeatCount + 1,
        familiarityScore: clampFamiliarityScore(
          existingCard.familiarityScore + FAMILIARITY_SCORE_DELTA.duplicateExistingSense,
        ),
      })
      clearSenseDraft()
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `「${trimmedWord}」既有的詞義已涵蓋這個意思，這次沒有新增新詞義。`,
        },
      ])
      return
    }

    // 新語意在輸入階段已判定並明示於表單，按下即直接建立，不再二次確認
    // （LOG-20260717-05 使用者定案）。
    await updateCard(existingCard.id, {
      repeatCount: existingCard.repeatCount + 1,
      familiarityScore: clampFamiliarityScore(
        existingCard.familiarityScore + FAMILIARITY_SCORE_DELTA.duplicateNewSense,
      ),
    })
    await createSense({
      cardId: existingCard.id,
      chineseMeaning,
      exampleSentence,
      exampleSentenceTranslation,
      note,
      isPrimary: existingSenses.length === 0,
    })
    clearSenseDraft()
    setMessages((prev) => [
      ...prev,
      {
        role: 'ai',
        text: `已為「${trimmedWord}」新增一個新詞義。`,
      },
    ])
  }

  const isHandwriting = effectiveInputMode === 'handwriting'

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col px-5 pt-4 pb-4 sm:pt-6">
      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="mx-auto flex min-h-0 w-full min-w-0 max-w-[1440px] flex-1 flex-col gap-3 sm:grid sm:grid-cols-[minmax(280px,22%)_minmax(0,1fr)] sm:grid-rows-[minmax(0,1fr)] sm:items-stretch sm:gap-4"
      >
        {isWordListOpen && (
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setIsWordListOpen(false)}
            className="fixed inset-0 z-40 bg-ink/30 sm:hidden"
          />
        )}

        <div
          className={`fixed inset-y-0 left-0 z-50 w-[85%] max-w-[480px] rounded-r-card bg-surface p-3 shadow-xl transition-transform duration-200 sm:static sm:z-auto sm:h-full sm:w-auto sm:max-w-none sm:translate-x-0 sm:rounded-none sm:bg-transparent sm:p-0 sm:shadow-none sm:transition-none ${
            isWordListOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full min-h-0 flex-col gap-2">
            <div className="flex shrink-0 items-center justify-between sm:hidden">
              <p className="font-display text-lg font-semibold text-ink">單字列表</p>
              <button
                type="button"
                onClick={() => setIsWordListOpen(false)}
                aria-label="關閉單字列表"
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:bg-paper-deep"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <WordListPanel
                cards={cards}
                sensesByCardId={sensesByCardId}
                onDiscussCard={handleDiscussCard}
              />
            </div>
          </div>
        </div>

        <div
          ref={mergedCardRef}
          className={`min-h-0 flex-1 rounded-card border border-rule bg-surface p-4 sm:h-full ${
            isHandwriting ? 'flex flex-row' : 'flex flex-col gap-3'
          } ${isResizingInputPane ? 'select-none' : ''}`}
        >
          <div className={`min-h-0 min-w-0 flex-1 ${isHandwriting ? 'mr-1' : ''}`}>
            <AiConversationFeed
              messages={messages}
              currentDiscussionCard={currentDiscussionCard}
              cardsById={cardsById}
              sensesByCardId={sensesByCardId}
              onClearTopic={handleClearTopic}
              onDropCardId={handleDropCardId}
              senseEditDrafts={senseEditDrafts}
              onSenseEditDraftsChange={setSenseEditDrafts}
              showCardPreview={showCardPreview}
              word={word}
              onWordChange={(value) => {
                setWord(value)
                setSelectedPartOfSpeech('')
              }}
              partOfSpeechOptions={partOfSpeechOptions}
              matchedPartOfSpeechOptions={matchedPartOfSpeechOptions}
              resolvedPartOfSpeech={resolvedPartOfSpeech}
              onSelectPartOfSpeech={handleSelectPartOfSpeech}
              onPartOfSpeechChange={setSelectedPartOfSpeech}
              needsPartOfSpeechChoice={needsPartOfSpeechChoice}
              pendingPosConfirm={pendingPosConfirm}
              pendingPosExistingOptions={pendingPosExistingOptions}
              onConfirmPendingPos={handleConfirmPendingPosCard}
              onPickPendingPos={handlePickExistingPosForPending}
              onCancelPendingPos={handleCancelPendingPosConfirm}
              phonetic={phonetic}
              onPhoneticChange={setPhonetic}
              chineseMeaning={chineseMeaning}
              onChineseMeaningChange={setChineseMeaning}
              exampleSentence={exampleSentence}
              onExampleSentenceChange={setExampleSentence}
              exampleSentenceTranslation={exampleSentenceTranslation}
              onExampleSentenceTranslationChange={setExampleSentenceTranslation}
              note={note}
              onNoteChange={setNote}
              isRequiredFilled={isRequiredFilled}
            />
          </div>

          {isHandwriting ? (
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="調整 AI 對話與輸入區塊寬度"
              onPointerDown={handleResizePointerDown}
              onPointerMove={handleResizePointerMove}
              onPointerUp={handleResizePointerUp}
              className="relative w-1.5 shrink-0 cursor-col-resize touch-none self-stretch"
            >
              <div
                className={`absolute inset-y-0 left-0 w-px rounded-full transition-colors ${
                  isResizingInputPane ? 'bg-accent' : 'bg-rule'
                }`}
              />
            </div>
          ) : (
            <div className="h-px shrink-0 bg-rule" />
          )}

          <div
            style={isHandwriting ? { width: inputPaneWidth } : undefined}
            className={isHandwriting ? 'ml-2 flex h-full shrink-0 flex-col' : 'shrink-0'}
          >
            <WordCaptureInput
              value={inputDraft}
              onChange={setInputDraft}
              onSubmit={(text) => void handleCaptureSubmit(text)}
              mode={effectiveInputMode}
              onModeChange={setInputMode}
              isHandwritingAllowed={isHandwritingAllowed}
              onOpenWordList={() => setIsWordListOpen(true)}
            />
          </div>
        </div>
      </form>

      {pendingDiscussCard && (
        <ConfirmDialog
          title={`切換討論單字為「${pendingDiscussCard.word}」？`}
          description={
            isSenseDraftDirty
              ? '目前字卡預覽有尚未儲存的內容，切換後會清空。'
              : '對話流中有尚未儲存的詞義編輯，切換前建議先儲存或取消該編輯。'
          }
          confirmLabel="切換"
          onConfirm={() => {
            applyDiscussCard(pendingDiscussCard)
            setPendingDiscussCard(null)
          }}
          onCancel={() => setPendingDiscussCard(null)}
        />
      )}
    </div>
  )
}

export default AddWordPage
