import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cron from "node-cron";
import { router as registerRoute } from "./register.js";
import { getAllSubscribers } from "./service/checkAvailability.js";
import { User } from "./models/user.js";

/** FOR DECLARING __dirname */
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;

/** MIDDLEWARES */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"));
app.use("/register", registerRoute);

app.set("view engine", "ejs");

const MONGO_URI = `mongodb+srv://ankit:${process.env.MONGODB_PASS}@cowinalert.zffaf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
/** MONGODB CONFIG */
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    dbName: "CowinAlert",
    useUnifiedTopology: true,
    useFindAndModify: false,
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Database connected");
});

/** ROUTES */
app.get("/", (req, res) => {
    res.render("index");
});

app.post("/unsubscribe", async (req, res) => {
    console.log(req.body);
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        user.isSubscribed = false;
        user.pincodes = [];
        user.save();
        res.send({ msg: "Unsubsribed sucessfully" });
    } else {
        res.send({ msg: "Email not found" });
    }
});

cron.schedule("*/1 * * * *", () => {
    console.log("running task every 5 minutes");
    getAllSubscribers();
});

app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log("Server is listening to port", PORT);
});
