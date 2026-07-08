// Dev-only on-screen control for loading/clearing fake data. Exists because
// devtools console access (window.lexicardDevSeed) isn't practical when
// testing on iPad Safari. Rendered in-flow (not as a fixed overlay) so it
// can't end up hidden or overlapped by the bottom nav bar. Not rendered in
// production builds.
import { useState } from 'react'
import { seedDevData, clearAllData } from '../lib/devSeed'

const VISIBILITY_STORAGE_KEY = 'lexicard-dev-panel-visible'

function readStoredVisibility(): boolean {
  try {
    return localStorage.getItem(VISIBILITY_STORAGE_KEY) !== 'false'
  } catch {
    return true
  }
}

function DevSeedPanel() {
  const [isVisible, setIsVisible] = useState(readStoredVisibility)
  const [isBusy, setIsBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  function toggleVisible() {
    setIsVisible((current) => {
      const next = !current
      try {
        localStorage.setItem(VISIBILITY_STORAGE_KEY, String(next))
      } catch {
        // ignore storage failures (e.g. private mode) — toggle still works for this session
      }
      return next
    })
  }

  async function handleSeed() {
    setIsBusy(true)
    setIsError(false)
    setMessage(null)
    try {
      await seedDevData()
      setMessage('已灌入測試資料')
    } catch (error) {
      setIsError(true)
      setMessage(error instanceof Error ? error.message : String(error))
    } finally {
      setIsBusy(false)
    }
  }

  async function handleClear() {
    setIsBusy(true)
    setIsError(false)
    setMessage(null)
    try {
      await clearAllData()
      setMessage('已清空資料')
    } catch (error) {
      setIsError(true)
      setMessage(error instanceof Error ? error.message : String(error))
    } finally {
      setIsBusy(false)
    }
  }

  if (!isVisible) {
    return (
      <button
        type="button"
        onClick={toggleVisible}
        className="fixed top-2 right-2 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-xs font-semibold text-white shadow-md"
        aria-label="顯示 Dev 工具"
      >
        Dev
      </button>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
      <span className="font-medium">Dev 工具</span>
      <button
        type="button"
        onClick={handleSeed}
        disabled={isBusy}
        className="rounded-full bg-amber-600 px-3 py-1.5 text-white disabled:opacity-50"
      >
        {isBusy ? '處理中…' : '灌入測試資料'}
      </button>
      <button
        type="button"
        onClick={handleClear}
        disabled={isBusy}
        className="rounded-full border border-amber-600 px-3 py-1.5 text-amber-700 disabled:opacity-50"
      >
        清空資料
      </button>
      {message && (
        <span className={isError ? 'font-medium text-red-600' : 'text-amber-800'}>
          {isError ? `錯誤：${message}` : message}
        </span>
      )}
      <button
        type="button"
        onClick={toggleVisible}
        className="ml-auto rounded-full px-2 py-1 text-amber-700 hover:bg-amber-100"
        aria-label="隱藏 Dev 工具"
      >
        隱藏 ✕
      </button>
    </div>
  )
}

export default DevSeedPanel
