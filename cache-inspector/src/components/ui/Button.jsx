export default function Button({
  variant = 'default',
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/50 disabled:cursor-not-allowed disabled:opacity-60'

  const variants = {
    default: 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700',
    primary: 'bg-sky-600 text-white hover:bg-sky-500 border border-sky-500',
    danger: 'bg-red-600 text-white hover:bg-red-500 border border-red-500',
    ghost: 'bg-transparent text-slate-200 hover:bg-slate-800/60 border border-slate-800',
  }

  return (
    <button
      className={`${base} ${variants[variant] ?? variants.default} ${className}`}
      {...props}
    />
  )
}

