import React, { useCallback, useState } from "react";
import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faChevronLeft,
  faChevronRight,
  faFilter,
  faEye,
  faPlus,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import useGetData from "../../../hooks/useGetData";
import { useNavigate } from "react-router-dom";
import { TasksAPI } from "../../../api";
import { toast } from "react-toastify";
import axios from "axios";
import DeleteConfirmation from "../../Shared/components/DeleteConfirmation/DeleteConfirmation";

interface Task {
  id: number;
  title: string;
  status: string;
  creationDate: string;
  employee:{
    userName: string;
  };
  project:{
    title: string;
  }
}

interface PaginatedResponse {
  pageNumber: number;
  pageSize: number;
  data: Task[];
  totalNumberOfRecords: number;
  totalNumberOfPages: number;
}

export default function TasksList() {

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [taskData , setTaskData] = useState<Task | null>(null);


  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (task:Task) =>{ 
    setTaskData(task)
    setShow(true);
  }

  const fetchTasks = useCallback(() => {
  return TasksAPI.GetTasksByManager({ page: currentPage, size: pageSize });
}, [currentPage, pageSize]);

const { data: paginationWrapper, isLoading, refetch } = useGetData<PaginatedResponse>(
  fetchTasks, 
  [currentPage, pageSize]
);

  const tasks = paginationWrapper?.data || [];
  const totalResults = paginationWrapper?.totalNumberOfRecords || 0;
  const totalPages = paginationWrapper?.totalNumberOfPages || 1;

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); 
  };

  const deleteTask = async(taskId: number)=>{
    try {
      await TasksAPI.DeleteTaskById(taskId);
      handleClose();
      refetch();
      toast.success('Task is deleted Successfully!')
    } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Failed to delete task");
        } else {
          toast.error("Something went wrong");
        }
      }
  }
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="users-list-header d-flex justify-content-between align-items-center p-4">
            <h3 style={{ color: "#0E382F" }}>Tasks</h3>
            <button 
              className="btn rounded-pill py-2 px-4 text-white" 
              style={{backgroundColor:'#EF9B28'}}
              onClick={()=>navigate("/dashboard/task-data")}
              >
                <FontAwesomeIcon icon={faPlus} /> Add New Task
            </button>
          </div>
          <div
            className="container-fluid py-4 px-4"
            style={{ backgroundColor: "#F5F5F5", minHeight: "100vh" }}
          >
            <div className="bg-white rounded-3 py-4 px-0 shadow-sm">
              {/* Header Elements */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 px-4">
                <div className="d-flex flex-column flex-sm-row gap-3 w-100 w-md-auto">
                  <div
                    className="d-flex align-items-center px-3 rounded-pill"
                    style={{
                      border: "1px solid #D9D9D9",
                      width: "100%",
                      maxWidth: "320px",
                      height: "45px",
                    }}
                  >
                    <i className="fa-solid fa-magnifying-glass text-secondary"></i>
                    <input
                      type="text"
                      placeholder="Search Users"
                      className="border-0 ms-2 w-100"
                      style={{ outline: "none" }}
                    />
                  </div>
                  <button
                    className="btn rounded-pill px-4"
                    style={{ border: "1px solid #D9D9D9", height: "45px" }}
                  >
                    <FontAwesomeIcon icon={faFilter} className="me-2" />
                    Filter
                  </button>
                </div>
              </div>
              <DeleteConfirmation show={show} handleClose={handleClose} onDelete={deleteTask} item='Task' itemData={taskData}/>
              {/* Table Loader and Core Layout */}
              {isLoading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "500px" }}
                >
                  <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <Table striped hover responsive className="align-middle custom-table users-table">
                  <thead>
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
                    {tasks.map((task) => (
                      <tr key={task.id}>
                        <td>{task.title}</td>
                        <td>
                          <span
                            className="px-3 py-1 rounded-pill text-white small"
                            style={{
                              backgroundColor: task.status == 'ToDo' ? "#198754" : "#C97A7A",
                            }}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td>{task.employee.userName}</td>
                        <td>{task.project.title}</td>
                        <td>{task.creationDate}</td>
                        <td>
                          <div className="dropdown">
                            <button className="btn border-0" data-bs-toggle="dropdown">
                              <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                            <ul className="dropdown-menu border-0 shadow rounded-4">
                              <li>
                               <button className="dropdown-item">
                                  <FontAwesomeIcon color="green" icon={faEye} className="me-1"/> View
                                </button>
                              </li>
                              <li>
                               <button className="dropdown-item" onClick={()=>navigate(`/dashboard/task-data/${task.id}`)}>
                                  <FontAwesomeIcon color="green" icon={faEdit} className="me-1"/> Edit
                                </button>
                              </li>
                              <li>
                                <button className="dropdown-item" onClick={()=>handleShow(task)}>
                                  <FontAwesomeIcon color="green" icon={faTrashCan} className="me-1"/> Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              <div className="users-footer mt-4 px-3">
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
                      style={{ opacity: currentPage === 1 ? 0.4 : 1 }}
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button
                      className="btn border-0 p-1"
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages}
                      style={{ opacity: currentPage >= totalPages ? 0.4 : 1 }}
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}