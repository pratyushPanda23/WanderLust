const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../MODELS/Listing.js");

main()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/travelLust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6a4d3fe9503a06a8e70d3d66",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialised");
};
initDB();
