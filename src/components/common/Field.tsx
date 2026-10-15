export function Field({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  variant = 'default',
}: {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  variant?: 'default' | 'underline'
}) {
  // onChange envia o novo valor para o componente pai, mantendo o input controlado.
  return (
    <div className={variant === 'underline' ? 'space-y-0' : 'space-y-1'}>
      <label className={variant === 'underline' ? 'sr-only' : 'block text-sm text-gray-600'}>{label}</label>
      <input
        className={variant === 'underline'
          ? 'w-full border-0 border-b-2 border-[#c4c1c1] bg-transparent px-1 py-3 text-base text-[#34453a] placeholder:font-semibold placeholder:text-[#9b9999] focus:border-[#5c967f] focus:outline-none'
          : 'w-full rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-[#4f7161] focus:outline-none focus:ring-2 focus:ring-[#4f7161]/20'}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
