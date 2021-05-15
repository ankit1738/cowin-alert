import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: String,
    pincodes: [String],
    districts: [String],
    lastEmail: Date,
    isSubscribed: Boolean,
});
let User = mongoose.model("User", userSchema);
export { User };
