const router = require("express").Router();
const Movie = require("../models/Movie");
const verifyToken = require("../verifyToken");

//--------------- Create Movies ------------------//
router.post("/", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    const movie = new Movie(req.body);
    try {
      const savedMovie = await movie.save();
      res.status(201).json(savedMovie);
    } catch (err) {
      res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json("You are not allowed");
  }
});

//--------------- Update Movies ------------------//
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

//--------------- Delete Movies ------------------//
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Movie has been deleted");
    } catch (err) {
      return res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json("You aren't allowed to delete the movie");
  }
});

//--------------- Get Single Movies ------------------//
router.get("/find/:id", verifyToken ,async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    res.status(200).json(movie);
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

//--------------- Get All Movies ------------------//
router.get("/", verifyToken, async (req, res) => {
if(req.user.isAdmin){
 try {
  const movie = await Movie.find().sort({createdAt : -1})
  res.status(200).json(movie)
 } catch (err) {
  res.status(500).json(err.message) 
 }
}else{
 return res.status(200).json("You aren't allowed")
}
});

//--------------- Get Random Movies ------------------//
router.get("/random", verifyToken ,async (req, res) => {
  const type = req.query.type;
  let movie;
  if (type === "series") {
    movie = await Movie.aggregate([
      {
        $match: {
          isSeries: true,
        },
      },
      { $sample: { size: 1 } },
    ]);
  } else {
    movie = await Movie.aggregate([
      {
        $match: {
          isSeries: false,
        },
      },
      { $sample: { size: 1 } },
    ]);
  }
  res.status(200).json(movie);
});



module.exports = router;
