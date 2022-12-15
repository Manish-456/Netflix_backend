const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const verifyToken = require("../verifyToken");

//--------------- Update User ------------------//
router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json("You can update only your account");
  }
});

//--------------- Delete User ------------------//
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted");
    } catch (err) {
      return res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json("You can delete only your account");
  }
});

//--------------- Get Single User ------------------//
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

//--------------- Get All User ------------------//
router.get("/", verifyToken, async (req, res) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const user = query
        ? await User.find().sort({createdAt : -1}).limit(10).select("-password")
        : await User.find().select("-password");
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json("You are not allowed");
  }
});

//--------------- User Stats ------------------//
router.get('/stats', verifyToken ,async(req, res) => {
 const date = new Date()
 const lastMonth = new Date(date.setFullYear(date.getFullYear() - 1))

 const userStats = await User.aggregate([

  {
  $project : {
   month : {$month : "$createdAt"}
  }
  
  },
  {
   $group : {
    _id : "$month",
    total : {$sum : 1}
 
   }
  }

 ])
 res.status(200).json(userStats)
})

module.exports = router;
