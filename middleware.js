const listing = require("./Listing");
const Review = require("./reviews");
const {ListingSchema,ReviewSchema} = require("./schema.js");
let ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedin = (req,res,next)=>{
  if(!req.isAuthenticated()){

    req.session.redirectUrl = req.originalUrl;
    req.flash("error","You must be logged in");
     return res.redirect("/login")
  }
  next();
}

module.exports.saveDirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req,res,next)=>{
let {id} = req.params;
let list = await listing.findById(id);
if(! res.locals.currUser._id.equals(list.owner._id)){
   req.flash("error", "You are not the owner");
    return res.redirect(`${id}`);
}
next();
 
}
module.exports.isReviewAuthor = async (req,res,next)=>{
let {id,reviewId} = req.params;
let Rev = await Review.findById(reviewId);
if(!res.locals.currUser._id.equals(Rev.author._id)){
   req.flash("error", "You are not the author");
    return res.redirect(`${id}`);
}
next();
 
}

module.exports.ValidateError = (req,res,next) =>{
    let {error} = ListingSchema.validate(req.body);
  if(error){
    console.error(error.message);
    console.error(error);

    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400,msg)
  }
  else{
    next();
  }
}

module.exports.ValidateError2 = (req,res,next) =>{
    let {error} = ReviewSchema.validate(req.body);
  if(error){
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404,msg)
  }
  else{
    next();
  }
}
