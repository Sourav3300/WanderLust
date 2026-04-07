const express = require("express");
const router = express.Router();
let ExpressError = require("../utils/ExpressError.js")
const Users = require("../passport.js")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport")
const {saveDirectUrl} =  require("../middleware.js")
const controlUser = require("../Control/user.js") 

router.route("/signUp")
.get(controlUser.renderSingUp)
.post( wrapAsync(controlUser.signUp ));

router.route("/login")
.get(controlUser.renderLogIn)
.post(
  saveDirectUrl,
  passport.authenticate('local',{failureRedirect: '/login',failureFlash : true}),
  controlUser.logIn
  )


router.get("/logout",controlUser.logOut);

module.exports = router;