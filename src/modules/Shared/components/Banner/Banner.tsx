import {
  faChartSimple,
  faClipboardList,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getTasksCount } from "../../../../api/modules/tasks";
import { useEffect, useState } from "react";
import { getUsersCount } from "../../../../api/modules/users";
import { toast } from "react-toastify";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Banner() {
  //tasks
  const [tasksCount, setTasksCount] = useState({
    done: 0,
    inProgress: 0,
    toDo: 0,
  });
  // users
  const [usersCount, setUsersCount] = useState({
    activatedEmployeeCount: 0,
    deactivatedEmployeeCount: 0,
  });
  // tasks chart
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

  // users chart
  const usersData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        label: "# of Users",
        data: [usersCount.activatedEmployeeCount, usersCount.deactivatedEmployeeCount],
        backgroundColor: [
         "rgba(229, 230, 244, 1)",
          "rgba(244, 244, 229, 1)"
        ],
        borderColor: [
          "rgba(207, 209, 236, 1)",
          "rgba(228, 228, 188, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
 
  const getTasks = async () => {
    try {
      const response = await getTasksCount();
      setTasksCount({
        toDo: response.data.toDo,
        inProgress: response.data.inProgress,
        done: response.data.done,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // get users

  const getUsers = async () => {
    try {
      const response = await getUsersCount();
      console.log(response);
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
    getUsers();
  }, []);

  return (
    <>
      <div className="banner bg-white position-relative mt-3">
        <div className="row">
          <div className="col-md-6">
            <div className="inner-banner bg-white rounded rounded-4 shadow p-4">
              <div className="banner-title">
                <h4>Tasks</h4>
                <p style={{ color: "#6F7881" }}>
                  Track every task, hit every deadline.
                </p>
              </div>

              <div className="d-flex mt-3">
                <div className="col-md-6">
                  <div className="col-md-6">
                    <div
                      className="inner py-3 px-4 rounded rounded-4"
                      style={{ backgroundColor: "#F4F4E5" }}
                    >
                      <span
                        className=""
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
                        <FontAwesomeIcon
                          icon={faClipboardList}
                          style={{ width: "18px", height: "22px" }}
                        />
                      </span>

                      <h5 className="fs-6 pt-2" style={{ color: "#6F7881" }}>
                        Todo
                      </h5>
                      <span>{tasksCount.toDo}</span>
                    </div>
                  </div>

                  <div className="col-md-6 my-1">
                    <div
                      className="inner py-3 px-4 rounded rounded-4"
                      style={{ backgroundColor: "#E5E6F4" }}
                    >
                      <span
                        className=""
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
                          style={{ width: "18px", height: "22px" }}
                        />
                      </span>
                      <h5
                        className="fs-6 pt-2 d-block"
                        style={{ color: "#6F7881" }}
                      >
                        Progress
                      </h5>
                      <span>{tasksCount.inProgress}</span>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div
                      className="inner py-3 px-4 rounded rounded-4"
                      style={{ backgroundColor: "#F4E5ED" }}
                    >
                      <span
                        className=""
                        style={{
                          width: "40px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "30%",
                          backgroundColor: "#E7C3D7",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faListCheck}
                          style={{ width: "18px", height: "22px" }}
                        />
                      </span>
                      <h5 className="fs-6 pt-2" style={{ color: "#6F7881" }}>
                        Done
                      </h5>
                      <span>{tasksCount.done}</span>
                    </div>
                  </div>
                </div>

                <div
                  style={{ width: "300px", height: "300px" }}
                  className="chart col-md-6 d-flex align-items-center justify-content-center mt-5 pe-5"
                >
                  <Doughnut data={tasksData} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6" >
            <div className="inner-banner bg-white rounded rounded-4 shadow p-4">
              <div className="banner-title">
                <h4>Users</h4>
                <p style={{ color: "#6F7881" }}>
                  Manage your team, all in one place.
                </p>
              </div>

              <div className="d-flex mt-5 pb-4">
             <div className="col-md-6">
                   <div className="col-md-6">
                  <div
                    className="inner py-3 px-4 rounded rounded-4"
                    style={{ backgroundColor: "#E5E6F4" }}
                  >
                    <span
                      className=""
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
                        style={{ width: "18px", height: "22px" }}
                      />
                    </span>
                    <h5 className="fs-6 pt-2" style={{ color: "#6F7881" }}>
                      active
                    </h5>
                    <span>{usersCount.activatedEmployeeCount}</span>
                  </div>
                </div>

                <div className="col-md-6 mt-4">
                  <div
                    className="inner py-3 px-4 rounded rounded-4"
                    style={{ backgroundColor: "#F4F4E5" }}
                  >
                    <span
                      className=""
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
                      <FontAwesomeIcon
                        icon={faClipboardList}
                        style={{ width: "18px", height: "22px" }}
                      />
                    </span>
                    <h5
                      className="fs-6 pt-2 d-block"
                      style={{ color: "#6F7881" }}
                    >
                      inactive
                    </h5>
                    <span>{usersCount.deactivatedEmployeeCount}</span>
                  </div>
                </div>

             </div>
             
                <div  style={{ width: "300px", height: "300px" }}
                  className="users-chart col-md-6 d-flex align-items-center justify-content-center mt-5 pe-5">
                    <Doughnut data={usersData}/>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
