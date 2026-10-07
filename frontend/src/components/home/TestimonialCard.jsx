import { motion } from 'framer-motion'
import { FaStar, FaQuoteLeft } from 'react-icons/fa'
import { slideRight } from '../../utils/motionVariants.js'

export default function TestimonialCard({ testimonial, index }) {
  return (
    <motion.div
      variants={slideRight}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="bg-white rounded-3xl p-8 shadow-card relative"
    >
      <FaQuoteLeft className="text-3xl text-primary/10 absolute top-6 right-6" />
      <div className="flex items-center gap-3 mb-4">
        <img
          src={testimonial.photo}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
        />
        <div>
          <p className="font-semibold text-sm">{testimonial.name}</p>
          <p className="text-xs text-ink/40">{testimonial.country}</p>
        </div>
      </div>
      <div className="flex gap-0.5 mb-3 text-amber-400 text-xs">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <FaStar key={i} />
        ))}
      </div>
      <p className="text-sm text-ink/60 leading-relaxed">{testimonial.review}</p>
    </motion.div>
  )
}
