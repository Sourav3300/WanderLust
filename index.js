const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./Listing.js")
const path = require("path");
let methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views" , path.join(__dirname ,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));



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




app.listen(3000,()=>{
  console.log("Listening to port 3000")
});
app.get("/",(req,res)=>{
  res.send("It's Working");
});
app.get("/listing",async(req,res)=>{
  let allListing = await listing.find({});
  res.render("listings/listing", {allListing});
});
app.get("/listing/new",(req,res)=>{
  res.render("listings/new");
})
app.get("/:id" , async (req,res)=>{
  let {id} = req.params;
  let info = await listing.findById(id);
  res.render("listings/show",{info})
});
app.post("/listings",async (req,res)=>{
  let newListing =   new listing(req.body.listing);
   await newListing.save();
  res.redirect("/listing");
})
app.get("/listing/:id/edit", async (req,res)=>{
  let {id} = req.params;
  let list = await listing.findById(id);
  res.render("listings/edit",{list});
});
app.put("/listings/:id",async (req,res)=>{
  let { id } = req.params;
   await listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/${id}`);
});
app.delete("/listing/:id/delete", async(req,res)=>{
  let {id} = req.params;
  await listing.findByIdAndDelete(id);
  res.redirect("/listing")
  
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