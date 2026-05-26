import React, { useCallback, useContext, useState } from "react";
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
import { ProjectsAPI } from "../../../api";
import { toast } from "react-toastify";
import axios from "axios";
import DeleteConfirmation from "../../Shared/components/DeleteConfirmation/DeleteConfirmation";
import { AuthContext } from "../../../context/AuthContext";
import NoData from "../../Shared/components/NoData/NoData";
import Spinner from "../../Shared/components/Spinner/Spinner";

interface Task {
  id: number;
  title: string;
  status: string;
  creationDate: string;
}
interface Project {
  id: number;
  title: string;
  description: string;
  creationDate: string;
  task: Task[];
}

interface PaginatedResponse {
  pageNumber: number;
  pageSize: number;
  data: Project[];
  totalNumberOfRecords: number;
  totalNumberOfPages: number;
}

export default function ProjectsList() {
  const { userData } = useContext(AuthContext)!;
  const userRole = userData?.userGroup;

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [projectData, setProjectData] = useState<Project | null>(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (project: Project) => {
    setProjectData(project);
    setShow(true);
  };

  const fetchProjects = useCallback(() => {
    return userRole == "Employee"
      ? ProjectsAPI.GetProjectsByEmployee({ page: currentPage, size: pageSize })
      : ProjectsAPI.GetProjectsByManager({ page: currentPage, size: pageSize });
  }, [currentPage, pageSize, userRole]);

  const { data: paginationWrapper, isLoading, refetch } =
    useGetData<PaginatedResponse>(fetchProjects, [currentPage, pageSize]);

  const projects = paginationWrapper?.data || [];
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

  const deleteProject = async (projectId: number) => {
    try {
      await ProjectsAPI.DeleteProjectById(projectId);
      handleClose();
      refetch();
      toast.success("Project is deleted Successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to delete Project");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="d-flex flex-column h-100">

      {/* Page Header */}
      <div className="users-list-header d-flex justify-content-between align-items-center p-4 flex-shrink-0">
        <h3 style={{ color: "#0E382F" }}>Projects</h3>
        <button
          className="btn rounded-pill py-2 px-4 text-white"
          style={{
            backgroundColor: "#EF9B28",
            display: userRole == "Employee" ? "none" : "block",
          }}
          onClick={() => navigate("/dashboard/project-data")}
        >
          <FontAwesomeIcon icon={faPlus} /> Add New Project
        </button>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1 overflow-hidden py-3 px-4"
        style={{ backgroundColor: "#F5F5F5" }}
      >
        <div className="bg-white rounded-3 py-4 px-0 shadow-sm d-flex flex-column h-100">

          {/* Search & Filter */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 px-4 flex-shrink-0">
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
                  placeholder="Search"
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

          <DeleteConfirmation
            show={show}
            handleClose={handleClose}
            onDelete={deleteProject}
            item="Project"
            itemData={projectData}
          />

          {/* Table */}
          {isLoading ? (
            <Spinner />
          ) : (
            <div style={{ overflowY: "auto", flex: 1 }}>
              <Table striped hover className="align-middle custom-table mb-0">
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#fff",
                    zIndex: 1,
                  }}
                >
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Num Tasks</th>
                    <th>Date Created</th>
                    <th style={{ display: userRole == "Employee" ? "none" : "" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {totalResults > 0 ? (
                    projects.map((proj) => (
                      <tr key={proj?.id}>
                        <td>{proj?.title}</td>
                        <td>{proj?.description}</td>
                        <td>{proj?.task?.length || 0}</td>
                        <td>{proj?.creationDate}</td>
                        <td style={{ display: userRole == "Employee" ? "none" : "block" }}>
                          <div className="dropdown">
                            <button className="btn border-0" data-bs-toggle="dropdown">
                              <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                            <ul className="dropdown-menu border-0 shadow rounded-4">
                              <li>
                                <button className="dropdown-item">
                                  <FontAwesomeIcon color="green" icon={faEye} className="me-1" /> View
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => navigate(`/dashboard/project-data/${proj?.id}`)}
                                >
                                  <FontAwesomeIcon color="green" icon={faEdit} className="me-1" /> Edit
                                </button>
                              </li>
                              <li>
                                <button className="dropdown-item" onClick={() => handleShow(proj)}>
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
                      <td colSpan={5} className="no-data-row">
                        <NoData />
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          <div
            className="custom-table-footer mt-4 px-3 flex-shrink-0"
            style={{ display: totalResults <= 5 ? "none" : "block" }}
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
              <span>Page {currentPage} of {totalPages}</span>
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
  );
}