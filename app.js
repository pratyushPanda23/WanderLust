const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./MODELS/Listing");
const { title } = require("process");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./MODELS/Review.js");

//  CONNECTIOM WITH MONGOOSE
connect()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function connect() {
  await mongoose.connect("mongodb://127.0.0.1:27017/travelLust");
  const Connection = mongoose.connection;
  // console.log(Connection.readyState);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

//Validate the listing -- SERVER SIDE
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};

//Validate the review -- SERVER SIDE
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};
//Index Route
app.get(
  "/Listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    console.log(allListings);
    res.render("listings/index", { allListings });
  }),
);

//New Route
app.get(
  "/Listings/new",
  wrapAsync(async (req, res) => {
    res.render("listings/new");
  }),
);

//Create Route
app.post(
  "/Listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
  }),
);

//Edit Route
app.get(
  "/Listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
  }),
);

//Update Route
app.put(
  "/Listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/Listings/${id}`);
  }),
);

//Show Route
app.get(
  "/Listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show", { listing });
  }),
);

//Delete Route
app.delete(
  "/Listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

//Reviews--Post route
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
    console.log("new review saved");
  }),
);

//Reviews--Delete route
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    let post = await Listing.findById(id).populate("reviews");
    // console.log(post);
    res.redirect(`/listings/${id}`);
  }),
);

//For any random route if all fails this error will handle the page not found
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

//Error Handling Middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Some Error Occured" } = err;
  console.log("STATUS:", err.status);
  console.log("MESSAGE:", err.message);
  res.status(status).render("error.ejs", {
    err,
  });
});

//app listening
app.listen(8080, () => {
  console.log("Server is listening at port 8080");
});
