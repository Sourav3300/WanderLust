const Review = require("../reviews.js");
const mongoose = require("mongoose");
const listing = require("../Listing.js")


module.exports.createReview = async (req,res)=>{


  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return res.status(404).send("Invalid listing ID")
  }
  let list = await listing.findById(req.params.id);

  

  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  list.reviews.push(newReview);
  await newReview.save();
  await list.save();
  req.flash("success"," New Review Added");
  res.redirect(`/listings/${list._id}`)
};

module.exports.destroyreview = async (req,res)=>{
  let {id,reviewId} = req.params;
  await Review.findByIdAndDelete(reviewId);
  await listing.findByIdAndUpdate(id,{$pull : {reviews:reviewId}})
  req.flash("success"," New Review Deleted");
  res.redirect(`/listings/${id}`)

}