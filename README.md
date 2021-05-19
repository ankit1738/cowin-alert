This nodejs server runs a cron job that hits the cowin API every 5 min to check for the availability of vaccines and send an email alert to the subscribed users.

NOTE: This project dosen't have a frontend. Altough, To make things easy and so that you dont have to use postman every time, I've made a homepage with forms to register and unsubscribe which is at root url ("/")

To run the application you'll have to use your own free tier gmail smtp service and mongodb database.

To create a mongodb database - use MongoDB Atlas's free tier. Follow this tutorial -> https://www.freecodecamp.org/news/get-started-with-mongodb-atlas/ 
  
To generate gmail smtp oauth credentials follow this tutorial - https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a

Add the following env variables in .env file in root folder.

• EMAIL=<email>
  
• REFRESH_TOKEN=<google_oauth_refresh_token>
  
• CLIENT_SECRET=<google_oauth_client_secret>
  
• CLIENT_ID=<gogle_oauth_client_id>
  
• MONGODB_PASS=<mongodb_password>

After setting all the env variables 1. use "npm start" to run the app locally 2. visit port localhost:3000 3. Register with email and pincode 4. Let this server run in the background and you'll receive an email when the vaccine is available

NOTE: Find By District not Implemented till now
