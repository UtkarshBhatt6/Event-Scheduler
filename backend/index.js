import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import { google } from "googleapis";
import parseGPTOutput from "./parsingFunctions.js";
const PORT = process.env.PORT || 5000;
import { LocalStorage } from "node-localstorage";
const localStorage = new LocalStorage("./storage");
dotenv.config({});
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // restrict calls to those this address
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
    // 'online' (default) or 'offline' (gets refresh_token)
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
  // res.send(tokens);
});

app.post("/add_event", async (req, res) => {
  const input = req.body.task;
  let { work, startTime, endTime, attendees, recurrenceString } =
    await parseTask(input);
  const event = {
    summary: work,
    start: {
      dateTime: startTime,
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: endTime,
      timeZone: "Asia/Kolkata",
    },
    attendees: attendees,
    recurrence: [recurrenceString],
  };
  try {
    const response = await insertEvent(event);
    console.log("event inserted successfully", response);
    res.send(response);
  } catch (err) {
    // console.error('error inserting event',err);
    res.send(err);
  }
});

// function for parsing input
const parseTask = async (input) => {
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);
const prompt = `You are an AI language model, and your task is to parse complex task descriptions typically used by professionals while planning their day and scheduling meetings.
Your work is to extract the task, date, start time, end time, attendees (please extract only email id if present), and recurrence from the Task description below.If no end time is mentioned, consider it to be start time + 30 minutes.
Handle recurring events, relative dates (e.g., today means today's date, tomorrow means tomorrow's date, next week ), and various expressions for specifying date and time as well.The number of times the event i should be repeated should be considered as count.
"Task description: ${input}"
"Task: {{task}} \n"
"Date: {{date}} | frequency terms like daily and weekly are not dates,it can be either today,tomorrow or a particular date.\n"
"Start time: {{start_time}}| remember to truncate any white spaces in between\n"
"End time: {{end_time}} | remember to truncate any white spaces in between\n"
"Attendees: {{attendees|If there are no attendees, please write 'None'.Two attendees should be seperated by , with no added whitespaces and whitespaces in each attendee should be truncated}}\n"
"Recurrence: {{recurrence_freq|If there is no recurrence, please write 'None'}};{{recurrence_interval|If there is no recurrence, please write '1'}};{{recurrence_byday|If there is no recurrence, please write 'None'}};{{recurrence_bycount|If there is no recurrence, please write 'None'}}"`;
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 200,
    temperature: 0,
  });
  const output = response.data.choices[0].text.trim();
  const parsedGPTOutput = parseGPTOutput(output);
  return parsedGPTOutput;
};
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

    // Store the new access token in your storage
    localStorage.setItem("access_token", newAccessToken);

    // Call the API function after refreshing the token
    insertEvent();
  });
}
async function insertEvent(event) {
  const accessToken = localStorage.getItem("access_token");
  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  try {
    const res = await calendar.events.insert({
      calendarId: "primary",
      auth: oauth2Client,
      resource: event,
    });
    // console.log("Event inserted:", res.data.htmlLink);
    return res.data;
  } catch (err) {
    if (err.code === 401) {
      // Access token expired, refresh and retry
      refreshAccessToken();
    } else {
      // console.error("Error inserting event:", err);
    }
    return err;
  }
}

oauth2Client.on("tokens", (tokens) => {
  if (tokens.refresh_token) {
    localStorage.setItem("refresh_token", tokens.refresh_token);
    // console.log(tokens.refresh_token);
  }
  localStorage.setItem("access_token", tokens.access_token);
  // console.log(tokens.access_token);
});
app.post("/Logout", async (req, res) => {
  const revokeAccess = async (accessToken) => {
    await oauth2Client.revokeToken(accessToken);
    await oauth2Client.revokeToken(refreshToken);
  };
  const accessToken = localStorage.getItem("access_token");
  try {
    const response = await revokeAccess(accessToken);
    console.log("user Logout successfull", response);
    res.send(response);
  } catch (err) {
    console.error("error Loggingout user", err);
    res.send(err);
  }
});