import express from "express"
const router = express.Router({ mergeParams: true });
import User from "../models/user.js";
import wrapAsync from "../utils/wrapAsync.js";
import passport, { Passport } from "passport";


router.get("/signup" ,(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync(async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password)
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderLust");
            res.redirect("/listings");
        })
        
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
    
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",passport.authenticate("local",{failureRedirect: '/login',failureFlash: true}),async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust")
    res.redirect("/listings")
})

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out now")
    })
})

export default router;