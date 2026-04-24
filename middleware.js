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