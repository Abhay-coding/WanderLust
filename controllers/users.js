import User from "../models/user.js";


export const renderSignup =(req,res)=>{
    res.render("users/signup.ejs");
};

export const signup =async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "Welcome to WanderLust");

            const redirectUrl = req.session.returnTo || "/listings";
            delete req.session.returnTo;

            res.redirect(redirectUrl);
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

export const renderLogin = (req,res)=>{
    res.render("users/login.ejs");
};

export const login = (req, res) => {

    const redirectUrl = res.locals.returnTo || "/listings";

    delete req.session.returnTo;

    console.log("Redirecting to:", redirectUrl);

    res.redirect(redirectUrl);
  };

export const logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out now")
    })
    res.redirect("/listings");
};