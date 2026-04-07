const mongoose = require("mongoose");
const {Schema : mySchema} = mongoose;
const passportLocalMongoose = require("passport-local-mongoose").default || require("passport-local-mongoose");

const userSchema = new mySchema({
  email : {
    type : String,
    required : true,
  }
})
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);