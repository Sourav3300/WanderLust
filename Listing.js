const mongoose = require("mongoose");

const { Schema } = mongoose;

const listingSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"]
  },
  description: {
    type: String,
    required: [true, "Description is required"]
  },
  image: {
    filename: { type: String, default: "listingimage" },
    url: { type: String, default: "https://images.unsplash.com/default.jpg" }
  },
  price: {
    type: Number, // Number is better than String
    required: [true, "Price is required"]
  },
  location: {
    type: String,
    required: [true, "Location is required"]
  },
  country: {
    type: String,
    required: [true, "Country is required"]
  }
}, { timestamps: true }); 

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;