import type { ReactNode } from 'react'
import { Link } from 'react-router'

interface EmptyStateProps {
  title: ReactNode
  description?: string
  illustrationSrc?: string
  actionTo?: string
  actionLabel?: string
  actionVariant?: 'accent' | 'ink'
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  bordered?: boolean
}

function EmptyState({
  title,
  description,
  illustrationSrc,
  actionTo,
  actionLabel,
  actionVariant = 'accent',
  secondaryAction,
  bordered = true,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center gap-4 rounded-card px-6 py-14 text-center ${
        bordered ? 'border-2 border-dashed border-rule' : ''
      }`}
    >
      {illustrationSrc && (
        <img src={illustrationSrc} alt="" className="h-28 w-auto" aria-hidden="true" />
      )}
      <p className="font-display text-2xl font-semibold text-ink">{title}</p>
      {description && <p className="max-w-xs text-sm text-ink-soft">{description}</p>}
      {(secondaryAction ?? actionTo) && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="flex min-h-[44px] items-center rounded-full px-4 text-sm font-semibold text-ink-soft hover:bg-paper-deep"
            >
              {secondaryAction.label}
            </button>
          )}
          {actionTo && actionLabel && (
            <Link
              to={actionTo}
              className={`flex min-h-[44px] items-center rounded-full px-5 text-sm font-semibold text-paper transition-colors ${
                actionVariant === 'ink' ? 'bg-ink hover:bg-ink/90' : 'bg-accent hover:bg-accent/90'
              }`}
            >
              {actionLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default EmptyState
