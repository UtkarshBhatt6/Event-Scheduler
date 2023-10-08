import React from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBBadge
} from 'mdb-react-ui-kit';

import {Link} from 'react-router-dom';
export default function App(props) {
      console.log(props.startTime)
    console.log(props.endTime)
    console.log("attendees: ",props.attendees)
    const sDateField = props.startTime ? props.startTime.hasOwnProperty('date') : null;
    const eDateField = props.endTime ? props.endTime.hasOwnProperty('date') : null;
    console.log(sDateField, eDateField)
    const attendeeObjects = props.attendees.map((email) => ({ email }));
    console.log("attendeeObjects: ",attendeeObjects)
    attendeeObjects.map((attendee)=>{
          console.log("attendee: ",attendee.email.email)
    })
  return (
    <>
      <MDBCard alignment='center'>
        <MDBCardBody>
          <MDBCardTitle><MDBBadge color='secondary' ><h4>{props.summary}</h4></MDBBadge></MDBCardTitle>
          <MDBCardText> {props.description} </MDBCardText>
          {props.startTime && sDateField && <MDBCardText><h5>start date: <MDBBadge className='ms-2'>{props.startTime.date}</MDBBadge></h5></MDBCardText>}
          {props.startTime  && !sDateField && <MDBCardText><h5>start date-time: <MDBBadge className='ms-2'>{props.startTime.dateTime}</MDBBadge></h5></MDBCardText>}
          {props.endTime  && eDateField && <MDBCardText><h5>end date: <MDBBadge className='ms-2'>{props.endTime.date}</MDBBadge></h5></MDBCardText>}
          {props.endTime  && !eDateField && <MDBCardText><h5>end date-time: <MDBBadge className='ms-2'> {props.endTime.dateTime}</MDBBadge></h5></MDBCardText>} 

       <p>{attendeeObjects && attendeeObjects.map((attendee) => (
                    <MDBCardText key={attendee.email.email}><Link to ={`/ProfileCard/${attendee.email.email}`}><button className="btn btn-primary" style={{backgroundColor:'black'}}>{attendee.email.email}</button></Link></MDBCardText>
                   ))}
              </p>
         <Link to={props.link}> <button className="btn btn-primary" >Event Link</button></Link>
        </MDBCardBody>
      </MDBCard>
    </>
  );
}