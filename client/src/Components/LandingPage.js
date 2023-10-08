import React from 'react'
import Button from 'react-bootstrap/esm/Button'
import {Link} from 'react-router-dom'
function LandingPage() {
  return (
    <div className="LandingPage">
      <div style={{textAlign:'left',padding:'20px',paddingLeft:'60px'}}>
         <span style={{fontWeight:'1000',fontFamily:'Okra',fontSize:'60px'}}>Event-Scheduler</span>
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',padding:'40px',margin:'20px'}}>
        {/* <span style={{fontWeight:'100',fontFamily:'Okra',fontSize:'60px'}}>Content</span> */}
        <div style={{padding:'20px'}}>
        <Button variant="outline-dark" size="lg" ><Link to='/Login' style={{ textDecoration: 'none' }}>Try for free</Link></Button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage