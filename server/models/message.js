const mongodb = require("mongoose");

const MessageSchema = new mongodb.Schema(
  {
    conversationId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: { type: String },
  },
  { timestamps: true }
);

module.exports = mongodb.model("Message", MessageSchema);
