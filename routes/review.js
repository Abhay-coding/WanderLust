import express from "express"
const router = express.Router({ mergeParams: true });

import wrapAsync from "../utils/wrapAsync.js";
import { listingSchema, reviewSchema } from "../schema.js";
import ExpressError from "../utils/ExpressError.js";
import Review from "../models/review.js";
import Listing from "../models/listing.js";
import {validateReview,isLoggedIn,isReviewAuthor} from "../middleware.js";
import * as reviewController from "../controllers/reviews.js";


//reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

export default router;