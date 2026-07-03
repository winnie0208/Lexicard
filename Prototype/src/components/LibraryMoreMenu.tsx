import { useState } from 'react'

// Shell only for Phase 2 — CSV export wiring lands in Phase 8.
function LibraryMoreMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="更多選單"
        className="rounded-full px-2 py-1 text-xl leading-none text-gray-500 hover:bg-gray-100"
      >
        ⋯
      </button>
      {isOpen && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setIsOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 z-20 mt-2 w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              disabled
              title="CSV 匯出功能將於後續版本提供"
              className="w-full cursor-not-allowed px-4 py-2 text-left text-sm text-gray-400"
            >
              匯出 CSV
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default LibraryMoreMenu
