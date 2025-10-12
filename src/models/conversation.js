const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["direct", "group"],
    required: true,
  },
  name: {
    type: String,
    required: function() {
      return this.type === "group";
    },
  },
  description: {
    type: String,
    default: "",
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default: null,
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
conversationSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better performance
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });
conversationSchema.index({ type: 1 });

module.exports = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);
