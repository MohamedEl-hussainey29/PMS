import { useDroppable } from "@dnd-kit/core";
import { type ApiTask } from "./TaskBoard";
import TaskCard from "./TaskCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

interface ColumnProps {
  title: string;
  status: ApiTask["status"];
  tasks: ApiTask[];
}

export default function Column({title,status,tasks}: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status
  });

  return (
    <div className="col-md-4">
      <h4 className="my-3">{title}</h4>

      <div
        ref={setNodeRef}
        className="p-3 rounded-4"
        style={{
          backgroundColor: "#496d65",
          minHeight: "400px",
        }}
      >
        {tasks.length > 0 ? (
            tasks.map((task) => (
                <TaskCard
                key={task.id}
                task={task}
                />
            ))
            ) : (

            <div
                className="d-flex flex-column justify-content-center align-items-center text-white-50"
                style={{ minHeight: "300px" }}
            >
                <FontAwesomeIcon icon={faThumbsUp} size="xl"/>
                No Tasks Here
            </div>
            )}
      </div>
    </div>
  );
}