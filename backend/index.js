import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import { google } from "googleapis";
// import jwt_decode from "jwt-decode";
const PORT = process.env.PORT || 5000;
import axios from "axios";
import dayjs from "dayjs";
import moment from "moment";
import {DateTime} from 'luxon'
import {createTaskTable,createEventTable,createUserTable,default_values} from './db.js'
import {
  parse,
  formatISO,
  addDays,
  addMinutes,
  setMinutes,
  setHours,
  getHours,
  getMinutes,
  set,
} from "date-fns";
import { utcToZonedTime, format } from "date-fns-tz";
import { LocalStorage } from "node-localstorage";
const localStorage = new LocalStorage("./storage");
dotenv.config({});
const parseTask = async (input) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  // const input = "discuss metrics with prtajm167@gmail.com at 3 pm 12th May";
const currentYear=new Date().getFullYear();
// "Format: {{format_date}} | convert the Date obtained above into yyyy-MM-DD.\n"
console.log(currentYear)
  const prompt = `You are an AI language model, and your task is to parse complex event descriptions typically used by professionals while planning their day.
Extract the task, date, start time, end time, attendees (please extract only email id if present), and recurrence from the descriptions.Note that meeting is not a Task and Task would usually be preceded by for.If no end time is mentioned, consider it to be start time + 30 minutes.
Handle recurring events, relative dates (e.g., today means today's date, tomorrow means tomorrow's date, next week ), and various expressions for specifying dates and times as well.the number of times the event i should be repeated should be considered as count.
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
    temperature: 0.5,
  });
//  console.log(prompt);
  // console.log(response.data.choices[0].text.trim())
  const output = response.data.choices[0].text.trim();
//   // Initialize variables
  console.log(output);
  let task = "";
  let date = "";
  // let formatDate = "";
  let startTime = "";
  let endTime = "";
  let attendees = [];
  let recurrence = [];
  const timeZone = "Asia/Kolkata";

  // Split the input by lines
  const lines = output.split("\n");

  // Iterate over each line and extract the information
  lines.forEach((line) => {
    if (line.includes("Task:")) {
      task = line.replace("Task: ", "");
    } else if (line.includes("Date:")) {
      date = line.replace("Date: ", "");
    }
    //  else if (line.includes("Format:")) {
    //   formatDate = line.replace("Format: ", "");
    // }
     else if (line.includes("Start time:")) {
      startTime = line.replace("Start time: ", "");
    } else if (line.includes("End time:")) {
      endTime = line.replace("End time: ", "");
    } else if (line.includes("Attendees:")) {
      attendees = line.replace("Attendees: ", "").split(",");
    } else if (line.includes("Recurrence:")) {
      recurrence = line.replace("Recurrence: ", "").split(";");
    }
    
  });
  if (task == "None") task = "Unnamed Task";
  // task=task.replace(/\s+/g, "").trim();
  date=date.replace(/\s+/g, "").trim();
  startTime=startTime.replace(/\s+/g, "").trim();
  endTime=endTime.replace(/\s+/g, "").trim();
  // formatDate=formatDate.replace(/\s+/g, "").trim();
  console.log("Task:", task);
  console.log("Date:", date);
  // console.log("formatDate:", formatDate);
  console.log("Start time:", startTime);
  console.log("End time:", endTime);
  console.log("Attendees:", attendees);
  console.log("Recurrence:", recurrence);

  // Parse the date using date-fns
// Parse the date using Luxon
// const task = "Unnamed Task";
// const date = "tomorrow";
// const startTime = "4:55pm";
// const endTime = "5:25pm";
// const timeZone = "Asia/Kolkata";
   
// Parse the date using date-fns
let parsedDate;
console.log(date.length);
date=date.toLowerCase()  
console.log(date==="today");
if (date === "today") {
  parsedDate = new Date(); // Use the current date
  console.log("parsedDate: ", parsedDate)
} else if (date=== "tomorrow") {
  parsedDate = addDays(new Date(), 1); // Use tomorrow's date
} else {
  // console.log("formatDate: ", formatDate)
  // parsedDate =parse(formatDate, 'yyyy-MM-dd', new Date()); // Parse the specified date string
  parsedDate =parse(date, 'yyyy-MM-dd', new Date())
}
console.log("parsedDate: ", parsedDate)
// console.log("parsedDate: ", new Date())
// Parse the start time using date-fns and convert to Kolkata time zone
let parsedStartTime;
try {
    const timeString = startTime.replace(/\s/g, '').toUpperCase();
    console.log("timestring:",timeString);
  const hasMinutes = timeString.includes(':'); // Check if the time string includes minutes
  const formatString = hasMinutes ? 'hh:mma' : 'ha'; // Use different format strings based on the presence of minutes
  parsedStartTime = parse(timeString,formatString, new Date());
  console.log(parsedStartTime);
  if (isNaN(parsedStartTime)) {
    throw new Error('Invalid start time');
  }
  const kolkataStartTime = utcToZonedTime(parsedStartTime, timeZone);
  parsedStartTime = kolkataStartTime;
} catch (error) {
  console.error('Invalid start time value:', error.message);
  // Handle the error or provide default value
  // For example:
  parsedStartTime = setMinutes(setHours(new Date(), 0), 0); // Default start time: 00:00
}

// Parse the end time using date-fns and convert to Kolkata time zone
let parsedEndTime;
try {
  const timeString = endTime.replace(/\s/g, '').toUpperCase();
  const hasMinutes = timeString.includes(':'); // Check if the time string includes minutes
  const formatString = hasMinutes ? 'h:mma' : 'ha'; // Use different format strings based on the presence of minutes
  parsedEndTime = parse(timeString,formatString, new Date());
  console.log(parsedEndTime);
  console.log('library time')
  if (isNaN(parsedEndTime)) {
    throw new Error('Invalid end time');
  }
  const kolkataEndTime = utcToZonedTime(parsedEndTime, timeZone);
  parsedEndTime = kolkataEndTime;
  console.log("kolkata adjusted:" ,parsedEndTime);
} catch (error) {
  console.error('Invalid end time value:', error.message);
  // Handle the error or provide default value
  // For example:
  parsedEndTime = addMinutes(parsedStartTime, 30); // Default end time: start time + 30 minutes
}

// Format the parsed date, start time, and end time in the specified format with Kolkata as the timezone offset
console.log(parsedDate);
const formattedDate = format(parsedDate, 'yyyy-MM-dd', { timeZone });
const formattedStartTime = format(parsedStartTime, "HH:mm:ssXXX", { timeZone });
const formattedEndTime = format(parsedEndTime, "HH:mm:ssXXX", { timeZone });

console.log('library time')
// Combine the date with the start time and end time in the specified format
// const formattedStartTime = parsedStartTime.toISOString();
// const formattedEndTime = parsedEndTime.toISOString();
const combinedStartTime = `${formattedDate}T${formattedStartTime}`;
const combinedEndTime = `${formattedDate}T${formattedEndTime}`;

console.log(combinedStartTime,combinedStartTime);
console.log(combinedEndTime,combinedEndTime);
console.log(attendees,attendees);
  return {
    work: task,
    date: formattedDate,
    startTime: combinedStartTime,
    endTime: combinedEndTime,
    attendees: attendees,
    recurrence: recurrence,
  };
};
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // restrict calls to those this address
    methods: "GET,POST,PUT,DELETE", // only allow GET requests
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

    // If you only need one scope you can pass it as a string
    scope: scopes,
  });
  res.redirect(url);
});
app.get("/google/redirect", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  console.log(tokens);
  res.redirect("http://localhost:3000/Page");
  // res.send(tokens);
});
oauth2Client.on("tokens", (tokens) => {
  if (tokens.refresh_token) {
    localStorage.setItem("refresh_token", tokens.refresh_token);
    // console.log(tokens.refresh_token);
  }
  localStorage.setItem("access_token", tokens.access_token);
  // console.log(tokens.access_token);

  // console.log("Now lets see");
});
app.post('/Logout', async(req,res)=>{
  const revokeAccess = async (accessToken) => {
    await oauth2Client.revokeToken(accessToken);
  };
  const accessToken = localStorage.getItem('access_token');
  try{
    const response = await revokeAccess(accessToken);
    console.log("user Logout successfull",response);
    res.send(response);
  }catch(err){
     console.error("error Loggingout user",err);
     res.send(err);
  } 
  
     
})
const refreshToken = localStorage.getItem("refresh_token");
console.log(refreshToken);
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
const recurrenceRule=(recurrenceQuad)=>{
  let [freq, interval, byDay,count] = recurrenceQuad;
  const dayCode = {
    'MONDAY': 'MO',
    'TUESDAY': 'TU',
    'WEDNESDAY': 'WE',
    'THURSDAY': 'TH',
    'FRIDAY': 'FR',
    'SATURDAY': 'SA',
    'SUNDAY': 'SU',
  };
  //  const byDayCode=  dayCode[byDay] || '';
  let recurrenceRule="";
  console.log(byDay)
  if(freq!=="NONE"){
       byDay=byDay.replace(/\s+/g, "").trim()
       if(byDay==="NONE"){
          recurrenceRule=`RRULE:FREQ=${freq};INTERVAL=${interval};COUNT=${count}`;
       }
       else{
        const byDayCode=  dayCode[byDay] ;
        recurrenceRule=`RRULE:FREQ=${freq};INTERVAL=${interval};BYDAY=${byDayCode};COUNT=${count}`
       }
  }
  else  recurrenceRule= null;
     return recurrenceRule;

}
app.post("/add_event", async (req, res) => {
  // meeting with utkarshbhatt@kgpian.iitkgp.ac.in at 2:15pm today daily at an interval of two days upto 4 meetings
  const input = req.body.task;
  let { work, startTime, endTime,attendees,recurrence } = await parseTask(input);
  let t=parseInt(recurrence[1])
  let w=parseInt(recurrence[3])
  let y=recurrence[2].toUpperCase()
  let x=recurrence[0].toUpperCase()
  const recurrenceQuad=[x,t,y,w]
  const [freq, interval, byDay,COUNT] = recurrenceQuad;
  console.log(freq,interval, byDay,COUNT);
  console.log(work, startTime,endTime);
  console.log(attendees); 
  const recurrenceFormat=recurrenceRule(recurrenceQuad);
  console.log("recurrenceFormat",recurrenceFormat);
  // .replace(/\s+/g, "").trim()
  attendees = attendees.map((str) => str.replace(/\s+/g, "").trim());

  const attendeeObjects = attendees.map((email) => ({ email }));
  const freqUpper=freq.toUpperCase();
    console.log(attendeeObjects); 

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
    attendees:attendeeObjects,
    // recurrence: ["RRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=10"],
    recurrence: [recurrenceFormat],
  };
  try{
    const response =await insertEvent(event);
    console.log('event inserted successfully',response);
  //   let attendees = [];
  //  if (Array.isArray(response.attendees)) {
  //     attendees = response.attendees;         
  //  }
 
// console.log("Attendees:", attendees);
    res.send(response);
  } catch(err){
    // console.error('error inserting event',err);
    res.send(err);
  }
});
// createTable();
// createEventTable();
// createTaskTable();
// createUserTable();
// default_values();