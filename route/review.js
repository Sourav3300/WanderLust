const express = require("express");
const route = express.Router({mergeParams:true});
let ExpressError = require("../utils/ExpressError.js")
const wrapAsync = require("../utils/wrapAsync.js");
const {ReviewSchema} = require("../schema.js")
let listing = require("../Listing.js")
const mongoose = require("mongoose");
const Review = require("../reviews.js");
const ValidateError2 = (req,res,next) =>{
    let {error} = ReviewSchema.validate(req.body);
  if(error){
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404,msg)
  }
  else{
    next();
  }
}


route.post("/",ValidateError2, wrapAsync(async (req,res)=>{


  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return res.status(404).send("Invalid listing ID")
  }
  let list = await listing.findById(req.params.id);

  

  let newReview = new Review(req.body.review);
  list.reviews.push(newReview);
  await newReview.save();
  await list.save();
  req.flash("success"," New Review Added");
  res.redirect(`/listings/${list._id}`)
}))

route.delete("/:reviewId",wrapAsync(async (req,res)=>{
  let {id,reviewId} = req.params;
  await Review.findByIdAndDelete(reviewId);
  await listing.findByIdAndUpdate(id,{$pull : {reviews:reviewId}})
  req.flash("success"," New Review Deleted");
  res.redirect(`/listings/${id}`)

}))

module.exports = route;