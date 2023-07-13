const JWT = require("jsonwebtoken");
const user = require("../models/user");
const Post = require("../models/post");

const verifyToken = (req, res, next) => {
  const authHeaders = req.headers.token;

  if (authHeaders) {
    const token = authHeaders.split(" ")[1];
    JWT.verify(token, process.env.JWTSEC, (err, user) => {
      if (err) return res.status(500).json("token is invalid");
      req.user = user;
      next();
    });
  } else {
    return res.status(500).json("user is not authenticated!");
  }
};

const verifyTokenAndAuth = (req, res, next) => {
  verifyToken(req, res, async () => {
    if (req.params.id.length === 24) {
      const User = await user.findOne({ _id: req.params.id });
      if (!User) {
        return res.status(404).json("user does not exist");
      } else {
        if (req.user.id === req.params.id || req.user.isAdmin) {
          next();
        } else {
          return res.status(403).json("You are not allowed!");
        }
      }
    } else {
      return res.status(500).json("user id length is incorrect!");
    }
  });
};

const followVerifyToken = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id !== req.params.id) {
      next();
    } else {
      return res.status(403).json("You can't follow your");
    }
  });
};

//for post opperation
const timelineAndPostVerifyTokenAuth = (req, res, next) => {
  verifyToken(req, res, () => {
    next();
  });
};

//for current user friend 
const userFriendVerifyTokenAuth = (req, res, next) => {
  verifyToken(req, res, () => {
    next();
  });
};

//for post opperation
const likeVerifyTokenAuth = (req, res, next) => {
  verifyToken(req, res, async () => {
    const likePost = await Post.findById(req.params.id);
    if (likePost) {
      next();
    } else {
      return res.status(404).json("post data not aviable");
    }
  });
};

//update and delete post verifyToken
const updateVerifyTokenAndAuth = (req, res, next) => {
  verifyToken(req, res, async () => {
    const currentUserId = req.user.id;
    const postId = req.params.id;

    Post.findById(postId)
      .exec()
      .then((postData) => {
        if (!postData) {
          return res.status(404).json("post data not available");
        }
        if (currentUserId === postData.userId) {
          req.postData = postData;
          next();
        } else {
          return res.status(403).json("You are not allowed");
        }
      });
  });
};

//delete verifyToken
const deleteVerifyToken = (req, res, next) => {
  verifyToken(req, res, () => {
    Post.findById(req.params.id)
      .exec()
      .then((postData) => {
        if (!postData) {
          return res.status(404).json("post data not available");
        }
       else if(req.user.id === postData.userId || req.user.isAdmin){
          req.postData = postData;
          next();
        }else{
          return res.status(403).json("You are not allowed")
        }
      });
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuth,
  followVerifyToken,
  timelineAndPostVerifyTokenAuth,
  likeVerifyTokenAuth,
  updateVerifyTokenAndAuth,
  deleteVerifyToken,
  userFriendVerifyTokenAuth
};
