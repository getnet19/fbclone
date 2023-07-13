const user = require("../models/user");

const cryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");
const { verifyToken } = require("./verifyToken");
const router = require("express").Router();

global.User=null;
//user registration
router.post("/register", async (req, res) => {
  const newUser = new user({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: cryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSENC
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    return res.status(500).json(error);
  }
});

let refereshTokens = [];

router.post("/refresh",(req,res)=>{
  const refresh = req.body.token;
  if(!refresh) return res.status(401).json("you are not authenthicated!")
  if(!refereshTokens.includes(refresh)) return res.status(403).json("referesh token is not valid")

  JWT.verify(refresh,process.env.REFJWT,(err,user)=>{
    err && console.log(err);
    refereshTokens = refereshTokens.filter((token)=> token !== refresh);

    const newTokens = JWT.sign(
      { id: global.User._id, isAdmin: global.User.isAdmin },
      process.env.JWTSEC,
      { expiresIn: "3d" }
    );

    const newRefersehToken = JWT.sign(
      { id: global.User._id, isAdmin: global.User.isAdmin },
      process.env.REFJWT,
    );

    refereshTokens.push(newRefersehToken)
    res.status(200).json({
      tokens:newTokens,
      refreshToken:newRefersehToken
    })
  })

  

  
})

//user login
router.post("/login", async (req, res) => {
  try {
    global.User = await user.findOne({
      email: req.body.email,
    });

    if (!global.User) {
      return res.status(404).json("User not found");
    }

    const orignalPassword = cryptoJS.AES.decrypt(
      global.User.password,
      process.env.PASSENC
    ).toString(cryptoJS.enc.Utf8);

    if (orignalPassword !== req.body.password) {
      return res.status(404).json("User password not found");
    }
    const { password, ...others } = global.User._doc;

    const tokens = JWT.sign(
      { id: global.User._id, isAdmin: global.User.isAdmin },
      process.env.JWTSEC,
      { expiresIn: "3d" }
    );

    const refreshToken = JWT.sign(
      { id: global.User._id, isAdmin: global.User.isAdmin },
      process.env.REFJWT
    );

    refereshTokens.push(refreshToken);

    res.status(200).json({ ...others, tokens, refreshToken });
  } catch (error) {
    res.status(500).json(error);
  }
});

//logout 
router.post("/logout",verifyToken,async(req,res)=>{
  const refereshToken = req.body.token;
  refereshTokens = refereshTokens.filter((token)=> token !== refereshToken);
  res.status(200).json("you are logout successfuly!");})

  
module.exports = router;
