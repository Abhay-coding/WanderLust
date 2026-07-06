import express from "express"
const router = express.Router();
import mongoose from 'mongoose';
import wrapAsync from "../utils/wrapAsync.js";
import { listingSchema, reviewSchema } from "../schema.js";
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.js";
import { isLoggedIn } from "../middleware.js";
import { isOwner ,validateListing} from "../middleware.js";
import * as listingController from "../controllers/listings.js";


router.get("/",wrapAsync(listingController.index)
);

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//Show Route
router.get("/:id", wrapAsync(listingController.showListings));



//Create Route
router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createLisiting)
);


//Edit Router
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm)
);


//Update Route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing)
);

//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyLising)
);

export default router;