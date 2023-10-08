import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { google } from "googleapis";
const PORT = process.env.PORT || 5000;
import { LocalStorage } from "node-localstorage";
const localStorage = new LocalStorage("./storage");
dotenv.config({});
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE", 
  })
  );
const calendar = google.calendar({
  version: "v3",
  auth: process.env.API_KEY,
 });
app.listen(PORT, () => {
  console.log("listening");
 });
const scopes = ["https://www.googleapis.com/auth/calendar"];
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);
app.get("/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  res.redirect(url);
});
app.get("/google/redirect", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  console.log(tokens);
  res.redirect(process.env.URL_FRONTEND);
  
});

function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_token");
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });
  oauth2Client.refreshAccessToken((err, tokens) => {
    if (err) {
      console.error("Error refreshing access token:", err);
      return;
    }
    const newAccessToken = tokens.access_token;

    localStorage.setItem("access_token", newAccessToken);

    insertEvent();
  });
}


async function getCalendarEvents() {
  try {
    const response = await calendar.events.list({
      calendarId: "primary", 
      auth: oauth2Client,
    });
    console.log("Calendar events:", response.data.items);
    return response.data.items;
  } catch (err) {
    console.error("Error fetching calendar events:", err);
    return err;
  }
}
app.get("/calendar/events", async (req, res) => {
  try {
    const events = await getCalendarEvents();
    console.log("events: ",events);

    res.send(events);
  } catch (err) {
 
    res.send(err);
  }
});
