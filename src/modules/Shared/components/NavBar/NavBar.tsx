import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import navbarLogo from "../../../../assets/navbarLogo.png";
import PersonalImg from "../../../../assets/personalImg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faBell } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";



export default function NavBar() {
  const { userData } = useContext(AuthContext)!;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  return (
    <>
      {/* modal */}
     
      <Modal show={show} onHide={handleClose} centered size="lg">
        
        <Modal.Body className="py-5 px-3">
          <div className="row">
            <div className="col-md-4">
              <div className="inner d-flex align-items-center justify-content-center">
                <img
                  src={userData?.imagePath || PersonalImg}
                  className="w-75 h-25 rounded rounded-3 "
                  alt="personal image"
                  style={{ width: "300px", height: "200px", objectFit: "cover" }}
                />
              </div>
            </div>

            <div className="col-md-8 mt-4 py-5">
              <span className=" info" > <span className="profile-info"> UserName : </span> {userData?.userName} </span>
              <span className=" info py-1" ><span className="profile-info"> UserRole : </span>  {userData?.userGroup} </span>
              <span className="info"> <span className="profile-info"> Email : </span> {userData?.userEmail}</span>
              <span className=" info py-1"><span className="profile-info"> UserId : </span> {userData?.userId}</span>
              <span className="  info"><span className="profile-info"> Country : </span> {userData?.country} </span>
              <span className="info pt-1"><span className="profile-info"> Phone Number : </span> {userData?.phoneNumber} </span>

            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
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
