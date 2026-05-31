/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ProjectsAPI } from "../../../api";
import { toast } from "react-toastify";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../Shared/components/Spinner/Spinner";

export interface ProjectsFormValues {
  title: string;
  description: string;
}

export default function ProjectData() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [isLoadingProject, setIsLoadingProject] = useState(!!projectId);
  const [submitLoading , setSubmitLoading] = useState(false);

  const { register, formState: { errors }, handleSubmit, reset } = useForm<ProjectsFormValues>();


  const onSubmit = async (data: ProjectsFormValues) => {
    setSubmitLoading(true)
    try {
      if (projectId) {
        await ProjectsAPI.UpdateProject(Number(projectId), data);
        toast.success("Project updated successfully!");
      } else {
        await ProjectsAPI.CreateProject(data);
        toast.success("Project created successfully!");
      }
      navigate("/dashboard/projects");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to save project");
      } else {
        toast.error("Something went wrong");
      }
    }finally{
      setSubmitLoading(true)
    }
  };
  useEffect(() => {
    if (projectId) {
      const getProjectDetails = async () => {
        setIsLoadingProject(true);
        try {
          const response = await ProjectsAPI.GetProjectById(Number(projectId));

          reset({
            title: response.data.title,
            description: response.data.description,
          });
        } catch (error) {
          if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || "Failed to fetch project data");
          } else {
            toast.error("Something went wrong");
          }
          navigate("/dashboard/projects");
        } finally {
          setIsLoadingProject(false);
        }
      };

      getProjectDetails();
    } else {
      reset({
        title: "",
        description: "",
      });
      setIsLoadingProject(false);
    }
  }, [projectId, reset, navigate]);
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="task-form-header px-4 text-white">
            <p
              className="text-capitalize"
              style={{ color: "#0E382F", cursor: "pointer" }}
              onClick={() => navigate("/dashboard/projects")}
            >
              <FontAwesomeIcon icon={faChevronLeft} /> view all projects
            </p>
            <h3 style={{ color: "#0E382F" }}>
              {projectId ? "Edit Project" : "Add a New Project"}
            </h3>
          </div>
          <div className="vh-100" style={{ backgroundColor: "#EEE" }}>
            <div className="row justify-content-center align-items-center">
              <div className="col-md-8 bg-white my-4 rounded-3">
                {isLoadingProject ? (
                  <Spinner/>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row p-5">
                      <div className="my-2 d-flex flex-column form-input">
                        <label htmlFor="title">Title</label>
                        <input
                          type="text"
                          id="title"
                          placeholder="Name"
                          className="form-control border-1 rounded-4"
                          {...register("title", { required: "Title is required!" })}
                        />
                        {errors.title && <span className="text-danger">{errors.title.message}</span>}
                      </div>
                      <div className="my-3 d-flex flex-column form-input">
                        <label htmlFor="desc">Description</label>
                        <textarea
                          placeholder="Description"
                          id="desc"
                          className="form-control border-1 rounded-4"
                          style={{ height: "120px", resize: "none" }}
                          {...register("description", { required: "Description is required!" })}
                        />
                        {errors.description && <span className="text-danger">{errors.description.message}</span>}
                      </div>
                    </div>
                    <hr className="my-3" />
                    <div className="tasks-form-btns d-flex justify-content-between align-items-center p-3">
                      <button
                        type="button"
                        onClick={() => navigate("/dashboard/projects")}
                        className="btn btn-outline-dark rounded-5 px-4 py-2 fs-5"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitLoading}
                        className="btn btn-warning text-white rounded-5 px-4 py-2 fs-5"
                      >
                        {submitLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span> Saving...
                          </>
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
