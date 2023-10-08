import React from "react";
import {useState} from 'react'
import EventCard from "./Event";
import {
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardFooter,
  MDBBtn
} from 'mdb-react-ui-kit';

function ScheduleEvent() {

  const [task ,setTask]=useState("");
  const [response ,setResponse]=useState(null);
 const handleChange = (e) => {
    setTask(e.target.value);
  };
 const handleSubmit = async (e) => {
    e.preventDefault();
   const response = await fetch("http://localhost:5000/calendar/events", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    
    });
    if (!response.ok) {
      console.error("Error:", response.statusText);
      return;
    }

    const data = await response.json();
    if (data.error) {
      console.error("Error:", data.error);
      return;
    }
    setResponse(data)
  };
  return (
    <div>
      <MDBCard alignment='center'>
      <form onSubmit={handleSubmit} className="mb-3">
      <MDBCardHeader>Featured</MDBCardHeader>
      <MDBCardBody>
        <MDBCardTitle><h2>Schedule your day</h2></MDBCardTitle>
        <MDBCardText>We have a new feature that displays all the meetings scheduled in google calendar,attendees and event link.</MDBCardText>
        <button type='submit' className="btn btn-primary">Display your Schedule</button>
      </MDBCardBody>
      {/* <MDBCardFooter>Have a nice day</MDBCardFooter> */}
      </form>
    </MDBCard>
    {response && (
          <MDBCard alignment="center">
<div className="card-body" >
               {response.map((event) => (
                    <EventCard link={event.htmlLink} summary={event.summary} description={event.description} startTime={event.start} endTime={event.end} attendees={event.attendees || []}/>
                   ))}
              
            </div>
          </MDBCard>
        )}
      
    </div>
  );
}

export default ScheduleEvent;
