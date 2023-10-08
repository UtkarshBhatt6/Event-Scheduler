import React, { useEffect, useState } from 'react'
import NavBar from './Navigation'
import Button from 'react-bootstrap/Button';
// import React from 'react';
import {
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardFooter,
  MDBBtn
} from 'mdb-react-ui-kit';

function Login(props) {
 
  return (
  
    <div >
      <MDBCard alignment='center'>
      <MDBCardHeader>Featured</MDBCardHeader>
      <MDBCardBody>
        <MDBCardTitle>Event Scheduler</MDBCardTitle>
        <MDBCardText>Now connect with your google calendar to seamlessly organize your day.</MDBCardText>
        <Button  onClick={(e) => {
      e.preventDefault();
      window.location.href='http://localhost:5000/google';
      }}>Connect With Google Calendar</Button>
      </MDBCardBody>
      <MDBCardFooter>Have a nice day</MDBCardFooter>
    </MDBCard>
    </div>
  )
}

export default Login


// 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