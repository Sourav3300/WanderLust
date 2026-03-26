const express = require("express");
const route = express.Router();
let ExpressError = require("../utils/ExpressError.js")
const Users = require("../passport.js")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport")

route.get("/signUp",(req,res)=>{
  res.render("users/user")
})
route.post("/signUp", wrapAsync( async (req,res)=>{
  let {username,email,password} = req.body;
  let user1 = new  Users({
    username,
    email
  })

  let registerUser = await Users.register(user1,password);
  console.log(registerUser);
  req.flash("success", "Welcome to WanderLust");
  res.redirect("/listings")
}))

route.get("/login",(req,res)=>{
res.render("users/login");
})
route.post("/login",
  passport.authenticate('local',{failureRedirect: '/login',failureFlash : true}),
  (req,res)=>{
    req.flash("success","Welcome to WanderLust");
    res.redirect("/listings");
  })
module.exports = route;