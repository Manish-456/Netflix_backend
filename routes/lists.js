const router = require("express").Router();
const List = require("../models/List");
const verifyToken = require("../verifyToken");

//--------------- Create Lists ------------------//
router.post("/", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    const lists = new List(req.body);
    try {
      const savedList = await lists.save();
      res.status(201).json(savedList);
    } catch (err) {
      res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json("You are not allowed");
  }
});

//--------------- Update Lists ------------------//
router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.status(200).json(updatedMovie);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json("You're not allowed to update the movie.");
  }
});

//--------------- Delete Lists ------------------//
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.id);
      res.status(200).json("Lists has been deleted");
    } catch (err) {
      return res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json("You aren't allowed to delete the Lists");
  }
});

//--------------- Get Lists ------------------//

router.get("/", verifyToken, async (req, res) => {
  const genreQuery = req.query.genre;
  const typeQuery = req.query.type;
  let list = [];
  if (typeQuery) {
    if (genreQuery) {
      list = await List.aggregate([
        {
          $sample: { size: 10 },
        },
        {
          $match: { genre: genreQuery, type: typeQuery },
        },
      ]);
    } else {
      list = await List.aggregate([
        {
          $sample: { size: 10 },
        },
        {
          $match: { type: typeQuery },
        },
      ]);
    }
  } else {
    list = await List.aggregate([
      {
        $sample: { size: 10 },
      },
    ]);
  }
  res.status(200).json(list);
});

module.exports = router;
