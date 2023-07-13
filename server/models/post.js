const mongodb = require("mongoose");
const postSchema = new mongodb.Schema(
  {
    userId: { type: String, required: true },
    image: { type: String},
    desc: { type: String, maxLength: 500 },
    likes: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongodb.model("Post", postSchema);
