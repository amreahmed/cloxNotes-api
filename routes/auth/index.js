const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../../models/user_model");
const bcrypt = require("bcrypt");
const authenticationToken = require("../../utilities");

const router = express.Router();

router.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res.json({ error: true, message: "Full name is required" });
  }

  if (!email) {
    return res.json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res.json({ error: true, message: "Password is required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.status(401).json({ error: true, message: "User already exists" });
  }

  const hashed_Password = await bcrypt.hash(password, 10);


  const user = new User({
    fullName,
    email,
    password: hashed_Password,
  });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "User created successfully",
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res
      .status(400)
      .json({ error: true, message: "User does not exist" });
  }

  const validPassword = await bcrypt.compare(password, userInfo.password);


  if (validPassword && userInfo.email === email) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    return res.json({
      error: false,
      message: `Login successful as ${userInfo.fullName}`,
      email,
      accessToken,
    });
  } else {
    return res
      .status(400)
      .json({ error: true, message: "Invalid credentials" });
  }
});



router.get("/user", authenticationToken, async (req, res) => {
  
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });
  if (!isUser) {
    return res.json({ error: true, message: "User not found" });
  } 

    return res.json({
      error: false,
      user: {
        _id: isUser._id,
        fullName: isUser.fullName,
        email: isUser.email,
        createdOn: isUser.createdOn,
      },
    });
  

});

//export the router
module.exports = router;
