import { Button } from '@mui/material';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Navbar';

function Navigation() {
  const handleLogout= async(req,res)=>{
        try{
          const response = await fetch('http://localhost:5000/Logout', {
            method: 'POST',
          });
    
          if (response.ok) {
            // Logout successful, perform any necessary actions
            console.log('User logged out successfully.');
          } 

        }catch(err){
          console.error('Error logging out:', err);
        }
  }
  return (
    <Nav style={{borderBottom:'1px solid black'}}>
      <Container border>
        <Nav.Brand href="#home">
        <span style={{fontWeight:'1000',fontFamily:'Okra',fontSize:'30px'}}>Event-Scheduler</span>
        </Nav.Brand>
        <Nav.Toggle />
        <Nav.Collapse className="justify-content-end">
          <Nav.Text>
          {/* <span style={{fontWeight:'400',fontFamily:'Okra',fontSize:'30px',padding:'30px'}}>About</span>
          <span style={{fontWeight:'400',fontFamily:'Okra',fontSize:'30px'}}>Pricing</span> */}
          {/* <Button style={{fontCase:'Lowercase'}}onClick={handleLogout}><span style={{fontWeight:'400',fontFamily:'Okra',fontSize:'20px'}}>Logout</span></Button> */}
          </Nav.Text>
        </Nav.Collapse>
      </Container>
    </Nav>
  );
}

export default Navigation;