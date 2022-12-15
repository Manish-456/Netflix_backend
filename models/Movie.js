const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    des: {
      type: String,
    },
    img: {
      type: String,
      required: true,
    },
    imgTitle: {
      type: String,
      required: true,
    },
    imgSm: {
      type: String,
    },
    video: {
      type: String,
    },
    limit: {
      type: Number,
    },
    genre: {
      type: String,
    },
    trailor : {
     type : String
    },
     year : {
      type : String
     },
     isSeries : {
      type : Boolean,
      default: false
     }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Movie", MovieSchema);
