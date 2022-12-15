const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const movieRoutes = require('./routes/movies')
const listRoutes = require('./routes/lists')
mongoose
  .connect(process.env.MONGO_URI , {
   useNewUrlParser : true,
   useUnifiedTopology : true
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err.message);
  });
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/movie', movieRoutes)
app.use('/api/lists', listRoutes)



app.listen(5000, () => {
  console.log("listening on port 5000");
});
