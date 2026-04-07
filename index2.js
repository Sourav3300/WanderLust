const mongoose = require("mongoose");
const initialData = require("./data.js");
const listing = require("./Listing.js");

let url = 'mongodb://127.0.0.1:27017/Wanderlust';

async function main() {
  await mongoose.connect(url);
  
};

main()
.then(async ()=>{
  console.log("Sucessfull");
  await initializeData();
})
.catch((err)=>{
  console.log(err)
});

let initializeData = async ()=>{
  await listing.deleteMany({});

   initialData.data =  initialData.data.map((obj) => ({...obj, owner : '69c3a01d4af1a0b1a983c3cf' }));
   console.log(initialData.data);
  await listing.insertMany(initialData.data)
};

