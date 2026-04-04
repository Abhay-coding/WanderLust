import express, { Router } from "express";
import mongoose from 'mongoose';
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import Listing from "./models/listing.js";
import ejsMate from "ejs-mate";
import wrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/ExpressError.js";
import Review from "./models/review.js";
import { listingSchema, reviewSchema } from "./schema.js";
const app = express();
app.engine('ejs',ejsMate);
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main()  
    .then((res)=>{
        console.log("Connection Succesful");
    })
    .catch((err) => console.log(err));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/",(req,res)=>{
    res.send("Working")
});

const validateListing = (req, res, next) => {
  const result = listingSchema.validate(req.body); 
  if (result.error) {
    let errMsg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body);  

  if (result.error) {
    let errMsg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

app.get("/listings",wrapAsync(async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
    })
);

//Show Route
app.get("/listing/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing})
    })
);

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});


//Create Route
app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
    const newListing = new Listing(req.body.listing)
    await newListing.save();
    res.redirect("/listings");
    })
);


//Edit Router
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
    })
);


//Update Route
app.put("/listing/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings")
    })
);

//delete route
app.delete("/listing/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})
);

//reviews
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{

    if (!req.body.review.comment || req.body.review.comment.trim() === "") {
        throw new Error("Comment cannot be empty");
    }
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listing/${listing._id}`);
}));

//Delete Review Route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listing/${id}`)
}))

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"));
});

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something Went Wrong!"} = err;
    res.status(statusCode).render("error.ejs",{err})
})
 
app.listen(8080,()=>{
    console.log("server is listening to poprt 8080");
})