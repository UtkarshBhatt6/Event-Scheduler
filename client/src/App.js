import logo from './logo.svg';
import './App.css';
import {BrowserRouter} from 'react-router-dom'
import LandingPage from './Components/LandingPage';
import { Route,Routes ,Navigate} from 'react-router-dom';
import Login from './Components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Page from './Components/Page';
import ScheduleEvent from './Components/ScheduleEvent';
import ProfileCard from './Components/ProfileCard';
import { useState } from 'react';
function App() {
    const [user,setUser]=useState({})
  return (
    <div>
   <BrowserRouter>
     <Routes>
         <Route exact path="/" element={<LandingPage/>} />     
         <Route path="/Login" element={<Login setUser={setUser}/>} />     
         <Route path="/Page" element={ <ScheduleEvent/>} />     
         <Route path='/ProfileCard/:email' element={<ProfileCard/>} /> 
     </Routes>
   </BrowserRouter>
    </div>
  );
}

export default App;
