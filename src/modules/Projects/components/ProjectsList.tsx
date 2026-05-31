import React, { useCallback, useContext, useState } from "react";
import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEllipsisVertical,faChevronLeft,faChevronRight,faFilter,faEye,faPlus,faEdit,faMagnifyingGlass,} from "@fortawesome/free-solid-svg-icons";
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
import ViewModal from "../../Shared/components/VIewModal/ViewModal";

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
  modificationDate: string;
  task: Task[];
  manager:{
    userName : string;
    email: string
  }
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
  const [searchValue, setSearchValue] = useState("");
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleDeleteClose = () => setShowDelete(false);
  const handleDeleteShow = (project: Project) => {
    setProjectData(project);
    setShowDelete(true);
  };

  const handleViewShow = async(project: Project) => {
    try {
      const response = await ProjectsAPI.GetProjectById(project?.id);
      setSelectedProject(response.data);
      setShowView(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleViewClose = () => setShowView(false);

  const fetchProjects = useCallback(() => {
    return userRole == "Employee"
      ? ProjectsAPI.GetProjectsByEmployee({page: currentPage,size: searchValue ? 1000 : pageSize})
      : ProjectsAPI.GetProjectsByManager({page: currentPage,size: searchValue ? 1000 : pageSize});
  }, [currentPage, pageSize, userRole, searchValue]);

  const {data: paginationWrapper,isLoading,refetch,} = useGetData<PaginatedResponse>
  (
    fetchProjects, 
    [currentPage,pageSize,searchValue]
  );

  const allProjects = paginationWrapper?.data || [];

  // SEARCH FILTER
  const filteredProjects = allProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      project.description.toLowerCase().includes(searchValue.toLowerCase()),
  );

  // NORMAL PAGINATION IF NO SEARCH
  const projects = searchValue ? filteredProjects : allProjects;
  const totalResults = searchValue
    ? filteredProjects.length
    : paginationWrapper?.totalNumberOfRecords || 0;

  const totalPages = searchValue
    ? 1
    : paginationWrapper?.totalNumberOfPages || 1;

  // PAGINATION
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

  // DELETE PROJECT
  const deleteProject = async (projectId: number) => {
    setDeleteLoading(true);
    try {
      await ProjectsAPI.DeleteProjectById(projectId);
      handleDeleteClose();
      refetch();
      toast.success("Project is deleted Successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to delete Project",
        );
      } else {
        toast.error("Something went wrong");
      }
    }finally{
      setDeleteLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      {/* PAGE HEADER */}
      <div className="users-list-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 p-4 flex-shrink-0">
        <h3 className="mb-0" style={{ color: "#0E382F", }} >Projects</h3>
        {userRole !== "Employee" && (
          <button
            className="btn rounded-pill py-2 px-4 text-white w-100"
            style={{
              backgroundColor: "#EF9B28",
              maxWidth: window.innerWidth >= 768 ? "fit-content" : "100%",
            }}
            onClick={() => navigate("/dashboard/project-data")}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" /> Add New Project
          </button>
        )}
      </div>
      {/* CONTENT */}
      <div
        className="flex-grow-1 overflow-hidden py-3 px-4"
        style={{backgroundColor: "#F5F5F5"}}
      >
        <div className="bg-white rounded-3 py-4 px-0 shadow-sm d-flex flex-column h-100">
          {/* SEARCH */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 px-4 flex-shrink-0">
            <div className="d-flex flex-column flex-sm-row gap-3 w-100">
              <div
                className="d-flex align-items-center px-3 rounded-pill"
                style={{border: "1px solid #D9D9D9",width: "100%",maxWidth: "320px",height: "45px"}}>
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
              {/* FILTER BUTTON */}
              <button
                className="btn rounded-pill px-4"
                style={{border: "1px solid #D9D9D9",height: "45px"}}
              >
                <FontAwesomeIcon icon={faFilter} className="me-2" />
                Filter
              </button>
            </div>
          </div>
          {/* DELETE MODAL */}
          <DeleteConfirmation isLoading={deleteLoading} show={showDelete} handleClose={handleDeleteClose} onDelete={deleteProject} item="Project" itemData={projectData} />
          {/* TABLE */}
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="d-none d-md-block" style={{overflowY: "auto",flex: 1}} >
                <Table striped hover className="align-middle custom-table mb-0">
                  <thead style={{position: "sticky",top: 0,backgroundColor: "#fff",zIndex: 1}}>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Num Tasks</th>
                      <th>Date Created</th>
                      <th style={{display: userRole == "Employee" ? "none" : ""}}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.length > 0 ? (
                      projects.map((proj) => (
                        <tr key={proj?.id}>
                          <td>{proj?.title}</td>
                          <td>{proj?.description}</td>
                          <td>{proj?.task?.length || 0}</td>
                          <td>{proj?.creationDate? new Date(proj?.creationDate).toLocaleDateString():"N/A"}</td>
                          <td style={{display:userRole == "Employee" ? "none" : "block"}}>
                            <div className="dropdown">
                              <button className="btn border-0" data-bs-toggle="dropdown" >
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                              </button>
                              <ul className="dropdown-menu border-0 shadow rounded-4">
                                <li>
                                  <button className="dropdown-item" onClick={() => handleViewShow(proj)}>
                                    <FontAwesomeIcon color="green" icon={faEye} className="me-1" /> View
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() =>navigate(`/dashboard/project-data/${proj?.id}`)}
                                  >
                                    <FontAwesomeIcon color="green" icon={faEdit} className="me-1" /> Edit
                                  </button>
                                </li>
                                <li>
                                  <button className="dropdown-item" onClick={() => handleDeleteShow(proj)} >
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
                          <NoData item="Projects" />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              {/* MOBILE GRID */}
              <div
                className="d-block d-md-none px-3 pb-3"
                style={{overflowY: "auto",flex: 1,minHeight: 0}}>
                <div className="row g-3">
                  {projects.length > 0 ? (
                    projects.map((proj) => (
                      <div key={proj.id} className="col-12">
                        <div className="border rounded-4 p-3 shadow-sm grid-card">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h5 className="mb-0 text-success" style={{ color: "#0E382F"}} >
                              {proj.title}
                            </h5>
                            {userRole !== "Employee" && (
                              <div className="dropdown">
                                <button className="btn border-0 p-0" data-bs-toggle="dropdown" >
                                  <FontAwesomeIcon icon={faEllipsisVertical} />
                                </button>
                                <ul className="dropdown-menu border-0 shadow rounded-4">
                                  <li>
                                    <button className="dropdown-item" onClick={() => handleViewShow(proj)}>
                                      <FontAwesomeIcon color="green" icon={faEye} className="me-1"/> View
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() =>navigate(`/dashboard/project-data/${proj.id}`)}
                                    >
                                      <FontAwesomeIcon color="green" icon={faEdit} className="me-1" /> Edit
                                    </button>
                                  </li>
                                  <li>
                                    <button className="dropdown-item" onClick={() => handleDeleteShow(proj)} >
                                      <FontAwesomeIcon color="green" icon={faTrashCan} className="me-1" /> Delete
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>
                          <div className="mb-2">
                            <span className="fw-bold">Description:</span>{" "}
                            {proj.description}
                          </div>
                          <div className="mb-2">
                            <span className="fw-bold">Tasks:</span>{" "}
                            {proj.task?.length || 0}
                          </div>
                          <div>
                            <span className="fw-bold">Created:</span>{" "}
                            {proj?.creationDate? new Date(proj?.creationDate).toLocaleDateString():"N/A"}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <NoData item="Projects" />
                  )}
                </div>
              </div>
            </>
          )}
          {/* View Details */}
          <ViewModal show={showView} handleClose={handleViewClose} title="Project Details"
            fields={[
              {label: "Title", value: selectedProject?.title},
              {label: "Description", value: selectedProject?.description},
              {label: "Creation Date", value:selectedProject?.modificationDate? new Date(selectedProject?.modificationDate).toLocaleDateString():"N/A"},
              {label: "Modification Date", value:selectedProject?.creationDate? new Date(selectedProject?.creationDate).toLocaleDateString():"N/A"},
              {label: "Manager Name", value:selectedProject?.manager?.userName},
              {label: "Manager Email", value:selectedProject?.manager?.email},
              {label: "Num Tasks", value:selectedProject?.task?.length},
            ]}
          />
          {/* PAGINATION */}
          {!searchValue && totalResults > 5 && (
            <div className="custom-table-footer mt-4 px-3 flex-shrink-0">
              <div className="d-flex justify-content-center justify-content-md-end align-items-center flex-wrap gap-2">
                <span>Showing</span>
                <select
                  className="form-select rounded-pill"
                  style={{width: "85px"}}
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
          )}
        </div>
      </div>
    </div>
  );
}