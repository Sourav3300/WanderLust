const mongoose = require("mongoose");
let schemma = mongoose.Schema;
const listingSchemma = new schemma(
  {
    title : {
      type : String,
      required : true
    },
    description : {
       type : String,
    },
    image: {
          filename: { type: String, default: "listingimage" },
          url: { type: String, default: "https://images.unsplash.com/default.jpg" }
        },

    price : String,
    location : String,
    country : String
  }
);

const listing = mongoose.model("listing", listingSchemma);

module.exports = listing;
