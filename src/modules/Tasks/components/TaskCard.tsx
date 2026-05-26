import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { type ApiTask } from "./TaskBoard";

interface TaskCardProps {
  task: ApiTask;
}

export default function TaskCard({ task }: TaskCardProps) {
  const {attributes,listeners,setNodeRef,transform} = useDraggable({id: task.id,});

  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-3 rounded-3 mb-3 text-white"
      role="button"
    >
      <div
        className="d-flex justify-content-between align-items-center px-3 py-2 rounded-3"
        style={{
          backgroundColor: "#f3a227",
        }}
      >
        <span>{task.title}</span>

        <i className="fa-solid fa-up-right-from-square"></i>
      </div>
    </div>
  );
}