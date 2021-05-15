import axios from "axios";
import nodemailer from "nodemailer";
import { User } from "../models/user.js";
import moment from "moment";
import googleapis from "googleapis";

const OAuth2 = googleapis.google.auth.OAuth2;
axios.defaults.headers = {
    "User-Agent": "Cowin Alert App",
    "content-type": "application/json",
    "accept-language": "en_US",
    "cache-control": "no-cache",
};
const BASE_URL = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?";

const getAllSubscribers = async () => {
    let users = await User.find({ isSubscribed: true });
    for (let user of users) {
        for (let pincode of user.pincodes) {
            getAvailability(pincode, moment().add(1, "days").format("DD-MM-YYYY"), user);
        }
    }
};
const getAvailability = (pincode, date, user) => {
    axios
        .get(`${BASE_URL}pincode=${pincode}&date=${date}`)
        .then((response) => {
            if (response.data.sessions.length > 0) {
                for (let session of response.data.sessions) {
                    if (session.min_age_limit === 18) {
                        console.log(`for user ${user.email} at pincode ${pincode}`);
                        console.log(
                            `${session.available_capacity} Vaccine available at ${session.name} on ${session.date}`
                        );
                        let message = `
                        <p>${session.available_capacity} ${session.vaccine} Vaccines Available for pin <b>${pincode} at ${session.name} on ${session.date}</b></p>
                        <p><b>Address:</b>${session.address}</p>
                        `;
                        if (user.lastEmail == null || (user.lastEmail && moment().diff(user.lastEmail, "hours") > 0)) {
                            sendmail(user.email, message);
                            user.lastEmail = moment();
                            user.save();
                        }
                    }
                }
            } else {
                console.log(`for user ${user.email} at pincode ${pincode}`);
                console.log(`No Vaccine available on ${date}`);
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

const sendmail = async (toEmail, message) => {
    var mailOptions = {
        from: "kankit327@gmail.com",
        to: toEmail,
        subject: "Vaccines Available",
        text: message,
        html: message,
    };

    let emailTransporter = await createTransporter();
    emailTransporter
        .sendMail(mailOptions)
        .then((response) => {
            console.log("Email Sent");
        })
        .catch((error) => {
            console.log(error);
        });
};

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                reject();
            }
            resolve(token);
        });
    });

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL,
            accessToken,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
        },
    });
};

export { getAllSubscribers };
