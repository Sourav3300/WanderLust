let listing = require("../Listing.js");


module.exports.allListing = async(req,res)=>{
  let allListing = await listing.find({});
  res.render("listings/listing", {allListing});
};

module.exports.renderNew = (req,res)=>{
  res.render("listings/new");
};

module.exports.renderShow = async (req,res)=>{
  let {id} = req.params;
  let info = await listing.findById(id).populate(
    {path : "reviews",
    populate : { path : "author"}})
    .populate("owner");
   console.log(info)
  if(!info){
    req.flash("error","Listing not found")
     return res.redirect("/listings")
  }
 
  res.render("listings/show",{info})
};

module.exports.createNewListing = async (req, res, next) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const newListing = new listing(req.body.listing);

    // 🔥 THIS IS REQUIRED
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await newListing.save();

    req.flash("success", "New listing created");
    res.redirect("/listings");

  } catch (err) {
    console.error("CREATE ERROR:");
    console.error(err.message);
    console.error(err);
    next(err);
  }
};
module.exports.renderEdit = async (req, res) => {
  let { id } = req.params;
  let list = await listing.findById(id);

  if (!list) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  let originalUrl = list.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/h_300,w_250")
  res.render("listings/edit", { list,originalUrl});
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  // update basic fields
  let list = await listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  if (!list) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }


  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;

    list.image = { url, filename };
    await list.save(); 
  }

  req.flash("success", "Listing has been Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
  let {id} = req.params;
  await listing.findByIdAndDelete(id);
  req.flash("success"," Listing has been Deleted");
  res.redirect("/listings")
  
};