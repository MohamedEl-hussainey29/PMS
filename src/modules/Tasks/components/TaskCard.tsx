import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { type ApiTask } from "./TaskBoard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import ViewModal from "../../Shared/components/VIewModal/ViewModal";

interface TaskCardProps {
  task: ApiTask;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [showView, setShowView] = useState(false);

  const [selectedTask, setSelectedTask] = useState<ApiTask | null>(null);

  const handleViewShow = (task: ApiTask) => {
    setSelectedTask(task);

    setShowView(true);
  };

  const handleViewClose = () => setShowView(false);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: "none",
  };

  return (
    <>
      <div ref={setNodeRef} style={style} className="rounded-3 mb-3 text-white">
        <div
          className="d-flex justify-content-between align-items-center px-3 py-3 rounded-3 shadow-sm"
          style={{backgroundColor: "#f3a227"}}
        >
          <div className="d-flex align-items-center gap-3">
            <FontAwesomeIcon icon={faGripVertical}
              {...listeners}
              {...attributes}
              style={{cursor: "grab"}}
            />
            <span className="fw-semibold" style={{wordBreak: "break-word"}}> {task.title} </span>
          </div>
          <FontAwesomeIcon icon={faCircleInfo} style={{cursor: "pointer",}} onClick={() => handleViewShow(task)}/>
        </div>
      </div>

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
    </>
  );
}
