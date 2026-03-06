const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./Listing.js")
const path = require("path");
engine = require('ejs-mate');
let methodOverride = require("method-override");
let ExpressError = require("./utils/ExpressError.js")
const wrapAsync = require("./utils/wrapAsync.js");
const {listingSchema} = require("./schema.js")

app.engine('ejs', engine);
app.set("view engine", "ejs");
app.set("views" , path.join(__dirname ,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")))



let url = 'mongodb://127.0.0.1:27017/Wanderlust';

async function main() {
  await mongoose.connect(url);
  
};

main()
.then(()=>{
  console.log("Sucessfull")
})
.catch((err)=>{
  console.log(err)
});


const ValidateError = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
  if(error){
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404,msg)
  }
  else{
    next();
  }
}

app.listen(3000,()=>{
  console.log("Listening to port 3000")
});
app.get("/",(req,res)=>{
  res.send("It's Working");
});
app.get("/listing",wrapAsync(async(req,res)=>{
  let allListing = await listing.find({});
  res.render("listings/listing", {allListing});
}));
app.get("/listing/new",(req,res)=>{
  res.render("listings/new");
})
app.get("/:id" , wrapAsync(async (req,res)=>{
  let {id} = req.params;
  let info = await listing.findById(id);
  res.render("listings/show",{info})
}));
app.post("/listings",ValidateError,(async (req,res)=>{
 
  let newListing =   new listing(req.body.listing);
   await newListing.save();
  res.redirect("/listing");
}))
app.get("/listing/:id/edit", wrapAsync( async (req,res,next)=>{
  
  let {id} = req.params;
  let list = await listing.findById(id);
  res.render("listings/edit",{list});
 
}));
app.put("/listings/:id", ValidateError,wrapAsync(async (req,res)=>{

  let { id } = req.params;
   await listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/${id}`);
}));
app.delete("/listing/:id/delete",wrapAsync( async(req,res)=>{
  let {id} = req.params;
  await listing.findByIdAndDelete(id);
  res.redirect("/listing")
  
}))

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err,req,res,next)=>{
  let { status = 400,message} = err;
  res.status(status).render("listings/error",{err})
})

// app.get("/testing", async (req,res)=>{
//   const listing1 = new listing(
//     {
//       title : "My villa",
//       description : "located in cox's bazar",
//       price : 1800,
//       location : "Chattagram",
//       country : "Bangladesh"
//     }
//   );
//   await listing1.save();
//   console.log("Saved")
// }) 