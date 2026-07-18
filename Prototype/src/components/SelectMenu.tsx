import { useState } from 'react'
import { ChevronDownIcon } from './icons'

interface SelectMenuOption<T extends string> {
  value: T
  label: string
}

interface SelectMenuProps<T extends string> {
  value: T
  options: SelectMenuOption<T>[]
  onChange: (value: T) => void
  ariaLabel: string
  triggerClassName?: string
}

const DEFAULT_TRIGGER_CLASSNAME =
  'flex h-11 items-center gap-1.5 rounded-full bg-paper-deep px-4 text-sm font-semibold text-ink-soft'

// Custom dropdown so the option list can be styled (rounded corners, app
// colors) — a native <select>'s popup panel is OS-rendered chrome that CSS
// cannot restyle on desktop browsers. `triggerClassName` lets callers match
// the trigger to surrounding field styles (e.g. a bordered form field)
// instead of the default compact pill used for toolbar-style selects.
function SelectMenu<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  triggerClassName,
}: SelectMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const current = options.find((option) => option.value === value)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={triggerClassName ?? DEFAULT_TRIGGER_CLASSNAME}
      >
        {current?.label}
        <ChevronDownIcon className="h-3.5 w-3.5" />
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
          <ul
            role="listbox"
            aria-label={ariaLabel}
            className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-rule bg-surface shadow-lg"
          >
            {options.map((option) => (
              <li key={option.value} role="option" aria-selected={option.value === value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={`flex min-h-[44px] w-full items-center px-4 text-left text-sm font-semibold ${
                    option.value === value
                      ? 'bg-accent-soft text-accent'
                      : 'text-ink-soft hover:bg-paper-deep'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default SelectMenu
