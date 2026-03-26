const express = require("express");
const route = express.Router();
let ExpressError = require("../utils/ExpressError.js")
const wrapAsync = require("../utils/wrapAsync.js");
const {ListingSchema} = require("../schema.js")
let listing = require("../Listing.js")


const ValidateError = (req,res,next) =>{
    let {error} = ListingSchema.validate(req.body);
  if(error){
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404,msg)
  }
  else{
    next();
  }
}


route.get("/",wrapAsync(async(req,res)=>{
  let allListing = await listing.find({});
  res.render("listings/listing", {allListing});
}));
route.get("/new",(req,res)=>{
  res.render("listings/new");
})
route.get("/:id" , wrapAsync(async (req,res)=>{
  let {id} = req.params;
  let info = await listing.findById(id).populate("reviews");

  if(!info){
    req.flash("error","Listing not found")
     return res.redirect("/listings")
  }
 
  res.render("listings/show",{info})
}));
route.post("/",ValidateError,wrapAsync((async (req,res)=>{
 
  let newListing =   new listing(req.body.listing);
  await newListing.save();
  req.flash("success","New Listing has been Created");
  res.redirect("/listings");
})))
route.get("/:id/edit", wrapAsync( async (req,res,next)=>{
  
  let {id} = req.params;
  let list = await listing.findById(id);
  req.flash("success"," Listing has been Edited");
  res.render("listings/edit",{list});
 
}));
route.put("/:id", ValidateError,wrapAsync(async (req,res)=>{

  let { id } = req.params;
   await listing.findByIdAndUpdate(id,{...req.body.listing});

  if(listing.findByIdAndUpdate(id,{...req.body.listing})){
    req.flash("error","Listing not found")
    res.redirect("/listings")
  }
   req.flash("success"," Listing has been Updated");
  res.redirect(`${id}`);
}));
route.delete("/:id/delete",wrapAsync( async(req,res)=>{
  let {id} = req.params;
  await listing.findByIdAndDelete(id);
  req.flash("success"," Listing has been Deleted");
  res.redirect("/listings")
  
}))


module.exports = route;