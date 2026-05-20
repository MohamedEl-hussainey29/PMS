/* eslint-disable @typescript-eslint/no-explicit-any */
import { faChevronDown, faChevronLeft, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGetData from "../../../hooks/useGetData";
import { ProjectsAPI, TasksAPI, UsersAPI } from "../../../api";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

interface User {
  id: number;
  userName: string;
}
interface Project {
  id: number;
  title: string;
}

export interface TasksFormValues{
  title: string;
  description: string;
  employeeId: number;
  projectId: number;
}

export default function TaskData() {
  const navigate = useNavigate();
  const {taskId} = useParams();
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isProjOpen, setIsProjOpen] = useState(false);
  const [isLoadingTask, setIsLoadingTask] = useState(!!taskId);
  const [taskEmployee, setTaskEmployee] = useState<User | null>(null);
  const [taskProject, setTaskProject] = useState<Project | null>(null);
  const {register, formState:{errors}, handleSubmit , setValue} = useForm<TasksFormValues>();

const { data: usersResponse } = useGetData<any>(UsersAPI.GetEmployeesByManager);
const { data: projectsResponse } = useGetData<any>(ProjectsAPI.GetProjectsByManager);

const users: User[] = usersResponse?.data || [];
const projects: Project[] = projectsResponse?.data || [];

useEffect(() => {
  if (taskId && users.length > 0 && projects.length > 0) {
    const getTaskDetails = async () => {
      setIsLoadingTask(true);
      try {
        const response = await TasksAPI.GetTaskById(Number(taskId));
        setTaskEmployee(response.data.employee);
        setTaskProject(response.data.project);

        setValue("title", response.data.title);
        setValue("description", response.data.description);
        setValue("employeeId", response.data.employee.id);
        setValue("projectId", response.data.project.id);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message);
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setIsLoadingTask(false);
      }
    };

    getTaskDetails();
  }
}, [taskId, users.length, projects.length, setValue]);

  const mergedUsers =
    taskEmployee &&
    !users.some((u) => u.id === taskEmployee.id)
      ? [...users, taskEmployee]
      : users;

  const mergedProjects =
    taskProject &&
    !projects.some((p) => p.id === taskProject.id)
      ? [...projects, taskProject]
      : projects;

  const onSubmit = async (data: TasksFormValues) => {
    try {
      if (taskId) {
        await TasksAPI.UpdateTask(Number(taskId), data);
        toast.success("Task updated successfully!");
      } else {
        await TasksAPI.CreateTask(data);
        toast.success("Task created successfully!");
      }
      navigate("/dashboard/tasks");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="task-form-header px-4 text-white">
            <p
              className=" text-capitalize"
              style={{ color: "#0E382F", cursor: "pointer" }}
              onClick={() => navigate("/dashboard/tasks")}
            >
              <FontAwesomeIcon icon={faChevronLeft} /> view all tasks
            </p>
            <h3 style={{ color: "#0E382F" }}>{taskId ? "Edit Task" : "Add a New Task"}</h3>
          </div>
          <div className="vh-100" style={{ backgroundColor: "#EEE" }}>
            <div className="row justify-content-center align-items-center">
              <div className="col-md-10 bg-white my-4 rounded-3">
                {isLoadingTask ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "500px" }}
                  >
                    <div className="spinner-border text-warning" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>

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
                        aria-describedby="titleelpBlock"
                        {...register('title', {required:'Title is required!'})}
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
                        {...register('description', {required:'description is required!'})}
                      />
                      {errors.description && <span className="text-danger">{errors.description.message}</span>}
                    </div>
                    <div className="col-md-6 my-2 form-input">
                      <label htmlFor="user">User</label>
                      <div className="position-relative">
                        <select
                          className="form-control rounded-4 pe-5"
                          id="user"
                          onClick={() => setIsUserOpen((prev:boolean) => !prev)}
                          style={{
                            appearance: "none",
                          }}
                          {...register('employeeId', {required:'Employee is required!' , valueAsNumber: true})}
                        >
                          <option value="">No User Selected</option>
                          {mergedUsers?.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.userName}
                            </option>
                          ))}
                        </select>
                        <span
                          className="position-absolute top-50 end-0 translate-middle-y pe-3"
                          style={{ pointerEvents: "none"}}
                        >
                          <FontAwesomeIcon
                            icon={isUserOpen ? faChevronUp : faChevronDown}
                          />
                        </span>
                      </div>
                      {errors.employeeId && <span className="text-danger">{errors.employeeId.message}</span>}
                    </div>
                    <div className="col-md-6 my-2 form-input">
                      <label htmlFor="proj">Project</label>
                      <div className="position-relative">
                        <select
                          disabled={!!taskId}
                          className="form-control rounded-4 pe-5"
                          id="proj"
                          onClick={() => setIsProjOpen((prev:boolean) => !prev)}
                          style={{
                            appearance: "none",
                          }}
                          {...register('projectId', {required:'Project is required!' , valueAsNumber: true})}
                        >
                          <option value="">No project Selected</option>
                          {mergedProjects?.map((proj) => (
                            <option key={proj.id} value={proj.id}>
                              {proj.title}
                            </option>
                          ))}
                        </select>
                        <span
                          className="position-absolute top-50 end-0 translate-middle-y pe-3"
                          style={{ pointerEvents: "none"}}
                        >
                          <FontAwesomeIcon
                            icon={isProjOpen ? faChevronUp : faChevronDown}
                          />
                        </span>
                      </div>
                      {errors.projectId && <span className="text-danger">{errors.projectId.message}</span>}
                    </div>
                  </div>
                  <hr className="my-3" />
                  <div className="tasks-form-btns d-flex justify-content-between align-items-center p-3">
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard/tasks")}
                      className="btn btn-outline-dark rounded-5 px-4 py-2 fs-5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-warning text-white rounded-5 px-4 py-2 fs-5"
                    >
                      Save
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
