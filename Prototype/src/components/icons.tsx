// Small bespoke line-icon set (stroke-based, currentColor) so the app isn't
// wearing a generic icon-library look. Kept dependency-free on purpose.
interface IconProps {
  className?: string
}

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 20 20',
}

interface FillableIconProps extends IconProps {
  filled?: boolean
}

export function BookIcon({ className, filled = false }: FillableIconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 4.5c-1.2-1-3-1.5-5.5-1.5-.6 0-1 .4-1 1v10c0 .6.4 1 1 1 2.5 0 4.3.5 5.5 1.5 1.2-1 3-1.5 5.5-1.5.6 0 1-.4 1-1V4c0-.6-.4-1-1-1-2.5 0-4.3.5-5.5 1.5Z" />
      <path d="M10 4.5v11" stroke={filled ? '#f5f0e3' : 'currentColor'} />
    </svg>
  )
}

export function QuillIcon({ className, filled = false }: FillableIconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <g transform="rotate(45 10 10)">
        <rect
          x="8.6"
          y="2.5"
          width="2.8"
          height="11"
          rx="0.6"
          fill={filled ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={1.3}
          strokeLinejoin="round"
        />
        <path d="M8.6 13.5 10 17 11.4 13.5Z" fill="currentColor" />
        <rect x="8.6" y="2.5" width="2.8" height="2.2" fill="currentColor" />
      </g>
    </svg>
  )
}

export function BoltIcon({ className, filled = false }: FillableIconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.8 2.5 4 11.5h4.2L8.9 17.5 16.2 8H11.9L10.8 2.5Z" />
    </svg>
  )
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="8.7" cy="8.7" r="5.2" />
      <path d="m16.5 16.5-3.6-3.6" />
    </svg>
  )
}

interface StarIconProps extends IconProps {
  filled?: boolean
}

export function StarIcon({ className, filled = false }: StarIconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinejoin="round"
    >
      <path d="M10 2.8 12.3 7.7 17.6 8.4 13.8 12.1 14.7 17.4 10 14.9 5.3 17.4 6.2 12.1 2.4 8.4 7.7 7.7Z" />
    </svg>
  )
}

const SNOWFLAKE_PETAL = 'M10 10 Q12.2 7 10 2.5 Q7.8 7 10 10Z'
const SNOWFLAKE_ANGLES = [0, 60, 120, 180, 240, 300]

export function SnowflakeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" fill="currentColor">
      {SNOWFLAKE_ANGLES.map((angle) => (
        <path key={angle} d={SNOWFLAKE_PETAL} transform={`rotate(${angle} 10 10)`} />
      ))}
    </svg>
  )
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="m5.5 8 4.5 4.5L14.5 8" />
    </svg>
  )
}

export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="m12 5.5-4.5 4.5 4.5 4.5" />
    </svg>
  )
}

export function ExportIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M10 3.5v9" />
      <path d="m6.5 9 3.5 3.5L13.5 9" />
      <path d="M4 13v2.5c0 .6.4 1 1 1h10c.6 0 1-.4 1-1V13" />
    </svg>
  )
}

export function SpeakerIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M3.5 7.8v4.4h2.3l3.7 2.8V5l-3.7 2.8Z" />
      <path d="M13 7.3q1.8 2.7 0 5.4" />
      <path d="M15.3 5.3q3 4.7 0 9.4" />
    </svg>
  )
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M10 4.5v11" />
      <path d="M4.5 10h11" />
    </svg>
  )
}

export function SendIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M10 15.5v-11" />
      <path d="m5.8 8.7 4.2-4.2 4.2 4.2" />
    </svg>
  )
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4.5 6.5h11" />
      <path d="M8 6.5V5c0-.6.4-1 1-1h2c.6 0 1 .4 1 1v1.5" />
      <path d="M6 6.5 6.6 15c0 .6.5 1 1 1h4.8c.5 0 1-.4 1-1l.6-8.5" />
      <path d="M8.3 9.5v4" />
      <path d="M11.7 9.5v4" />
    </svg>
  )
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="m4.5 10.5 3.5 3.5 7.5-8" />
    </svg>
  )
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="2.6" />
      <path d="M10 3.2v1.9" />
      <path d="M10 14.9v1.9" />
      <path d="M16.8 10h-1.9" />
      <path d="M5.1 10H3.2" />
      <path d="m15.1 4.9-1.3 1.3" />
      <path d="m6.2 13.8-1.3 1.3" />
      <path d="m15.1 15.1-1.3-1.3" />
      <path d="m6.2 6.2-1.3-1.3" />
    </svg>
  )
}

export function ListIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M7 5.5h9.5" />
      <path d="M7 10h9.5" />
      <path d="M7 14.5h9.5" />
      <circle cx="3.6" cy="5.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="3.6" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="3.6" cy="14.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="m5.5 5.5 9 9" />
      <path d="m14.5 5.5-9 9" />
    </svg>
  )
}

export function MoreIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" fill="currentColor">
      <circle cx="10" cy="4" r="1.6" />
      <circle cx="10" cy="10" r="1.6" />
      <circle cx="10" cy="16" r="1.6" />
    </svg>
  )
}
