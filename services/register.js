import express from "express";
import { User } from "../models/user.js";

const router = express.Router();

router.post("/", async (req, res) => {
    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
        if (req.body.isPincode) {
            existingUser.pincodes.push({ pin: req.body.pincode, lastEmail: null });
        } else {
            existingUser.districts.push({ pin: req.body.district, lastEmail: null });
        }
        existingUser.lastEmail = null;
        existingUser.isSubscribed = true;
        existingUser.save();
        res.send({ user: existingUser, msg: "Email already registered. Pin code added sucessfully" });
    } else {
        let user = new User();
        user.email = req.body.email;
        if (req.body.isPincode && req.body.pincode) {
            user.pincodes.push({ pin: req.body.pincode, lastEmail: null });
        }
        if (req.body.isDistrict && req.body.district) {
            user.districts.push({ pin: req.body.district, lastEmail: null });
        }
        user.lastEmail = null;
        user.isSubscribed = true;
        await User.create(user)
            .then((createdUser) => {
                console.log(createdUser);
                res.send({ user: createdUser, msg: "Email registered sucessfully" });
            })
            .catch((err) => {
                res.send(err);
            });
    }
});

export { router };
