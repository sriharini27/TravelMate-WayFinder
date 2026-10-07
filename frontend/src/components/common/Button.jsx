const variants = {
  primary: 'gradient-primary text-white shadow-card hover:shadow-lg hover:-translate-y-0.5',
  secondary: 'gradient-secondary text-white shadow-card hover:shadow-lg hover:-translate-y-0.5',
  outline: 'border border-ink/15 text-ink hover:border-primary/40 hover:text-primary',
  ghost: 'text-ink/70 hover:text-primary',
  danger: 'border border-red-200 text-red-500 hover:bg-red-50',
}

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-sm',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
