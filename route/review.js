const express = require("express");
const route = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
let listing = require("../Listing.js");
const mongoose = require("mongoose");
const Review = require("../reviews.js");
const {ValidateError2,isLoggedin,isReviewAuthor} = require("../middleware.js");
const controlReview = require("../Control/review.js")

route.post("/",isLoggedin,ValidateError2, wrapAsync(controlReview.createReview))

route.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(controlReview.destroyreview))

module.exports = route;