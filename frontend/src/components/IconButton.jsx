export default function IconButton({
  as: As = 'button',
  className = '',
  label,
  children,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-md px-2 py-2 text-slate-700 hover:bg-slate-100 active:bg-slate-200'

  if (!label) {
    throw new Error('IconButton requires a label for accessibility')
  }

  return (
    <As aria-label={label} title={label} className={`${base} ${className}`} {...props}>
      {children}
      <span className="sr-only">{label}</span>
    </As>
  )
}
