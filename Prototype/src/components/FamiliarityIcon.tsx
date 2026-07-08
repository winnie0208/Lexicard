import {
  FAMILIARITY_LEVEL_BOOK_COUNT,
  FAMILIARITY_LEVEL_LABEL,
  getFamiliarityLevel,
} from '../lib/familiarity'
import { SnowflakeIcon } from './icons'

interface FamiliarityIconProps {
  score: number
  showLabel?: boolean
}

function FamiliarityIcon({ score, showLabel = false }: FamiliarityIconProps) {
  const level = getFamiliarityLevel(score)
  const count = FAMILIARITY_LEVEL_BOOK_COUNT[level]
  const label = FAMILIARITY_LEVEL_LABEL[level]

  return (
    <span
      className="flex items-center gap-1.5"
      title={`熟悉度：${label}`}
      aria-label={`熟悉度：${label}`}
    >
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((slot) => (
          <SnowflakeIcon
            key={slot}
            className={`h-2 w-2 ${slot <= count ? 'text-accent' : 'text-rule'}`}
          />
        ))}
      </span>
      {showLabel && (
        <span aria-hidden="true" className="font-mono text-xs text-ink-soft">
          {label}
        </span>
      )}
    </span>
  )
}

export default FamiliarityIcon
