import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-regular-svg-icons";
import {faAngleLeft,faAngleRight,faArrowRightFromBracket,faDiagramProject,faListCheck,faUsers} from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
export default function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
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

  const isAdmin = authContext?.userData?.userGroup === "Manager";

  // CLOSE MOBILE SIDEBAR WHEN SCREEN BECOMES LARGE
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setToggled(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}

      {!toggled && (
        <span
          onClick={() => setToggled(true)}
          className="d-flex d-md-none align-items-center justify-content-center pointer"
          style={{
            height: "32px",
            width: "16px",
            backgroundColor: "var(--primary-color)",
            position: "fixed",
            left: "0",
            top: "90px",
            borderTopRightRadius: "8px",
            borderBottomRightRadius: "8px",
            zIndex: 1000,
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon
            icon={faAngleRight}
            style={{
              color: "white",
              fontSize: "12px",
            }}
          />
        </span>
      )}

      {/* LOGOUT MODAL */}

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton />

        <Modal.Body className="h4 py-5 text-center">
          Are you sure you need to logout{" "}
          <span className="text-danger fs-3">!!</span>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={() => {
              logout();

              setShow(false);
            }}
          >
            Logout
          </Button>
        </Modal.Footer>
      </Modal>

      {/* SIDEBAR */}

      <div className="sidebar-container position-relative">
        <Sidebar
          collapsed={isCollapsed}
          breakPoint="md"
          toggled={toggled}
          onBackdropClick={() => setToggled(false)}
          backgroundColor="#0E382F"
          rootStyles={{
            height: "calc(100vh - 70px)",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            zIndex: 1600,
          }}
        >
          {/* MOBILE CLOSE BUTTON */}

          <div className="d-flex d-md-none justify-content-end py-3">
            <span
              onClick={() => setToggled(false)}
              className="d-flex align-items-center justify-content-center pointer"
              style={{
                height: "32px",
                width: "16px",
                backgroundColor: "var(--primary-color)",
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius: "8px",
                cursor: "pointer",
              }}
            >
              <FontAwesomeIcon
                icon={faAngleLeft}
                style={{
                  color: "white",
                  fontSize: "12px",
                }}
              />
            </span>
          </div>

          <Menu
            className="mt-2"
            menuItemStyles={{
              button: {
                paddingBlock: "12px",

                [`&.active`]: {
                  backgroundColor: "rgba(239,155,40,0.15)",

                  color: "var(--primary-color)",

                  borderLeft: "4px solid var(--primary-color)",
                },

                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.05)",
                },
              },
            }}
          >
            <MenuItem
              icon={<FontAwesomeIcon icon={faHouse} />}
              component={<NavLink to="/dashboard" end />}
              onClick={() => setToggled(false)}
            >
              Home
            </MenuItem>
            {isAdmin && (
              <MenuItem
                icon={<FontAwesomeIcon icon={faUsers} />}
                component={<NavLink to="/dashboard/users" />}
                onClick={() => setToggled(false)}
              >
                Users
              </MenuItem>
            )}
            <MenuItem
              icon={<FontAwesomeIcon icon={faDiagramProject} />}
              component={<NavLink to="/dashboard/projects" />}
              onClick={() => setToggled(false)}
            >
              Projects
            </MenuItem>
            <MenuItem
              icon={<FontAwesomeIcon icon={faListCheck} />}
              component={
                <NavLink
                  to={isAdmin ? "/dashboard/tasks" : "/dashboard/task-board"}
                />
              }
              onClick={() => setToggled(false)}
            >
              {isAdmin? "Tasks" : "My Tasks"}
            </MenuItem>

            <MenuItem
              icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />}
              onClick={handleShow}
            >
              Logout
            </MenuItem>
          </Menu>
        </Sidebar>

        {/* DESKTOP COLLAPSE BUTTON */}

        <div className="d-none d-md-block">
          {isCollapsed ? (
            <span
              onClick={toggleCollapsed}
              className="d-flex align-items-center justify-content-center pointer"
              style={{
                height: "32px",
                width: "16px",
                backgroundColor: "var(--primary-color)",
                position: "absolute",
                right: "-15px",
                top: "15px",
                borderTopRightRadius: "8px",
                borderBottomRightRadius: "8px",
                zIndex: 1700,
              }}
            >
              <FontAwesomeIcon
                icon={faAngleRight}
                style={{
                  color: "white",
                }}
              />
            </span>
          ) : (
            <span
              onClick={toggleCollapsed}
              className="d-flex align-items-center justify-content-center pointer"
              style={{
                height: "32px",
                width: "16px",
                backgroundColor: "var(--primary-color)",
                position: "absolute",
                right: "1px",
                top: "15px",
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius: "8px",
                zIndex: 1700,
              }}
            >
              <FontAwesomeIcon
                icon={faAngleLeft}
                style={{
                  color: "white",
                }}
              />
            </span>
          )}
        </div>
      </div>
    </>
  );
}
