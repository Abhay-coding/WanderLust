import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import pkg from "passport-local-mongoose";
const passportLocalMongoose = pkg.default;

const userSchema = new Schema({
    email:{
        type:String,
        required: true
    }
})

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

export default User;