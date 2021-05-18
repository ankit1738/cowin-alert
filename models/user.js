import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: String,
    pincodes: [
        {
            pin: String,
            lastEmail: Date,
        },
    ],
    districts: [
        {
            pin: String,
            lastEmail: Date,
        },
    ],
    isSubscribed: Boolean,
});
let User = mongoose.model("User", userSchema);
export { User };
