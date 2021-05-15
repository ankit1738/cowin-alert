import express from "express";
import { User } from "./models/user.js";

const router = express.Router();

router.post("/", async (req, res) => {
    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
        if (req.body.isPincode) {
            existingUser.pincodes.push(req.body.pincode);
        } else {
            existingUser.districts.push(req.body.district);
        }
        existingUser.lastEmail = null;
        existingUser.isSubscribed = true;
        existingUser.save();
        res.send({ user: existingUser, msg: "Email already registered. Pin code added sucessfully" });
    } else {
        let user = new User();
        user.email = req.body.email;
        if (req.body.isPincode && req.body.pincode) {
            user.pincodes.push(req.body.pincode);
        }
        if (req.body.isDistrict && req.body.district) {
            user.districts.push(req.body.district);
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
