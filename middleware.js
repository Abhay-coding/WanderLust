import Listing from "./models/listing.js";
import Review from "./models/review.js";
import ExpressError from "./utils/ExpressError.js";
import { listingSchema, reviewSchema } from "./schema.js";


export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;

    console.log("Saving redirect:", req.originalUrl);

    return res.redirect("/login");
  }
  next();
};

export const saveRedirectUrl = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
    console.log("Session returnTo:", req.session.returnTo);
    delete req.session.returnTo;
  }
  next();
};

export const isOwner= async(req, res, next) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the Owner of the Listing");
      return res.redirect(`/listings/${id}`);
  }
  next();
}

export const validateListing = (req, res, next) => {
  const result = listingSchema.validate(req.body); 
  if (result.error) {
    let errMsg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


export const validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body);  

  if (result.error) {
    let errMsg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

export const isReviewAuthor= async(req, res, next) => {
  let {id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the Author of the Review");
      return res.redirect(`/listings/${id}`);
  }
  next();
}