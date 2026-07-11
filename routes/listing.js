import express from "express"
const router = express.Router();
import mongoose from 'mongoose';
import wrapAsync from "../utils/wrapAsync.js";
import { listingSchema, reviewSchema } from "../schema.js";
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.js";
import { isLoggedIn } from "../middleware.js";
import { isOwner ,validateListing} from "../middleware.js";
import { cloudinary, storage } from "../cloudConfig.js";
import * as listingController from "../controllers/listings.js";
import multer from "multer";

const upload = multer({
  storage
});



router.route("/")
.get(wrapAsync(listingController.index))
.post((req, res, next) => {
  upload.single("listing[image]")(req, res, (err) => {
    if (err) {
      console.error("UPLOAD ERROR:");
      console.error(err);
      return res.status(500).send(err.message);
    }

    console.log(req.file);
    console.log(req.body);

    res.send(req.file);
  });
});

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyLising));



//Edit Router
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm)
);

export default router;