interface LabeledInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

// Label sits outside the bordered field, above it — consistent with the
// other custom fields in these forms (search combobox, SelectMenu) whose
// captions also sit above rather than beside or inside the control.
function LabeledInput({ id, label, value, onChange, placeholder, required }: LabeledInputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium tracking-wide text-ink-soft">
        {label}
      </label>
      <input
        id={id}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[44px] w-full rounded-lg border border-rule bg-stone-100 px-3 py-2 text-base leading-6 tracking-wide font-semibold text-ink placeholder:font-normal placeholder:text-ink-soft/50 focus:border-accent focus:outline-none"
      />
    </div>
  )
}

export default LabeledInput
