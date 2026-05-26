import { useContext, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-regular-svg-icons";
import {
  faAngleLeft,
  faAngleRight,
  faArrowRightFromBracket,
  faDiagramProject,
  faListCheck,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  // modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const logout = () => {
    localStorage.removeItem("token");
    authContext?.setUserData(null);
    navigate("/login");
  };

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isAdmin = authContext?.userData?.userGroup === 'Manager';
  
  return (
    <>
    {/* modal */}

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body className="h4 py-5 text-center">Are you sure you need to logout <span className="text-danger fs-3">!!</span> </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => {
            logout();
            setShow(false);
          }}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>

      {/* sidebar */}
      <div className="sidebar-container position-relative">
        <Sidebar collapsed={isCollapsed}>
          <Menu
            className="mt-5"
            menuItemStyles={{
              button: {
                [`&.active`]: {
                  backgroundColor: "transparent",
                  color: "var(--primary-color)",
                },
              },
            }}
          >
            <MenuItem
              icon={<FontAwesomeIcon icon={faHouse} />}
              component={<NavLink to="/dashboard" end />}
            >
              {" "}
              Home{" "}
            </MenuItem>

           {isAdmin ? <MenuItem
              icon={<FontAwesomeIcon icon={faUsers} />}
              component={<NavLink to="/dashboard/users" />}
            >
              {" "}
              Users{" "}
            </MenuItem> : ''}

            <MenuItem
              icon={<FontAwesomeIcon icon={faDiagramProject} />}
              component={<NavLink to="/dashboard/projects" />}
            >
              {" "}
              Projects{" "}
            </MenuItem>
            <MenuItem
              icon={<FontAwesomeIcon icon={faListCheck} />}
              component={<NavLink to={isAdmin ? "/dashboard/tasks" : "/dashboard/task-board"} />}
            >
              {" "}
              Tasks{" "}
            </MenuItem>
            <MenuItem
              icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />}
              onClick={handleShow}
            >
              {" "}
              Logout{" "}
            </MenuItem>
          </Menu>
        </Sidebar>

        {isCollapsed ? (
          <span
            onClick={() => {
              toggleCollapsed();
            }}
            className="d-flex align-items-center justify-content-center pointer "
            style={{
              height: "32px",
              width: "16px",
              backgroundColor: "var(--primary-color)",
              position: "absolute",
              right: "-15px",
              top: "15px",
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
              zIndex: 1111,
            }}
          >
            <FontAwesomeIcon icon={faAngleRight} style={{ color: "white" }} />
          </span>
        ) : (
          <span
            onClick={() => {
              toggleCollapsed();
            }}
            className="d-flex align-items-center justify-content-center pointer "
            style={{
              height: "32px",
              width: "16px",
              backgroundColor: "var(--primary-color)",
              position: "absolute",
              right: "1px",
              top: "15px",
              borderTopLeftRadius: "8px",
              borderBottomLeftRadius: "8px",
              zIndex: 1111,
            }}
          >
            <FontAwesomeIcon icon={faAngleLeft} style={{ color: "white" }} />
          </span>
        )}
      </div>
    </>
  );
}
