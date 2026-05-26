import {DndContext,PointerSensor,TouchSensor,closestCorners,useSensor,useSensors,type DragEndEvent} from "@dnd-kit/core";
import { useCallback, useEffect, useState } from "react";
import Column from "./Column";
import useGetData from "../../../hooks/useGetData";

import { TasksAPI } from "../../../api";


interface PaginatedResponse {
  pageNumber: number;
  pageSize: number;
  totalNumberOfRecords: number;
  totalNumberOfPages: number;
  data: ApiTask[];
}

export interface ApiTask {
  id: number;
  title: string;
  status: string;
}
export type TaskStatus = "ToDo"| "InProgress"| "Done";

export default function TaskBoard() {

  const fetchTasks = useCallback(() => {
    return TasksAPI.GetTasksByEmployee({page: 1 , size: 10});
  }, []);

  const {data: paginationWrapper,isLoading,refetch} = useGetData<PaginatedResponse>(fetchTasks, []);

  // LOCAL STATE FOR DND
  const [tasks, setTasks] = useState<ApiTask[]>([]);

  // Sync API data into local state
  useEffect(() => {

  if (paginationWrapper?.data) {

    const formattedTasks: ApiTask[] =
      paginationWrapper.data.map((task) => ({
        ...task,
        status: task.status as ApiTask["status"],
      }));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTasks(formattedTasks);
  }

}, [paginationWrapper]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = over.id as ApiTask["status"];
    const task = tasks.find((t) => t.id === taskId);

    if (!task || task.status === newStatus) return;

    // SAVE OLD TASKS FOR ROLLBACK
    const previousTasks = tasks;

    // OPTIMISTIC UPDATE
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: newStatus }
          : t
      )
    );

    try {
      await TasksAPI.ChangeTaskStatus(taskId , {status: newStatus})
      refetch()
    } catch (error) {
      console.log(error);
      // ROLLBACK
      setTasks(previousTasks);
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor)
  )

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "500px" }}
      >
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className=" p-4 flex-shrink-0">
      <h3 className="mb-0" style={{ color: "#0E382F" }}>
        Task Board
      </h3>
    </div>
    <div
      className="flex-grow-1"
      style={{
        backgroundColor: "#eeeeee",
        minHeight: "100%"
      }}
    >
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div className="container-fluid p-3">
          <div className="row">
            <Column
              title="To Do"
              status="ToDo"
              tasks={tasks.filter(
                (t) => t.status === "ToDo"
              )}
            />

            <Column
              title="In Progress"
              status="InProgress"
              tasks={tasks.filter(
                (t) => t.status === "InProgress"
              )}
            />

            <Column
              title="Done"
              status="Done"
              tasks={tasks.filter(
                (t) => t.status === "Done"
              )}
            />
          </div>
        </div>
      </DndContext>
    </div>
    
    </>
  );
}