import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaPaperPlane } from 'react-icons/fa'

const columns = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/#about' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Blog', href: '#' },
    ],
  },
  {
    title: 'Quick Links',
    links: [
      { label: 'Destinations', href: '/#destinations' },
      { label: 'Packages', href: '/#packages' },
      { label: 'Planner', href: '/planner' },
      { label: 'My Trips', href: '/my-trips' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '#' },
      { label: 'Cancellation Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy', href: '#' },
    ],
  },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <footer id="contact" className="bg-[#0f172a] text-white/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-extrabold text-xl mb-4">
              <span className="w-9 h-9 rounded-xl grid place-items-center gradient-primary text-white">
                <FaPaperPlane className="text-sm -rotate-45" />
              </span>
              TravelMate
            </div>
            <p className="text-sm leading-relaxed max-w-sm mb-6">
              AI-powered travel planning with personalized itineraries, hotel recommendations,
              smart budget estimation and seamless booking — plan smarter, travel better.
            </p>
            <div className="flex gap-3">
              {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-9 h-9 rounded-full border border-white/15 grid place-items-center hover:bg-primary hover:border-primary transition-colors"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-3 text-sm">
                {col.links.map((link) =>
                  link.href.startsWith('/') && !link.href.includes('#') ? (
                    <li key={link.label}>
                      <Link to={link.href} className="hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <a href={link.href} className="hover:text-primary transition-colors">
                        {link.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-sm">© {new Date().getFullYear()} TravelMate. All rights reserved.</p>
          <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Subscribe for travel deals"
              className="px-4 py-2 rounded-full bg-white/10 text-sm placeholder:text-white/40 outline-none border border-white/10 focus:border-primary w-full md:w-64"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-full text-sm font-semibold text-white gradient-primary whitespace-nowrap"
            >
              {subscribed ? 'Subscribed ✓' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>
    </footer>
  )
}
