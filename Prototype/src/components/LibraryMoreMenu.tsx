import { useEffect, useState } from 'react'
import { ExportIcon } from './icons'

// CSV export logic itself lands in Phase 8 — for now the button surfaces a
// short "coming soon" note instead of hiding behind a placeholder menu item.
function LibraryMoreMenu() {
  const [showNotice, setShowNotice] = useState(false)

  useEffect(() => {
    if (!showNotice) return
    const timer = setTimeout(() => setShowNotice(false), 2200)
    return () => clearTimeout(timer)
  }, [showNotice])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowNotice(true)}
        aria-label="匯出 CSV"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-paper-deep text-ink-soft transition-colors hover:bg-accent-soft hover:text-accent"
      >
        <ExportIcon className="h-5 w-5" />
      </button>
      {showNotice && (
        <div
          role="status"
          className="absolute top-12 right-0 z-20 w-44 rounded-2xl bg-ink px-3 py-2 text-xs text-paper shadow-lg"
        >
          CSV 匯出功能將於後續版本提供
        </div>
      )}
    </div>
  )
}

export default LibraryMoreMenu
