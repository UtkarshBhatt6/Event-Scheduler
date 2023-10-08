import express from "express";
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
export default function parseGPTOutput(output){
    let task = "";
    let date = "";
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
  let t=parseInt(recurrence[1])
  let w=parseInt(recurrence[3])
  let y=recurrence[2].toUpperCase()
  let x=recurrence[0].toUpperCase()
  const recurrenceQuad=[x,t,y,w]
  const [freq, interval, byDay,COUNT] = recurrenceQuad;
  console.log(freq,interval, byDay,COUNT);
  // console.log(work, startTime,endTime);
  console.log(attendees); 
  const recurrenceFormat=recurrenceRule(recurrenceQuad);
  console.log("recurrenceFormat",recurrenceFormat);
  // .replace(/\s+/g, "").trim()
  attendees = attendees.map((str) => str.replace(/\s+/g, "").trim());

  const attendeeObjects = attendees.map((email) => ({ email }));
  const freqUpper=freq.toUpperCase();
    console.log(attendeeObjects); 

    return {
      work: task,
      date: formattedDate,
      startTime: combinedStartTime,
      endTime: combinedEndTime,
      attendees: attendeeObjects,
      recurrenceString: recurrenceFormat,
    };
  };
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
  // module.exports.parseGPTOutput=parseGPTOutput();