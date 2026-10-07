const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport')
const { notFound, errorHandler } = require('./middleware/errorHandler')

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const destinationRoutes = require('./routes/destinationRoutes')
const hotelRoutes = require('./routes/hotelRoutes')
const roomRoutes = require('./routes/roomRoutes')
const packageRoutes = require('./routes/packageRoutes')
const offerRoutes = require('./routes/offerRoutes')
const itineraryRoutes = require('./routes/itineraryRoutes')
const attractionRoutes = require('./routes/attractionRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const wishlistRoutes = require('./routes/wishlistRoutes')
const recentlyAccessedRoutes = require('./routes/recentlyAccessedRoutes')
const chatbotRoutes = require('./routes/chatbotRoutes')
const adminRoutes = require('./routes/adminRoutes')

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

app.get('/api/health', (req, res) => res.json({ success: true, message: 'TravelMate API is running.' }))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/destinations', destinationRoutes)
app.use('/api/hotels', hotelRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/packages', packageRoutes)
app.use('/api/offers', offerRoutes)
app.use('/api/itineraries', itineraryRoutes)
app.use('/api/attractions', attractionRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/recently-accessed', recentlyAccessedRoutes)
app.use('/api/chatbot', chatbotRoutes)
app.use('/api/admin', adminRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app
