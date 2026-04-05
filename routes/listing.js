import express from "express"
const router = express.Router();
import mongoose from 'mongoose';

import wrapAsync from "../utils/wrapAsync.js";
import { listingSchema, reviewSchema } from "../schema.js";
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.js";

const validateListing = (req, res, next) => {
  const result = listingSchema.validate(req.body); 
  if (result.error) {
    let errMsg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


router.get("/",wrapAsync(async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
    })
);

//New Route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;

    // 🔥 Handle invalid Mongo ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid Listing ID!");
        return res.redirect("/listings");
    }

    let listing = await Listing.findById(id).populate("reviews");

    // 🔥 Handle deleted / non-existing listing
    if (!listing) {
        req.flash("error", "The listing you requested doesn't exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
}));



//Create Route
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
    const newListing = new Listing(req.body.listing)
    await newListing.save();
    req.flash("success","New Listing Created !")
    res.redirect("/listings");
    })
);


//Edit Router
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
    })
);


//Update Route
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated !")
    res.redirect("/listings")
    })
);

//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted !")
    res.redirect("/listings");
})
);

export default router;