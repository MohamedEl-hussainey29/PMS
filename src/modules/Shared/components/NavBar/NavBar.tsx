import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import navbarLogo from "../../../../assets/navbarLogo.png";
import PersonalImg from "../../../../assets/personalImg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faBell, faGlobe, faMobileScreen, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { faIdBadge } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import ThemeButton from "../../ThemeButton/ThemeButton";



export default function NavBar() {
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext)!;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* modal */}
     
      <Modal show={show} onHide={handleClose} centered >
        <Modal.Body className="py-5 px-3">
          
              <div className="col-4 text-center w-100">
                <img
                  src={userData?.imagePath || PersonalImg}
                  className="w-25 h-25 rounded rounded-pill "
                  alt="personal image"
                  style={{ width: "300px", height: "200px", objectFit: "cover" }}
                />
                 <span className=" info mt-2" > {userData?.userName} </span> 
                <span className="info"> {userData?.userEmail}</span>
              </div>
 
            <div className=" mt-4 ">
              <div className="divider " style={{width: '100%', height: '1px', backgroundColor: '#eeecec'}}></div>
              <span className=" info mt-2 " > <FontAwesomeIcon className="profile-info" icon={faUserShield} />  {userData?.userGroup} </span>

              <div className="divider my-2" style={{width: '100%', height: '1px', backgroundColor: '#eeecec'}}></div>
              <span className=" info"> <FontAwesomeIcon className="profile-info" icon={faIdBadge} /> {userData?.userId}</span>

              <div className="divider my-2" style={{width: '100%', height: '1px', backgroundColor: '#eeecec'}}></div>
              <span className="  info"> <FontAwesomeIcon className="profile-info" icon={faGlobe} /> {userData?.country} </span>

              <div className="divider my-2 " style={{width: '100%', height: '1px', backgroundColor: '#eeecec'}}></div>
              <span className="info"> <FontAwesomeIcon className="profile-info" icon={faMobileScreen} /> {userData?.phoneNumber} </span>

              <div className="divider my-2" style={{width: '100%', height: '1px', backgroundColor: '#eeecec'}}></div>

            </div>
         
       <div className="mt-4 text-end">
          <Button className="me-3 btn border-0" style={{backgroundColor: '#EF9B28'}} onClick={() => navigate('/change-pass')} >
            Change Password
          </Button>
         <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
       </div>
        </Modal.Body>
        
          
        
      </Modal>

      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand href="/dashboard">
            <img src={navbarLogo} alt="navbar logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center">
              <div className="position-relative">
                <FontAwesomeIcon
                  className="fs-4 bell-icon"
                  icon={faBell}
                  style={{ color: "#EF9B28" }}
                />
                <small
                  className="circle text-white"
                  style={{
                    position: "absolute",
                    width: "15px",
                    height: "15px",
                    top: 0,
                    right: 0,
                    backgroundColor: "#EF9B28",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid white",
                  }}
                >
                  1
                </small>
              </div>

              <div
                className="divider mx-3"
                style={{
                  width: "1px",
                  height: "40px",
                  backgroundColor: "#9A9A9A",
                }}
              ></div>

              <div className="d-flex align-items-center justify-content-center">
                <img
                  src={userData?.imagePath || PersonalImg}
                  onError={(e) => {e.currentTarget.src = PersonalImg}}
                  className="col-3 rounded rounded-5"
                  alt="personal image"
                  style={{ width: "50px", height: "50px", objectFit: 'cover' }}
                />
                <div className="ms-2 ">
                  <h4 className="h6 mb-0">{userData?.userName}</h4>
                  <small style={{ color: "#0000005E" }}>
                    {userData?.userEmail}{" "}
                  </small>
                </div>
              </div>

              <FontAwesomeIcon icon={faAngleDown} onClick={handleShow}/>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
