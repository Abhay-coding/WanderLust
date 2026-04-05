import express from "express"
const router = express.Router({ mergeParams: true });

import wrapAsync from "../utils/wrapAsync.js";
import { listingSchema, reviewSchema } from "../schema.js";
import ExpressError from "../utils/ExpressError.js";
import Review from "../models/review.js";
import Listing from "../models/listing.js";

const validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body);  

  if (result.error) {
    let errMsg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//reviews
router.post("/",validateReview,wrapAsync(async(req,res)=>{

    if (!req.body.review.comment || req.body.review.comment.trim() === "") {
        throw new Error("Comment cannot be empty");
    }
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created !")
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted !")
    res.redirect(`/listings/${id}`)
}))

export default router;