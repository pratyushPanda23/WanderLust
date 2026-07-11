const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../MODELS/Listing");
const Review = require("../MODELS/Review");

const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");

const reviewController = require("../controllers/reviews.js");

// Create Review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview),
);

// Delete Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview),
);

module.exports = router;
