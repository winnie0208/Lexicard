import { Link } from 'react-router'

interface EmptyStateProps {
  title: string
  description: string
  actionTo?: string
  actionLabel?: string
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

function EmptyState({
  title,
  description,
  actionTo,
  actionLabel,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="font-medium text-gray-700">{title}</p>
      <p className="max-w-xs text-sm text-gray-500">{description}</p>
      {(secondaryAction ?? actionTo) && (
        <div className="mt-1 flex gap-2">
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              {secondaryAction.label}
            </button>
          )}
          {actionTo && actionLabel && (
            <Link
              to={actionTo}
              className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
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
