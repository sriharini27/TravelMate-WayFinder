import { motion } from 'framer-motion'
import { scaleIn } from '../../utils/motionVariants.js'

export default function FeatureCard({ icon: Icon, title, description, index, color }) {
  return (
    <motion.div
      variants={scaleIn}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-3xl p-8 shadow-card hover:shadow-soft transition-shadow"
    >
      <div
        className="w-14 h-14 rounded-2xl grid place-items-center text-2xl text-white mb-5"
        style={{ background: color }}
      >
        <Icon />
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-ink/60 leading-relaxed">{description}</p>
    </motion.div>
  )
}
