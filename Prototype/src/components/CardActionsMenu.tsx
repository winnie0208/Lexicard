import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MoreIcon } from './icons'

interface CardActionsMenuProps {
  onEdit: () => void
  onDelete: () => void
  editLabel?: string
  deleteLabel?: string
}

// Shared "..." menu for sense/relation cards — collapses the previous pair of
// standalone edit/delete icon buttons into one trigger, consistent across
// both card types.
//
// The panel is rendered via a portal into document.body instead of as a
// normal absolutely-positioned child: these cards live inside a horizontally
// scrollable row (overflow-x-auto), and per the CSS overflow spec, setting
// overflow-x to anything other than visible forces overflow-y to stop being
// visible too — so a same-DOM dropdown gets its bottom clipped by the
// scroller. Portaling escapes that ancestor's overflow entirely.
function CardActionsMenu({
  onEdit,
  onDelete,
  editLabel = '編輯',
  deleteLabel = '刪除',
}: CardActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  function openMenu() {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      setMenuPosition({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    }
    setIsOpen(true)
  }

  // The panel's position is computed once, on open. If the underlying
  // scrollable card row moves while it's open, the trigger button moves with
  // it but the portaled panel (fixed to the viewport) won't — close it
  // rather than let it drift out of alignment.
  useEffect(() => {
    if (!isOpen) return
    function handleScroll() {
      setIsOpen(false)
    }
    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [isOpen])

  return (
    <div className="relative -mt-2 -mr-2 shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          if (isOpen) {
            setIsOpen(false)
          } else {
            openMenu()
          }
        }}
        aria-label="更多選項"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:bg-stone-100"
      >
        <MoreIcon className="h-5 w-5" />
      </button>
      {isOpen &&
        createPortal(
          <>
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              className="fixed inset-0 z-40 cursor-default"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                setIsOpen(false)
              }}
            />
            <div
              role="menu"
              style={{ top: menuPosition.top, right: menuPosition.right }}
              className="fixed z-50 w-32 overflow-hidden rounded-2xl border border-rule bg-surface shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  setIsOpen(false)
                  onEdit()
                }}
                className="flex min-h-[44px] w-full items-center px-4 text-left text-sm font-semibold text-ink-soft hover:bg-paper-deep"
              >
                {editLabel}
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  setIsOpen(false)
                  onDelete()
                }}
                className="flex min-h-[44px] w-full items-center px-4 text-left text-sm font-semibold text-ink-soft hover:bg-paper-deep"
              >
                {deleteLabel}
              </button>
            </div>
          </>,
          document.body,
        )}
    </div>
  )
}

export default CardActionsMenu
