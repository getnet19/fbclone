const mongodb = require("mongoose");

const ConversationSchema = new mongodb.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongodb.model("Conversation", ConversationSchema);
