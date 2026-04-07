const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {ValidateError} = require("../middleware.js");
const controlListing = require("../Control/listing.js");
const multer  = require('multer');

const {storage} = require("../cloudConfig.js")
const upload = multer({ storage });


let {isLoggedin,isOwner} = require("../middleware.js");






router.route("/")
.get(wrapAsync(controlListing.allListing))
.post(isLoggedin,upload.single('image'),ValidateError,wrapAsync(controlListing.createNewListing))

router.get("/new",isLoggedin,controlListing.renderNew
);


router.route("/:id")
.get( wrapAsync(controlListing.renderShow))
.put(isLoggedin,isOwner, upload.single('image'), ValidateError,wrapAsync(controlListing.updateListing));





router.get("/:id/edit", isLoggedin, wrapAsync(controlListing.renderEdit));


router.delete("/:id/delete", isLoggedin, wrapAsync(controlListing.destroyListing));


module.exports = router;