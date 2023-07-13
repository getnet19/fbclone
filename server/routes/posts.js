const router = require("express").Router();
const posts = require("../models/post");
const User = require("../models/user");
const {
  timelineAndPostVerifyTokenAuth,
  likeVerifyTokenAuth,
  updateVerifyTokenAndAuth,
  deleteVerifyToken,
} = require("./verifyToken");

//create post data
router.post("/add", timelineAndPostVerifyTokenAuth, async (req, res) => {
  const newPost = new posts({
    userId: req.user.id,
    desc: req.body.desc,
    image: req.body.image,
  });
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (error) {
    return res.status(500).json(`error happen ${error}`);
  }
});

//update post data
router.put("/update/:id", updateVerifyTokenAndAuth, async (req, res) => {
  try {
    const updateData = await posts.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateData);
  } catch (error) {
    res.status(500).json(`error happen ${error}`);
  }
});

//delete post data
router.delete("/delete/:id", deleteVerifyToken, async (req, res) => {
  try {
    await posts.findByIdAndDelete(req.params.id);
    res.status(200).json("data has been deleted");
  } catch (error) {
    res.status(500).json(`error happen ${error}`);
  }
});

//get a post
router.get("/find/:id", async (req, res) => {
  try {
    const postData = await posts.findById(req.params.id);
    res.status(200).json(postData);
  } catch (error) {
    res.status(500).json(error);
  }
});

//likes and dislike post
router.put("/likes/:id", likeVerifyTokenAuth, async (req, res) => {
  const likePost = await posts.findById(req.params.id);
  try {
    const isLike = likePost.likes.includes(req.user.id);
    if (isLike) {
      await likePost.updateOne({ $pull: { likes: req.user.id } });
      return res.status(200).json("unlike successfuly");
    } else {
      await likePost.updateOne({ $push: { likes: req.user.id } });
      return res.status(200).json("like successfuly");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

//get timeline post
router.get("/timeline/:id", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);

    const userPost = await posts.find({ userId: req.params.id });
    console.log(userPost);
    const frindPost = await Promise.all(
      currentUser.followings.map((frinedID) => {
        return posts.find({ userId: frinedID });
      })
    );
    return res.status(200).json(userPost.concat(...frindPost));
  } catch (error) {
    res.status(500).json(error);
  }
});

//get all post
router.get("/allpost", async (req, res) => {
  try {
    const allpost = await posts.find();
    console.log(allpost);
    if(allpost.length !== 0){
      return res.status(200).json(allpost);
    }else{
      return res.status(200).json("no data available");
    }
   
  } catch (error) {
    res.status(500).json(error);
  }
});

//get all user post
router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    const userPost = await posts.find({ userId: user._id });
    if (!userPost) return res.status(404).json("data not available");
    return res.status(200).json(userPost);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
