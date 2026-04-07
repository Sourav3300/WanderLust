 console.log("🔥 INDEX.JS STARTED"); 
  
  if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const engine = require('ejs-mate');
let methodOverride = require("method-override");
const listings = require("./route/listing.js");
const reviews = require("./route/review.js")
const users = require("./route/user.js")
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport")
const localStrategy = require("passport-local")
const User = require("./passport.js");
let dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto : {
    secret : "mysecretcode"
  },
  touchAfter : 24 * 3600,
})

const sessionoptions = {
  store,
  secret : "mysupersecretcode",
  resave : false,
  saveUninitialized : true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httponly : true

  }
};

app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());   

// app.get("/DemoUser",async  (req,res)=>{
//   let user1 = new User({
//     email : "Sourav@Gmail.com",
//     username : "Sourav" + Date.now(),
//   });

//  let registerdData = await User.register(user1,"Hello world");
//  res.send(registerdData);
// })

app.use("/listings",listings);
app.use("/listings/:id/review",reviews);
app.use("/",users)

app.engine('ejs', engine);
app.set("view engine", "ejs");
app.set("views" , path.join(__dirname ,"views"));

app.use(express.static(path.join(__dirname,"public")))


// let url = 'mongodb://127.0.0.1:27017/Wanderlust';


async function main() {
  await mongoose.connect(dbUrl);
  
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
// app.use((req, res, next) => {
//   next(new ExpressError(404, "Page Not Found"));
// });

// app.use((err,req,res,next)=>{
//   let { status = 400,message} = err;
//   res.status(status).render("listings/error",{err})
// })



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
app.get("/", (req, res) => {
  res.redirect("/listings");
});