import Listing from "../models/listing.js";
import mongoose from "mongoose";
import axios from "axios";
const API_KEY = process.env.ARCGIS_API_KEY;

async function geocodeLocation(location) {
    try {
        const response = await axios.get(
            "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates",
            {
                params: {
                    f: "json",
                    token: API_KEY, // or apiKey if token doesn't work
                    singleLine: location,
                    maxLocations: 1,
                },
            }
        );

        if (!response.data.candidates || response.data.candidates.length === 0) {
            throw new Error("Location not found");
        }

        const { x, y } = response.data.candidates[0].location;

        return {
            type: "Point",
            coordinates: [x, y] // [longitude, latitude]
        };

    } catch (err) {
        console.log(err.response?.data || err.message);
        return null;
    }
}

export const index = async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
    };

export const renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

export const showListings = async (req, res) => {
    let { id } = req.params;

    // 🔥 Handle invalid Mongo ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid Listing ID!");
        return res.redirect("/listings");
    }

    let listing = await Listing.findById(id)
        .populate({path:"reviews",
            populate:
                {path:"author"}})
        .populate("owner");

    // 🔥 Handle deleted / non-existing listing
    if (!listing) {
        req.flash("error", "The listing you requested doesn't exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};


export const createLisiting = async(req,res,next)=>{


    let url =req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    const geometry = await geocodeLocation(newListing.location);

    console.log(geometry);
    newListing.geometry = geometry;

    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success","New Listing Created !")
    res.redirect("/listings");
};

export const renderEditForm = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
    }
    let originalImageURL = listing.image.url;
    originalImageURL = originalImageURL.replace("/upload","/upload/h_150,w_250");
    console.log(originalImageURL);
    console.log(listing.image);
    res.render("listings/edit.ejs",{listing,originalImageURL});


};

export const updateListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url =req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    

    req.flash("success","Listing Updated !")
    res.redirect("/listings")
};

export const destroyLising =async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted !")
    res.redirect("/listings");
};