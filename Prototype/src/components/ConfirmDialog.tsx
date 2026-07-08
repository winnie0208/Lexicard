import type { ReactNode } from 'react'

interface ConfirmDialogProps {
  title: string
  description?: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  children?: ReactNode
}

// Self-designed confirm modal (not the native window.confirm) so destructive
// actions can show richer context — e.g. which other cards are affected —
// before the user commits.
function ConfirmDialog({
  title,
  description,
  confirmLabel = '刪除',
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-5"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-card bg-surface p-5 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
        {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
        {children}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[44px] rounded-full px-4 text-sm font-semibold text-ink-soft hover:bg-paper-deep"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-[44px] rounded-full bg-accent px-5 text-sm font-semibold text-paper hover:bg-accent/90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
