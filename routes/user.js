import express from "express"
const router = express.Router({ mergeParams: true });
import User from "../models/user.js";
import wrapAsync from "../utils/wrapAsync.js";
import passport, { Passport } from "passport";
import { saveRedirectUrl } from "../middleware.js";
import * as userController from "../controllers/users.js";

router.get("/signup" ,userController.renderSignup)

router.post("/signup", wrapAsync(userController.signup));

router.get("/login",userController.renderLogin)

router.post("/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  userController.login
);
router.get("/logout",userController.logout)

export default router;