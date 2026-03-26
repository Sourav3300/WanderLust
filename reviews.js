const mongoose = require("mongoose");
const {Schema : ReviewSchema} = mongoose;


const reviewSchema = new ReviewSchema({
  comment : String,
  rating : {
    type : Number,
    min : 1,
    max : 5,
    },
  createdAt : {
    type : Date,
    default : Date.now()
  }
})

module.exports = mongoose.model("Review", reviewSchema);