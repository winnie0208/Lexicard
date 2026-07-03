import {
  FAMILIARITY_LEVEL_BOOK_COUNT,
  FAMILIARITY_LEVEL_LABEL,
  getFamiliarityLevel,
} from '../lib/familiarity'

interface FamiliarityIconProps {
  score: number
}

function FamiliarityIcon({ score }: FamiliarityIconProps) {
  const level = getFamiliarityLevel(score)
  const count = FAMILIARITY_LEVEL_BOOK_COUNT[level]
  const label = FAMILIARITY_LEVEL_LABEL[level]

  return (
    <span
      className="inline-flex items-center gap-0.5 text-sm"
      title={`熟悉度：${label}`}
      aria-label={`熟悉度：${label}`}
    >
      {Array.from({ length: count }, (_, index) => (
        <span key={index} aria-hidden="true">
          📖
        </span>
      ))}
    </span>
  )
}

export default FamiliarityIcon
