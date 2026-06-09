const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1709884732259-9f2f0a52288b?q=80&w=3063",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1709884732259-9f2f0a52288b?q=80&w=3063"
          : v,
    },
  },
  price: {
    type: Number,
  },

  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
