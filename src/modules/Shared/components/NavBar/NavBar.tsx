import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import navbarLogo from "../../../../assets/navbarLogo.png";
import PersonalImg from "../../../../assets/personalImg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faBell } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { getCurrentUser } from "../../../../api/modules/users";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface UserInfo {
  id: number;
  userName: string;
  email: string;
  country: string;
  phoneNumber: string;
  imagePath?: string;
  group : {
    id: number,
    name: string
  }
}

export default function NavBar() {
  const { userData } = useContext(AuthContext)!;
  const [userImage, setUserImage] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getUser = async () => {
    try {
      const response = await getCurrentUser();
      const path = response.data.imagePath;
      setUserInfo(response.data);
      setUserImage(path && `https://upskilling-egypt.com:3003/${path}`);
     
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      {/* modal */}
     
      <Modal show={show} onHide={handleClose} centered size="lg">
        
        <Modal.Body className="py-5 px-3">
          <div className="row">
            <div className="col-md-4">
              <div className="inner d-flex align-items-center justify-content-center">
                <img
                  src={`https://upskilling-egypt.com:3003/${userImage}` || PersonalImg}
                  className="w-75 h-25 "
                  alt="personal image"
                  style={{ width: "50px", height: "50px" }}
                />
              </div>
            </div>

            <div className="col-md-8 mt-4">
              <h6 className="fw-bold fs-5" style={{color: '#1a6657'}}> <span style={{color: '#EF9B28', fontWeight: 'bold', fontSize: '19px'}}> UserName : </span> {userInfo?.userName} </h6>
              <span className="d-block fw-bold fs-5" style={{color: '#1a6657'}}><span style={{color: '#EF9B28', fontWeight: 'bold', fontSize: '19px'}}> UserRole : </span>  {userInfo?.group.name} </span>
              <span className="fw-bold fs-5" style={{color: '#1a6657'}}> <span style={{color: '#EF9B28', fontWeight: 'bold', fontSize: '19px'}}> Email : </span> {userInfo?.email}</span>
              <span className="d-block fw-bold fs-5" style={{color: '#1a6657'}}><span style={{color: '#EF9B28', fontWeight: 'bold', fontSize: '19px'}}> UserId : </span> {userInfo?.id}</span>
              <span className="d-block py-1 fw-bold fs-5" style={{color: '#1a6657'}}><span style={{color: '#EF9B28', fontWeight: 'bold', fontSize: '19px'}}> Country : </span> {userInfo?.country} </span>
              <span className="d-block fw-bold fs-5" style={{color: '#1a6657'}}><span style={{color: '#EF9B28', fontWeight: 'bold', fontSize: '19px'}}> Phone Number : </span> {userInfo?.phoneNumber} </span>

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
                  src={userImage || PersonalImg}
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
