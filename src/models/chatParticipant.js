const mongoose = require("mongoose");

const chatParticipantSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  leftAt: {
    type: Date,
    default: null,
  },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
  lastReadMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default: null,
  },
  lastReadAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  notifications: {
    enabled: {
      type: Boolean,
      default: true,
    },
    muteUntil: {
      type: Date,
      default: null,
    },
  },
});

// Index for better performance
chatParticipantSchema.index({ conversation: 1, user: 1 });
chatParticipantSchema.index({ user: 1 });
chatParticipantSchema.index({ conversation: 1, isActive: 1 });

module.exports = mongoose.models.ChatParticipant || mongoose.model("ChatParticipant", chatParticipantSchema);
