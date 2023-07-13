const router = require("express").Router();
const message = require("../models/message");

//start new message
router.post("/create", async (req, res) => {
  const newMessage = new message(req.body);
  try {
    const savedMessage = await newMessage.save();
    return res.status(200).json(savedMessage);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get message after conversation created
router.get("/find/:conversationId", async (req, res) => {
  try {
    const userMessage = await message.find({
    conversationId: req.params.conversationId,
    });
    res.status(200).json(userMessage);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
