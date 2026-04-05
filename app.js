import express, { Router } from "express";
import mongoose from 'mongoose';
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import listings from "./routes/listing.js"
import reviews from "./routes/review.js"
import session from "express-session"
import flash from "connect-flash";

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

const sessionOption = {
    secret:"mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() +7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,//protect from cross scripting attacks
    },
};
app.use(session(sessionOption));
app.use(flash());

app.get("/",(req,res)=>{
    res.send("Working")
});

app.use((req,res,next)=>{
    res.locals.success = req.flash("success"),
    res.locals.error = req.flash("error"),
    next();
})

app.use("/listings",listings)
app.use("/listings/:id/reviews",reviews)

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