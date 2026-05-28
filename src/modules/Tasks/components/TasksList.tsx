import React, { useCallback, useState } from "react";
import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEllipsisVertical,faChevronLeft,faChevronRight,faFilter,faEye,faPlus,faEdit, faMagnifyingGlass,} from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import useGetData from "../../../hooks/useGetData";
import { useNavigate } from "react-router-dom";
import { TasksAPI } from "../../../api";
import { toast } from "react-toastify";
import axios from "axios";
import DeleteConfirmation from "../../Shared/components/DeleteConfirmation/DeleteConfirmation";
import NoData from "../../Shared/components/NoData/NoData";
import Spinner from "../../Shared/components/Spinner/Spinner";
import ViewModal from "../../Shared/components/VIewModal/ViewModal";

interface Task {
  id: number;
  title: string;
  status: string;
  creationDate: string;
  modificationDate: string;
  description: string;

  employee: {
    userName: string;
    email: string;
  };

  project: {
    title: string;
    description: string;
  };
}

export interface PaginatedResponse {
  pageNumber: number;
  pageSize: number;
  data: Task[];
  totalNumberOfRecords: number;
  totalNumberOfPages: number;
}

export default function TasksList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [searchValue, setSearchValue] = useState("");
  const [taskData, setTaskData] = useState<Task | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (task: Task) => {
    setTaskData(task);
    setShowDelete(true);
  };

  const handleViewShow = (task: Task) => {
    setSelectedTask(task);
    setShowView(true);
  };
  const handleViewClose = () => setShowView(false);

  const fetchTasks = useCallback(() => {
    return TasksAPI.GetTasksByManager({page: currentPage,size: searchValue ? 1000 : pageSize});
  }, [currentPage, pageSize, searchValue]);

  const {data: paginationWrapper,isLoading,refetch} = useGetData<PaginatedResponse>
  (
    fetchTasks, 
    [currentPage,pageSize,searchValue]
  );

  const allTasks = paginationWrapper?.data || [];

  const filteredTasks = allTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      task.employee.userName
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      task.project.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      task.status.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const tasks = searchValue ? filteredTasks : allTasks;

  const totalResults = searchValue
    ? filteredTasks.length
    : paginationWrapper?.totalNumberOfRecords || 0;

  const totalPages = searchValue
    ? 1
    : paginationWrapper?.totalNumberOfPages || 1;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const deleteTask = async (taskId: number) => {
    try {
      await TasksAPI.DeleteTaskById(taskId);
      handleCloseDelete();
      refetch();
      toast.success("Task is deleted Successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to delete task");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      {/* PAGE HEADER */}
      <div className="users-list-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 p-4 flex-shrink-0">
        <h3 className="mb-0" style={{ color: "#0E382F" }}>Tasks</h3>
        <button
          className="btn rounded-pill py-2 px-4 text-white w-100"
          style={{backgroundColor: "#EF9B28",maxWidth: window.innerWidth >= 768 ? "fit-content" : "100%"}}
          onClick={() => navigate("/dashboard/task-data")}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" /> Add New Task
        </button>
      </div>
      {/* MAIN CONTENT */}
      <div className="flex-grow-1 overflow-hidden py-3 px-4" style={{backgroundColor: "#F5F5F5"}} >
        <div className="bg-white rounded-3 py-4 px-0 shadow-sm d-flex flex-column h-100">
          {/* SEARCH */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 px-4 flex-shrink-0">
            <div className="d-flex flex-column flex-sm-row gap-3 w-100 w-md-auto">
              <div
                className="d-flex align-items-center px-3 rounded-pill"
                style={{border: "1px solid #D9D9D9",width: "100%",maxWidth: "320px",height: "45px"}}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <input
                  type="text"
                  placeholder="Search"
                  className="border-0 ms-2 w-100"
                  style={{
                    outline: "none",
                  }}
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <button
                className="btn rounded-pill px-4"
                style={{border: "1px solid #D9D9D9",height: "45px"}}
              >
                <FontAwesomeIcon icon={faFilter} className="me-2" /> Filter
              </button>
            </div>
          </div>
          <DeleteConfirmation show={showDelete} handleClose={handleCloseDelete} onDelete={deleteTask} item="Task" itemData={taskData} />
          {/* TABLE / GRID */}
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              {/* DESKTOP TABLE */}

              <div className="d-none d-md-block" style={{overflowY: "auto",flex: 1}}>
                <Table striped hover className="align-middle custom-table mb-0">
                  <thead style={{position: "sticky",top: 0,backgroundColor: "#fff",zIndex: 1}}>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>User</th>
                      <th>Project</th>
                      <th>Date Created</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <tr key={task.id}>
                          <td>{task.title}</td>
                          <td>
                            <span
                              className="px-3 py-1 rounded-pill text-white small"
                              style={{
                                backgroundColor:task.status === "ToDo" ? "#E4E1F5" : task.status === "InProgress"
                                      ? "#EF9B28A3": "#009247"
                              }}
                            >
                              {task.status}
                            </span>
                          </td>
                          <td>{task.employee.userName}</td>
                          <td>{task.project.title}</td>
                          <td>{task?.creationDate? new Date(task?.creationDate).toLocaleDateString():"N/A"}</td>
                          <td>
                            <div className="dropdown">
                              <button className="btn border-0" data-bs-toggle="dropdown" >
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                              </button>
                              <ul className="dropdown-menu border-0 shadow rounded-4">
                                <li>
                                  <button className="dropdown-item" onClick={() =>handleViewShow(task)}>
                                    <FontAwesomeIcon color="green" icon={faEye} className="me-1" /> View
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() =>navigate(`/dashboard/task-data/${task.id}`,)}
                                  >
                                    <FontAwesomeIcon color="green" icon={faEdit} className="me-1" /> Edit
                                  </button>
                                </li>
                                <li>
                                  <button className="dropdown-item" onClick={() => handleShowDelete(task)} >
                                    <FontAwesomeIcon color="green" icon={faTrashCan} className="me-1" /> Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="no-data-row">
                          <NoData item="Tasks" />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              {/* MOBILE GRID */}
              <div className="d-block d-md-none px-3 pb-3" style={{overflowY: "auto",flex: 1,minHeight: 0,}} >
                <div className="row g-3">
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <div key={task.id} className="col-12">
                        <div className="border rounded-4 p-3 shadow-sm grid-card">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h5 className="mb-0 text-success" style={{ color: "#0E382F", }} >{task.title}</h5>
                            <div className="dropdown">
                              <button className="btn border-0 p-0" data-bs-toggle="dropdown" >
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                              </button>
                              <ul className="dropdown-menu border-0 shadow rounded-4">
                                <li>
                                  <button className="dropdown-item" onClick={() =>handleViewShow(task)}>
                                    <FontAwesomeIcon color="green" icon={faEye} className="me-1" /> View
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => navigate( `/dashboard/task-data/${task.id}`)}
                                  >
                                    <FontAwesomeIcon color="green" icon={faEdit} className="me-1" /> Edit
                                  </button>
                                </li>
                                <li>
                                  <button className="dropdown-item" onClick={() => handleShowDelete(task)} >
                                    <FontAwesomeIcon color="green" icon={faTrashCan} className="me-1"/> Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="mb-2">
                            <span className="fw-bold">Status:</span>{" "}
                            <span
                              className="px-2 py-1 rounded-pill text-white small"
                              style={{backgroundColor:task.status === "ToDo"? "#E4E1F5": task.status === "InProgress" ?
                                       "#EF9B28A3": "#009247",
                              }}
                            >
                              {task.status}
                            </span>
                          </div>
                          <div className="mb-2">
                            <span className="fw-bold">User:</span>{" "}
                            {task.employee.userName}
                          </div>
                          <div className="mb-2">
                            <span className="fw-bold">Project:</span>{" "}
                            {task.project.title}
                          </div>
                          <div>
                            <span className="fw-bold">Created:</span>{" "}
                            {task?.creationDate? new Date(task?.creationDate).toLocaleDateString():"N/A"}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <NoData item="Tasks" />
                  )}
                </div>
              </div>
            </>
          )}
          {/* View Details */}
          <ViewModal show={showView} handleClose={handleViewClose} title="Task Details"
            fields={[
              {label: "Title", value: selectedTask?.title},
              {label: "Description", value: selectedTask?.description},
              {label: "Status", value: selectedTask?.status},
              {label: "Creation Date", value:selectedTask?.modificationDate? new Date(selectedTask?.modificationDate).toLocaleDateString():"N/A"},
              {label: "Modification Date", value:selectedTask?.creationDate? new Date(selectedTask?.creationDate).toLocaleDateString():"N/A"},
              {label: "User Name", value:selectedTask?.employee?.userName},
              {label: "User Email", value:selectedTask?.employee?.email},
              {label: "Project", value:selectedTask?.project?.title},
              {label: "Project Description", value:selectedTask?.project?.description}
            ]}
          />
          {/* PAGINATION */}
          <div
            className="custom-table-footer mt-4 px-3 flex-shrink-0"
            style={{display: !searchValue && totalResults > 5 ? "block" : "none"}}
          >
            <div className="d-flex justify-content-center justify-content-md-end align-items-center flex-wrap gap-2">
              <span>Showing</span>
              <select
                className="form-select rounded-pill"
                style={{ width: "85px" }}
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span>of {totalResults} Results</span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn border-0 p-1"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  style={{opacity: currentPage === 1 ? 0.4 : 1}}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                  className="btn border-0 p-1"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  style={{opacity: currentPage >= totalPages ? 0.4 : 1}}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}