const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../MODELS/Listing");
const Review = require("../MODELS/Review");

const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");

// Create Review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    const newReview = new Review(req.body.review);

    // Save Review Author
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "Review Added Successfully!");

    res.redirect(`/listings/${listing._id}`);
  }),
);

// Delete Review
router.delete(
  "/:reviewId",
  (req, res, next) => {
    console.log("DELETE REVIEW ROUTE HIT");
    next();
  },
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted Successfully!");

    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;
