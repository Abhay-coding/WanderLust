import express, { Router } from "express";
import mongoose from 'mongoose';
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import Listing from "./models/listing.js";
import ejsMate from "ejs-mate";

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

app.get("/listings",async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
})

app.get("/listing/:id",async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
});

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});


//Create Route
app.post("/listings",async(req,res)=>{
    const newListing = new Listing(req.body.listing)
    await newListing.save();
    res.redirect("/listings")
});


//Edit Router
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});


//Update Route
app.put("/listing/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings")
})

//delete route
app.delete("/listing/:id",async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})


// app.get("/testListing",async (req,res)=>{
//     let samepleListing  = new Listing({
//         title:"My New Villa",
//         description:"By the Beach",
//         price:1200,
//         location:"Kolkata",
//         country:"India",
//     });

//     await samepleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful Testing")
// });

app.listen(8080,()=>{
    console.log("server is listening to poprt 8080");
})