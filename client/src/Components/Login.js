import React, { useEffect, useState } from 'react'
import NavBar from './Navigation'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import * as formik from 'formik';
import * as yup from 'yup';
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import {Link} from 'react-router-dom'
function FormExample() {
  const { Formik } = formik;
  const schema = yup.object().shape({
    email: yup.string().required(),
    password: yup.string().required(),
    terms: yup.bool().required().oneOf([true], 'Terms must be accepted'),
  });
  return (
    <Formik
      validationSchema={schema}
      onSubmit={console.log}
      initialValues={{
        email: '',
        password: '',
        terms: false,
      }}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit} style={{borderRadius:'20px',display:'flex',flexDirection:'column',justifyContent:'space-between',backgroundColor:'#F5F5F5',textAlign:'center',fontFamily:'Okra',fontSize:'40px',padding:'30px'}} >
              <Form.Label style={{fontWeight:'400',fontFamily:'Okra',fontSize:'40px',padding:'30px'}}>Login</Form.Label>
          <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="validationFormikUsername" style={{width:'auto'}}>
              {/* <InputGroup hasValidation> */}
                {/* <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text> */}
                <Form.Control
                  type="text"
                  placeholder="Enter email address"
                  aria-describedby="inputGroupPrepend"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  style={{backgroundColor:'#F5F5F5',borderRadius:'0px',border:'none',borderBottom:'1px solid black'}}

                />
                <Form.Control.Feedback type="invalid" style={{fontSize:'12px'}}
                >
                  {errors.email}
                </Form.Control.Feedback>
              {/* </InputGroup> */}
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="validationFormik05"   style={{width:'auto'}}>
              {/* <Form.Label>Zip</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="Enter password"
                name="password"
                value={values.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
                style={{backgroundColor:'#F5F5F5',borderRadius:'0px',border:'none',borderBottom:'1px solid black'}}
              />

              <Form.Control.Feedback type="invalid" style={{fontSize:'12px'}}
              >
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
         
        </Form>
      )}
    </Formik>
  );
}

function Login(props) {
 
  return (
    <div style={{display:'flex',flexDirection:'column',justifyContent:'space-around'}} >
    <div >
        <NavBar/>
    </div>
    <div>
    <div style={{display:'flex',justifyContent:'center'}}>
        <FormExample/>
    </div>
    <div style={{display:'flex',justifyContent:'center'}} id="signIn" >
    <Button   onClick={(e) => {
      e.preventDefault();
      window.location.href='http://localhost:5000/google';
      }} style={{alignItems:'left'}}>Google Login</Button>

    </div>
     
    </div>       

    </div>
  )
}

export default Login


// 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