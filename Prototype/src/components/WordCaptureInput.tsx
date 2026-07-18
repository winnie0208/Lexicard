import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { BookIcon, SendIcon, SettingsIcon } from './icons'

type InputMode = 'handwriting' | 'text'

interface WordCaptureInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (text: string) => void
  mode: InputMode
  onModeChange: (mode: InputMode) => void
  isHandwritingAllowed: boolean
  onOpenWordList: () => void
}

// Settings button + popover, positioned via a portal (see CardActionsMenu.tsx
// for the same pattern/rationale) since this control sits at the very bottom
// of the input block — opening the panel upward keeps it from being clipped
// by the viewport edge or the bottom nav bar.
function InputSettingsButton({
  mode,
  onModeChange,
  isHandwritingAllowed,
}: Pick<WordCaptureInputProps, 'mode' | 'onModeChange' | 'isHandwritingAllowed'>) {
  const [isOpen, setIsOpen] = useState(false)
  const [panelPosition, setPanelPosition] = useState({ bottom: 0, right: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  function openPanel() {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      setPanelPosition({
        bottom: window.innerHeight - rect.top + 8,
        right: window.innerWidth - rect.right,
      })
    }
    setIsOpen(true)
  }

  useEffect(() => {
    if (!isOpen) return
    function handleScroll() {
      setIsOpen(false)
    }
    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [isOpen])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (isOpen ? setIsOpen(false) : openPanel())}
        aria-label="輸入設定"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper-deep text-ink-soft hover:bg-stone-200"
      >
        <SettingsIcon className="h-5 w-5" />
      </button>
      {isOpen &&
        createPortal(
          <>
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setIsOpen(false)}
            />
            <div
              role="menu"
              style={{ bottom: panelPosition.bottom, right: panelPosition.right }}
              className="fixed z-50 w-48 space-y-2 rounded-2xl border border-rule bg-surface p-3 shadow-lg"
            >
              <p className="text-xs font-medium tracking-wide text-ink-soft">輸入模式</p>
              <div className="flex items-center gap-1 rounded-full bg-paper-deep p-1">
                <button
                  type="button"
                  onClick={() => onModeChange('handwriting')}
                  disabled={!isHandwritingAllowed}
                  aria-pressed={mode === 'handwriting'}
                  className={`min-h-[36px] flex-1 rounded-full px-3 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    mode === 'handwriting' ? 'bg-accent text-paper' : 'text-ink-soft'
                  }`}
                >
                  手寫
                </button>
                <button
                  type="button"
                  onClick={() => onModeChange('text')}
                  aria-pressed={mode === 'text'}
                  className={`min-h-[36px] flex-1 rounded-full px-3 text-xs font-semibold transition-colors ${
                    mode === 'text' ? 'bg-accent text-paper' : 'text-ink-soft'
                  }`}
                >
                  文字
                </button>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  )
}

// Shared markup for both modes — only the textarea's size/placeholder depend
// on `mode`, so switching modes restyles the same elements instead of
// mounting a different subtree. The card border/background live on the
// shared wrapper in AddWordPage that also holds AiConversationFeed.
function WordCaptureInput({
  value,
  onChange,
  onSubmit,
  mode,
  onModeChange,
  isHandwritingAllowed,
  onOpenWordList,
}: WordCaptureInputProps) {
  const isHandwriting = mode === 'handwriting'
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // iPadOS quirk: once a text field has received Apple Pencil (Scribble)
  // input, WebKit keeps that specific DOM node biased toward the reduced
  // Scribble toolbar instead of the full keyboard — even after the value is
  // cleared. Only recreating the DOM node (or reloading the page) resets it.
  // We fake the former: after the pencil lifts and the field blurs, bump a
  // key to force React to mount a fresh <textarea>, so the next finger tap
  // gets the normal keyboard again. Mid-stroke focus is left untouched.
  const [textareaInstanceKey, setTextareaInstanceKey] = useState(0)
  const lastPointerTypeRef = useRef<string | null>(null)

  function handleTextareaPointerDown(event: ReactPointerEvent<HTMLTextAreaElement>) {
    lastPointerTypeRef.current = event.pointerType
  }

  function handleTextareaBlur() {
    if (lastPointerTypeRef.current === 'pen') {
      setTextareaInstanceKey((key) => key + 1)
    }
    lastPointerTypeRef.current = null
  }

  useLayoutEffect(() => {
    if (isHandwriting) return
    const input = textareaRef.current
    if (!input) return

    input.style.height = 'auto'
    const maxHeight = Number.parseFloat(window.getComputedStyle(input).maxHeight)
    const nextHeight = Number.isNaN(maxHeight)
      ? input.scrollHeight
      : Math.min(input.scrollHeight, maxHeight)

    input.style.height = `${nextHeight}px`
    input.style.overflowY = input.scrollHeight > nextHeight ? 'auto' : 'hidden'
  }, [isHandwriting, value, textareaInstanceKey])

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    onChange('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col gap-2">
      <textarea
        key={textareaInstanceKey}
        ref={textareaRef}
        rows={isHandwriting ? undefined : 1}
        inputMode="text"
        aria-label={isHandwriting ? '手寫或輸入單字' : '與 AI 討論或輸入單字'}
        placeholder="記錄新單字或是開始與AI討論…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onPointerDown={handleTextareaPointerDown}
        onBlur={handleTextareaBlur}
        onKeyDown={handleKeyDown}
        className={`scrollbar-subtle w-full min-w-0 resize-none border border-rule bg-stone-100 text-base leading-6 tracking-wide text-ink placeholder:text-ink-soft/50 focus:border-accent focus:outline-none ${
          isHandwriting
            ? 'flex-1 rounded-2xl px-4 py-2.5'
            : 'max-h-[calc(1.5rem*3+1.25rem)] min-h-[46px] rounded-[23px] px-4 py-2.5'
        }`}
      />
      <div className="flex shrink-0 items-center justify-end gap-2">
        <button
          type="button"
          onClick={onOpenWordList}
          aria-label="開啟單字列表"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper-deep text-ink-soft hover:bg-stone-200 sm:hidden"
        >
          <BookIcon className="h-5 w-5" />
        </button>
        <InputSettingsButton
          mode={mode}
          onModeChange={onModeChange}
          isHandwritingAllowed={isHandwritingAllowed}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={value.trim().length === 0}
          aria-label="送出"
          className="flex h-11 w-[88px] shrink-0 items-center justify-center rounded-full bg-accent text-paper hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent"
        >
          <SendIcon className="h-5 w-5" />
        </button>
      </div>
    </section>
  )
}

export default WordCaptureInput
