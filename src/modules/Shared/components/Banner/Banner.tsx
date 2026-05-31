/* eslint-disable react-hooks/set-state-in-effect */
import {faChartSimple,faClipboardList,faListCheck} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getTasksCount } from "../../../../api/modules/tasks";
import { useContext, useEffect, useState } from "react";
import { getUsersCount } from "../../../../api/modules/users";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { AuthContext } from "../../../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Banner() {
  const authContext = useContext(AuthContext);
  const isAdmin = authContext?.userData?.userGroup === "Manager";

  // TASKS
  const [tasksCount, setTasksCount] = useState({
    done: 0,
    inProgress: 0,
    toDo: 0,
  });

  // USERS
  const [usersCount, setUsersCount] = useState({
    activatedEmployeeCount: 0,
    deactivatedEmployeeCount: 0,
  });

  // TASKS CHART
  const tasksData = {
    labels: ["Todo", "Progress", "Done"],
    datasets: [
      {
        label: "# of Tasks",
        data: [tasksCount.toDo, tasksCount.inProgress, tasksCount.done],
        backgroundColor: [
          "rgba(244, 244, 229, 1)",
          "rgba(229, 230, 244, 1)",
          "rgba(244, 229, 237, 1)",
        ],
        borderColor: [
          "rgba(228, 228, 188, 1)",
          "rgba(207, 209, 236, 1)",
          "rgba(231, 195, 215, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // USERS CHART
  const usersData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        label: "# of Users",
        data: [
          usersCount.activatedEmployeeCount,

          usersCount.deactivatedEmployeeCount,
        ],
        backgroundColor: ["rgba(229, 230, 244, 1)", "rgba(244, 244, 229, 1)"],
        borderColor: ["rgba(207, 209, 236, 1)", "rgba(228, 228, 188, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // GET TASKS
  const getTasks = async () => {
    try {
      const response = await getTasksCount();
      setTasksCount({
        toDo: response.data.toDo,
        inProgress: response.data.inProgress,
        done: response.data.done,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "failed to fetch tasks");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // GET USERS
  const getUsers = async () => {
    try {
      const response = await getUsersCount();
      setUsersCount({
        activatedEmployeeCount: response.data.activatedEmployeeCount,
        deactivatedEmployeeCount: response.data.deactivatedEmployeeCount,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTasks();

    if (isAdmin) {
      getUsers();
    }
  }, []);

  return (
    <>
      <div className="banner my-3">
        <div className="row g-4">
          {/* TASKS */}
          <div className={isAdmin ? "col-12 col-xl-6" : "col-12"}>
            <div className="inner-banner bg-white rounded-4 shadow p-4 h-100">
              {/* TITLE */}
              <div className="banner-title">
                <h4>Tasks</h4>
                <p style={{ color: "#6F7881", }} >Track every task, hit every deadline.</p>
              </div>
              {/* CONTENT */}
              <div className="row mt-1 g-4 align-items-center">
                {/* CARDS */}
                <div className="col-12 col-lg-7">
                  <div className="row g-3">
                    {/* TODO */}
                    <div className="col-12 col-sm-6 col-lg-4">
                      <div
                        className="inner rounded-4 h-100"
                        style={{backgroundColor: "#F4F4E5",padding: "18px",minHeight: "140px"}}>
                        <div
                          className="d-flex align-items-center justify-content-center mb-4"
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "14px",
                            backgroundColor: "#E4E4BC",
                          }}
                        >
                          <FontAwesomeIcon icon={faClipboardList} style={{fontSize: "18px",color: "#6E6E49"}} />
                        </div>
                        <h6
                          className="mb-2"
                          style={{color: "#6F7881",fontSize: "14px"}}>
                            Todo
                        </h6>
                        <h4 className="mb-0" style={{color: "#0E382F"}}>
                          {tasksCount.toDo}
                        </h4>
                      </div>
                    </div>

                    {/* PROGRESS */}
                    <div className="col-12 col-sm-6 col-lg-4">
                      <div
                        className="inner rounded-4 h-100"
                        style={{backgroundColor: "#E5E6F4",padding: "18px",minHeight: "140px"}}>
                        <div
                          className="d-flex align-items-center justify-content-center mb-4"
                          style={{width: "48px",height: "48px",borderRadius: "14px",backgroundColor: "#CFD1EC"}}>
                          <FontAwesomeIcon
                            icon={faChartSimple}
                            style={{fontSize: "18px",color: "#5A6396"}}/>
                        </div>
                        <h6 className="mb-2" style={{color: "#6F7881",fontSize: "14px"}}>
                          Progress
                        </h6>
                        <h4
                          className="mb-0" style={{color: "#0E382F"}}>
                          {tasksCount.inProgress}
                        </h4>
                      </div>
                    </div>

                    {/* DONE */}
                    <div className="col-12 col-sm-6 col-lg-4">
                      <div
                        className="inner rounded-4 h-100"
                        style={{backgroundColor: "#F4E5ED",padding: "18px",minHeight: "140px"}}>
                        <div
                          className="d-flex align-items-center justify-content-center mb-4"
                          style={{width: "48px",height: "48px",borderRadius: "14px",backgroundColor: "#E7C3D7"}}>
                          <FontAwesomeIcon icon={faListCheck} style={{fontSize: "18px",color: "#8B5C72"}}/>
                        </div>
                        <h6 className="mb-2" style={{color: "#6F7881",fontSize: "14px"}}>
                          Done
                        </h6>
                        <h4 className=" mb-0" style={{color: "#0E382F"}}>
                          {tasksCount.done}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                {/* CHART */}
                <div className="col-12 col-lg-5 d-flex align-items-center justify-content-center mt-1">
                  <div style={{width: "100%",maxWidth: "300px",aspectRatio: "1 / 1"}}>
                    <Doughnut data={tasksData} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* USERS */}
          {isAdmin && (
            <div className="col-12 col-xl-6">
              <div className="inner-banner bg-white rounded-4 shadow p-4 h-100">
                {/* TITLE */}
                <div className="banner-title">
                  <h4>Users</h4>
                  <p style={{ color: "#6F7881",}} >Manage your team, all in one place.</p>
                </div>
                {/* CONTENT */}
                <div className="row mt-5 pb-4 g-4 align-items-center">
                  {/* CARDS */}
                  <div className="col-12 col-lg-6">
                    <div className="row g-3">
                      {/* ACTIVE */}
                      <div className="col-12 col-sm-6">
                        <div className="inner py-3 px-4 rounded-4 h-100" style={{ backgroundColor: "#E5E6F4" }} >
                          <span
                            style={{
                              width: "40px",
                              height: "40px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "30%",
                              backgroundColor: "#CFD1EC",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faChartSimple}
                              style={{width: "18px",height: "22px"}}/>
                          </span>
                          <h5 className="fs-6 pt-2" style={{color: "#6F7881"}}>Active</h5>
                          <h4>{usersCount.activatedEmployeeCount}</h4>
                        </div>
                      </div>
                      {/* INACTIVE */}
                      <div className="col-12 col-sm-6">
                        <div className="inner py-3 px-4 rounded-4 h-100" style={{ backgroundColor: "#F4F4E5", }} >
                          <span
                            style={{
                              width: "40px",
                              height: "40px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "30%",
                              backgroundColor: "#E4E4BC",
                            }}
                          >
                            <FontAwesomeIcon icon={faClipboardList} style={{ width: "18px", height: "22px" }} />
                          </span>
                          <h5 className="fs-6 pt-2" style={{ color: "#6F7881"}} >
                            Inactive
                          </h5>
                          <h4>{usersCount.deactivatedEmployeeCount}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* CHART */}
                  <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center">
                    <div style={{width: "100%",maxWidth: "300px",aspectRatio: "1 / 1"}}>
                      <Doughnut data={usersData} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
