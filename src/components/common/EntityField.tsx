import type { EntityFieldConfig } from '../../types'

export function EntityField({
  field,
  value,
  onChange,
}: {
  field: EntityFieldConfig
  value: string
  onChange: (value: string) => void
}) {
  if (field.type === 'select') {
    return (
      <div className="space-y-1">
        <label className="block text-sm text-gray-600">{field.label}</label>
        <select
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm focus:border-[#4f7161] focus:outline-none focus:ring-2 focus:ring-[#4f7161]/20"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {field.options.map((option) => (
            <option key={option.value || `${field.name}-empty`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (field.type === 'multiselect') {
    const selectedValues = value ? value.split(',') : []
    return (
      <fieldset className="space-y-2">
        <legend className="text-sm text-gray-600">{field.label}</legend>
        {field.options.length ? (
          <div className="grid gap-2 rounded-lg border border-gray-300 p-3 sm:grid-cols-2">
            {field.options.map((option) => (
              <label
                className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
                key={option.value}
              >
                <input
                  checked={selectedValues.includes(option.value)}
                  className="h-4 w-4 accent-[#4f7161]"
                  onChange={(event) => {
                    const nextValues = event.target.checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter((selected) => selected !== option.value)
                    onChange(nextValues.join(','))
                  }}
                  type="checkbox"
                />
                {option.label}
              </label>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-gray-300 p-3 text-sm text-gray-500">
            Nenhuma tag cadastrada.
          </p>
        )}
      </fieldset>
    )
  }

  if (field.type === 'radio') {
    return (
      <div className="space-y-1">
        <label className="block text-sm text-gray-600">{field.label}</label>
        <div className="flex gap-6 pt-1">
          {field.options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
            >
              <input
                type="radio"
                name={field.name}
                value={option.value}
                checked={value === option.value}
                onChange={(event) => onChange(event.target.value)}
                className="h-4 w-4 accent-[#4f7161]"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <div className="space-y-1">
        <label className="block text-sm text-gray-600">{field.label}</label>
        <textarea
          className="w-full resize-y rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-[#4f7161] focus:outline-none focus:ring-2 focus:ring-[#4f7161]/20"
          rows={4}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm text-gray-600">{field.label}</label>
      <input
        className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-[#4f7161] focus:outline-none focus:ring-2 focus:ring-[#4f7161]/20"
        type={field.type ?? 'text'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
