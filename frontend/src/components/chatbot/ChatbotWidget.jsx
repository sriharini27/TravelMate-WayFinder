import { useRef, useState, useEffect } from 'react'
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa'
import chatbotService from '../../services/chatbotService.js'

const WELCOME = {
  from: 'bot',
  text:
    "Hi! I'm the TravelMate Assistant, a rule-based helper (not a generative AI) that can answer questions about " +
    'destinations, hotels, trip planning, bookings, early check-in and our demo payment flow. What would you like to know?',
}

/** Floating rule-based chatbot — answers from a static knowledge base on the backend. */
export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, open])

  const send = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return
    setMessages((prev) => [...prev, { from: 'user', text }])
    setInput('')
    setSending(true)
    try {
      const { reply } = await chatbotService.ask(text)
      setMessages((prev) => [...prev, { from: 'bot', text: reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: "Sorry, I couldn't reach the assistant service just now. Please try again." },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 w-80 sm:w-96 h-[28rem] bg-white rounded-3xl shadow-2xl border border-ink/10 flex flex-col overflow-hidden">
          <div className="gradient-primary text-white px-4 py-3.5 flex items-center justify-between">
            <span className="flex items-center gap-2 font-semibold text-sm">
              <FaRobot /> TravelMate Assistant
            </span>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-white/80 hover:text-white">
              <FaTimes />
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] text-sm px-3.5 py-2.5 rounded-2xl leading-relaxed ${
                  m.from === 'bot' ? 'bg-ink/5 text-ink rounded-tl-sm' : 'bg-primary text-white ml-auto rounded-tr-sm'
                }`}
              >
                {m.text}
              </div>
            ))}
            {sending && <div className="text-xs text-ink/40 px-1">Assistant is typing…</div>}
          </div>
          <form onSubmit={send} className="flex items-center gap-2 p-3 border-t border-ink/5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about destinations, booking, check-in…"
              className="flex-1 text-sm px-3.5 py-2.5 rounded-full border border-ink/10 focus:outline-none focus:border-primary/40"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send"
              className="w-10 h-10 rounded-full gradient-primary text-white grid place-items-center shrink-0 disabled:opacity-60"
            >
              <FaPaperPlane className="text-xs" />
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open TravelMate Assistant"
        className="w-14 h-14 rounded-full gradient-primary text-white shadow-2xl grid place-items-center text-xl hover:scale-105 transition-transform"
      >
        {open ? <FaTimes /> : <FaRobot />}
      </button>
    </div>
  )
}
