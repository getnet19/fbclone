const router = require("express").Router();
const cryptoJS = require("crypto-js");
const user = require("../models/user");
const {
  verifyTokenAndAuth,
  followVerifyToken,
  userFriendVerifyTokenAuth,
} = require("./verifyToken");

const { findOne } = require("../models/post");

//user update
router.put("/update/:id", verifyTokenAndAuth, async (req, res) => {
  if (req.body.password) {
    req.body.password = cryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSENC
    ).toString();
  }

  try {
    const updateUser = await user.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updateUser) return res.status(404).json("user not found!");
    const { password, ...others } = updateUser._doc;
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

//user delete
router.delete("/delete/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    await user.findByIdAndDelete(req.params.id);
    res.status(200).json("user deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

// user search using {firstName,lastName}
router.get("/findUser", async (req, res) => {
  const { search } = req.query;
  let Query = {};
  if (search) {
    Query = {
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ["$firstName", " ", "$lastName"] },
              regex: search,
              options: "i",
            },
          },
        },
      ],
    };
  } else {
    return res.status(404).json("inccorect query");
  }

  try {
    let recipes;
    recipes = await user.find(Query);
    if (recipes.length > 0) {
      res.status(200).json(recipes);
    } else {
      return res.status(404).json("user not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//get a user
router.get("/find/:id", async (req, res) => {
  try {
    const userData = await user.findById(req.params.id);
    if (!userData) return res.status(404).json("user not found");
    const { password, ...others } = userData._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get user friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const currentUser = await user.findById(req.params.userId);
    const friends = await Promise.all(
      currentUser.followings.map((friendId) => {
        return user.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friendInfo) => {
      const { _id, firstName, profilePictcher } = friendInfo;
      friendList.push({ _id, firstName, profilePictcher });
    });
    return res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow and unfollow user
router.put("/:id/follow", followVerifyToken, async (req, res) => {
  const currentUser = await user.findById(req.user.id);
  const User = await user.findById(req.params.id);
  if (!User) {
    return res.status(404).json("user not found");
  }
  try {
    if (!User.followers.includes(req.user.id)) {
      await User.updateOne({ $push: { followers: req.user.id } });
      await currentUser.updateOne({ $push: { followings: req.params.id } });
      return res.status(200).json("Followed successfully");
    } else {
      return res.status(200).json("allready followed");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

//unfollowed
router.put("/:id/unfollow", followVerifyToken, async (req, res) => {
  const currentUser = await user.findById(req.user.id);
  const User = await user.findById(req.params.id);
  if (!User) {
    return res.status(404).json("user not found");
  }
  try {
    if (User.followers.includes(req.user.id)) {
      await User.updateOne({ $pull: { followers: req.user.id } });
      await currentUser.updateOne({ $pull: { followings: req.params.id } });
      return res.status(200).json("unFollowed successfully");
    } else {
      return res.status(200).json("already unFollowed");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

//get all user
router.get("/find", async (req, res) => {
  try {
    const users = await user.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
