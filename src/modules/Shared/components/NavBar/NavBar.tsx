import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import navbarLogo from "../../../../assets/navbarLogo.png";
import PersonalImg from "../../../../assets/personalImg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faAngleDown,faBell,faGlobe,faMobileScreen,faUser} from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { faIdBadge } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext)!;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body
          className="py-4 px-3 rounded-3"
          style={{backgroundColor: "#F8F9FA"}}
        >
          <div className="text-center">
            <img
              src={userData?.imagePath || PersonalImg}
              className="rounded-circle img-fluid"
              alt="personal image"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
              }}
            />
            <h5
              className="mt-3 mb-1 fw-bold"
              style={{color: "#0E382F"}}>
              {userData?.userName}
            </h5>
            <p
              className="mb-0 text-muted small"
              style={{wordBreak: "break-word"}} >
              {userData?.userEmail}
            </p>
          </div>
          <div className="mt-4 d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 gap-2">
              <span className="fw-semibold text-success">Role</span>
              <span
                className="text-muted text-end"
                style={{
                  wordBreak: "break-word",
                }}
              >
                <FontAwesomeIcon className="me-2" icon={faUser} />
                {userData?.userGroup}
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 gap-2">
              <span className="fw-semibold text-success">ID</span>

              <span className="text-muted text-end">
                <FontAwesomeIcon className="me-2" icon={faIdBadge} />

                {userData?.userId}
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 gap-2">
              <span className="fw-semibold text-success">Country</span>

              <span className="text-muted text-end">
                <FontAwesomeIcon className="me-2" icon={faGlobe} />

                {userData?.country}
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 gap-2">
              <span className="fw-semibold text-success">Phone</span>

              <span
                className="text-muted text-end"
                style={{
                  wordBreak: "break-word",
                }}
              >
                <FontAwesomeIcon className="me-2" icon={faMobileScreen} />
                {userData?.phoneNumber}
              </span>
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row gap-2 mt-4">
            <Button
              className="border-0 w-100"
              style={{
                backgroundColor: "#EF9B28",
              }}
              onClick={() => navigate("/change-pass")}
            >
              Change Password
            </Button>
            <Button variant="secondary" className="w-100" onClick={handleClose}>
              Close
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <Navbar expand="lg" className="bg-body-tertiary border-bottom">
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
                className="divider mx-3 d-none d-md-block"
                style={{
                  width: "1px",
                  height: "40px",
                  backgroundColor: "#9A9A9A",
                }}
              ></div>

              <div className="d-flex align-items-center justify-content-center">
                <img
                  src={userData?.imagePath || PersonalImg}
                  onError={(e) => {
                    e.currentTarget.src = PersonalImg;
                  }}
                  className="col-3 rounded rounded-5"
                  alt="personal image"
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
                <div className="ms-2 ">
                  <h4 className="h6 mb-0">{userData?.userName}</h4>
                  <small style={{ color: "#0000005E" }}>
                    {userData?.userEmail}{" "}
                  </small>
                </div>
              </div>
              <FontAwesomeIcon
                icon={faAngleDown}
                style={{ cursor: "pointer" }}
                onClick={handleShow}
              />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
