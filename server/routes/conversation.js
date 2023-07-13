const router = require("express").Router();
const conversation = require("../models/conversation");

//create new conversation
router.post("/create", async (req, res) => {
  const newConversation = new conversation({
    members: [req.body.senderId, req.body.reciverId],
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get conversation that user exchange to others
router.get("/find/:userId", async (req, res) => {
  try {
    const userConversation = await conversation.find({
      members: { $in: [req.params.userId]},
    });
    return res.status(200).json(userConversation);
  } catch (error) {
    res.status(500).json(error)
  }
});

module.exports = router;
