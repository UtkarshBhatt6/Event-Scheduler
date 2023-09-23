import React from "react";
import {useState} from 'react'
function ScheduleEvent() {
  const [task ,setTask]=useState("");
  const [response ,setResponse]=useState(null);
//   const response = null;
 const handleChange = (e) => {
    // this.setState({ task: e.target.value });
    setTask(e.target.value);
  };
 const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/add_event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task }),
    });

    // Log the response here
    console.log("Raw response:", response);
    
    if (!response.ok) {
      console.error("Error:", response.statusText);
      return;
    }

    const data = await response.json();

    // Check if the "error" field is present in the response JSON object
    if (data.error) {
      console.error("Error:", data.error);
      return;
    }
    console.log(data)
    // console.log(data.attendees)
    setResponse(data)
  };
  return (
    <div>
      {/* const { task, response } = this.state; */}
      
      <div className="container">
        <h1 className="my-4">Schedule Your Event</h1>
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="input-group">
            <input
              type="text"
              value={task}
              onChange={handleChange}
              placeholder="Enter your task"
              className="form-control task-input"
            />
            <button type="submit" className="btn btn-primary">
              Schedule Event
            </button>
          </div>
        </form>
        {/* {response && (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Task Scheduled:</h2>
              <p className="card-text">Task: {response.summary}</p>
              <p className="card-text">Start Time: {response.start.dateTime}</p>
              <p className="card-text">End Time: {response.end.dateTime}</p>
            </div>
          </div> */}
        {response && (
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Task Scheduled:</h2>
              <p className="card-text">Task: {response.summary}</p>
              <p className="card-text">Start Time: {response.start.dateTime}</p>
              <p className="card-text">End Time: {response.end.dateTime}</p>
              <p className="card-text">Link: {response.htmlLink}</p>
              <p className="card-text">Attendees:</p>
               <ul>{response.attendees.map((attendee) => (
                    <li key={attendee.email}>{attendee.email}</li>
                   ))}
              </ul>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScheduleEvent;
