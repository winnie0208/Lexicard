import type { ConversationMessage } from '../components/AiConversationFeed'
import type { SenseEditDraft } from '../types/sense'

// In-memory session store for the 新增單字頁 AI 討論 state, lifted out of
// AddWordPage so navigating to other pages and back keeps the conversation
// and drafts. Survives route changes only — a page reload clears it, which
// matches the「AI 對話只保留於目前 session，不保存完整歷史」decision.
// Consumed via useSyncExternalStore in AddWordPage.

// 輸入含詞性但該單字沒有此詞性時，等待使用者確認「繼續建立新詞性字卡」或
// 「改用既有詞性」的暫存內容（PRD 3.2 既有單字判斷）；stash 住已解析出的
// 中文與例句，確認後帶入對應流程。
export interface PendingPosConfirm {
  word: string
  partOfSpeech: string
  chineseMeaning: string
  exampleSentence: string
  exampleSentenceTranslation: string
}

export interface AddWordSessionState {
  messages: ConversationMessage[]
  word: string
  selectedPartOfSpeech: string
  chineseMeaning: string
  exampleSentence: string
  exampleSentenceTranslation: string
  note: string
  phonetic: string
  pendingPosConfirm: PendingPosConfirm | null
  // Open inline sense edits in the feed's summary cards, keyed by senseId —
  // an entry's presence means that form is open; kept here so an in-progress
  // edit survives route changes just like the conversation itself.
  senseEditDrafts: Record<string, SenseEditDraft>
  inputDraft: string
  inputMode: 'handwriting' | 'text'
  inputPaneWidth: number
}

const initialState: AddWordSessionState = {
  messages: [],
  word: '',
  selectedPartOfSpeech: '',
  chineseMeaning: '',
  exampleSentence: '',
  exampleSentenceTranslation: '',
  note: '',
  phonetic: '',
  pendingPosConfirm: null,
  senseEditDrafts: {},
  inputDraft: '',
  inputMode: 'handwriting',
  // Matches AddWordPage's previous DEFAULT_INPUT_PANE_WIDTH; the drag bounds
  // (MIN_INPUT_PANE_WIDTH / MIN_FEED_WIDTH) still live in AddWordPage.
  inputPaneWidth: 288,
}

let state = initialState
const listeners = new Set<() => void>()

export function getAddWordSessionState(): AddWordSessionState {
  return state
}

export function subscribeAddWordSession(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function updateAddWordSession(
  patch:
    | Partial<AddWordSessionState>
    | ((prev: AddWordSessionState) => Partial<AddWordSessionState>),
): void {
  const resolved = typeof patch === 'function' ? patch(state) : patch
  state = { ...state, ...resolved }
  listeners.forEach((listener) => listener())
}
