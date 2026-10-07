const mongoose = require('mongoose')
const applyToJSON = require('../utils/toJSONPlugin')

// Stores each exchange with the rule-based TravelMate Assistant, for an
// optional "chat history" admin view. Not required for the chatbot to work.
const chatHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    message: { type: String, required: true },
    reply: { type: String, required: true },
    matchedTopic: { type: String, default: 'fallback' },
  },
  { timestamps: true }
)

applyToJSON(chatHistorySchema)

module.exports = mongoose.model('ChatHistory', chatHistorySchema)
