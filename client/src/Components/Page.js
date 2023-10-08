import React from "react";
import Navigation from "./Navigation";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { useState } from "react";
import { FormLabel,RadioGroup,FormControlLabel,Radio } from "@mui/material";
import {Link, useNavigate} from 'react-router-dom'
function Page1(){
  return(
    <>
    <div className='left-right-container'
    style={{
      display: "flex",
      flexDirection: "row",
      margin:"20px"
    }}
    >
      
   <div className="left-pane" style={{display:'flex'}}>
        <div style={{display:'flex',flex:'1',flexDirection:'column'}}>
          <div >
    <span  style={{fontFamily:'Okra',fontWeight:'600',fontSize:'36px'}}>Hey fellow hustler! </span>
    </div>
    <div>
    <span  style={{fontFamily:'Okra',fontWeight:'400',fontSize:'22px'}}>Let's get to know the amazing you, so we can tailor your task-taming adventure to perfection!</span>
    </div>
      </div>
      <div style={{display:'flex',flex:'1', borderLeft:'1px solid black'}}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap',fontFamily:'Okra', }}>
      <div style={{padding:'20px'}}>
        <span style={{fontFamily:'Okra',fontSize:'28px',fontWeight:'400'}}>What should we call you ?</span>
        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
          {/* <InputAdornment >What should we call you ?</InputAdornment> */}
          <Input
            id="standard-adornment-amount"
            placeholder="Tell us your name ?"
            // style={{color:'#0000004D'}}
            endAdornment={<InputAdornment position="start"><Button variant="text" ><img src={require('./Images/Arrow.png')} alt="not found"/></Button></InputAdornment>}
          />
        </FormControl>
      </div>
    </Box>
      </div>
      </div>
      </div>
      </>
  )
}
function Page2(){
  return(
    <>
    <div className='left-right-container'
    style={{
      display: "flex",
      flexDirection: "row",
      margin:"20px"
    }}
    >
      
   <div className="left-pane" style={{display:'flex'}}>
        <div style={{display:'flex',flex:'1',flexDirection:'column'}}>
          <div >
    <span  style={{fontFamily:'Okra',fontWeight:'600',fontSize:'36px'}}>What’s your daily grind? </span>
    </div>
    <div>
    <span  style={{fontFamily:'Okra',fontWeight:'400',fontSize:'22px'}}>We're eager to learn about your profession so we can custom-craft a productivity experience that's as unique and awesome as you are!</span>
    </div>
      </div>
      <div style={{display:'flex',flex:'1', borderLeft:'1px solid black'}}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap',fontFamily:'Okra', }}>
      <div style={{padding:'20px'}}>
        {/* <span style={{fontFamily:'Okra',fontSize:'28px',fontWeight:'400'}}>What should we call you ?</span> */}
        <FormControl>
           <FormLabel id="demo-controlled-radio-buttons-group" style={{fontFamily:'Okra',fontSize:'28px',fontWeight:'400'}}>What's your role, oh legendary one ?</FormLabel>
  <RadioGroup
    aria-labelledby="demo-controlled-radio-buttons-group"
    name="controlled-radio-buttons-group"
    // value={value}
    // onChange={handleChange}
  >
    <FormControlLabel value="engineering" control={<Radio />} label="Engineering" />
    <FormControlLabel value="product" control={<Radio />} label="Product" />
    <FormControlLabel value="design" control={<Radio />} label="Design" />
    <FormControlLabel value="leadership" control={<Radio />} label="Leadership" />
  </RadioGroup>
</FormControl>
      </div>
    </Box>
      </div>
      </div>
      </div>
      </>
  )
}
function Page3(){
  return(
    <>
    <div className='left-right-container'
    style={{
      display: "flex",
      flexDirection: "row",
      margin:"20px"
    }}
    >
      
   <div className="left-pane" style={{display:'flex'}}>
        <div style={{display:'flex',flex:'1',flexDirection:'column'}}>
          <div >
    <span  style={{fontFamily:'Okra',fontWeight:'600',fontSize:'36px'}}>Daily adventure timeline ?</span>
    </div>
    <div>
    <span  style={{fontFamily:'Okra',fontWeight:'400',fontSize:'22px'}}>We care for you. Knowing this will help us prioritise your tasks, creating focus hours & scheduling necessary breaks too!</span>
    </div>
      </div>
      <div style={{display:'flex',flex:'1', borderLeft:'1px solid black'}}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap',fontFamily:'Okra', }}>
      <div style={{display:'flex',flexDirection:'column',padding:'40px',margin:'20px'}}>
        {/* <span style={{fontFamily:'Okra',fontSize:'28px',fontWeight:'400'}}>What should we call you ?</span> */}
       <span style={{fontFamily:'Okra',fontWeight:'400',fontSize:'22px',padding:'20px'}}>  My day usually starts at <TextField id="standard-basic" label="" variant="standard" /></span>
       <span style={{fontFamily:'Okra',fontWeight:'400',fontSize:'22px',padding:'20px'}}>  and ends (tentatively) at  <TextField id="standard-basic" label="" variant="standard" /></span>
      </div>
    </Box>
      </div>
      </div>
      </div>
      </>
  )
}
function Page() {
  const navigate=useNavigate();
  const [count,setCount]=useState(25);
  function nextClickHandler(){
    if(count===75){
         navigate('/ScheduleEvent');
    }
      var val=count+25;
      setCount(val);
  }
  function backClickHandler(){
      var val=count-25;
      setCount(val);
  }
  return (
    <div >
      <Navigation />
      
      {(count===25) &&<Page1/>} 
      {(count===50) &&<Page2/>} 
      {(count===75) &&<Page3/>} 
        <div>
          <Slider
            aria-label="Temperature"
            defaultValue={count}
            // getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={25}
            marks
            min={0}
            max={100}
            value={count}
          />
        </div>
        
        <div className="btn-types" style={{display:'flex'}}>
             <div style={{display:'flex',flex:'1',paddingLeft:'2rem'}}>
             <Button variant="outlined" style={{background:'#D9D9D9',borderColor:'black',color:'black',borderRadius:'10px'}} onClick={backClickHandler}>Back</Button>
             </div>
             <div style={{display:'flex',flex:'1',justifyContent:'space-around'}}>
                <Button variant="text" style={{background:'#ffffff',color:'#000000'}}><Link to ="/ScheduleEvent" >Skip for now</Link></Button>
                <Button variant="outlined" style={{background:'#D9D9D9',borderColor:'black',color:'black',borderRadius:'10px'}} onClick={nextClickHandler}>Next</Button>
             </div>
        </div>

    
    </div>
  );
}

export default Page;
