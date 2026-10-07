import { motion } from 'framer-motion'

export default function Loader({ label = 'Loading…', size = 'md' }) {
  const dims = size === 'sm' ? 'w-8 h-8 border-2' : size === 'lg' ? 'w-16 h-16 border-4' : 'w-11 h-11 border-[3px]'

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        className={`${dims} rounded-full border-primary/15 border-t-primary`}
      />
      {label && <p className="text-sm text-ink/50">{label}</p>}
    </div>
  )
}
