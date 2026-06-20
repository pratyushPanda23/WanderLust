const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./Review.js");

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
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

//Mongoose post MiddleWare
listingSchema.post("findOneAndDelete", async (Listing) => {
  if (Listing) {
    await Review.deleteMany({ _id: { $in: Listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
