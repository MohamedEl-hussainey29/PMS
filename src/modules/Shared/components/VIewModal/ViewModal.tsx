/* eslint-disable @typescript-eslint/no-explicit-any */

import Modal from "react-bootstrap/Modal";

interface Field {
  label: string;
  value: any;
}

interface ViewModalProps {
  show: boolean;
  handleClose: () => void;
  title: string;
  fields: Field[];
}

export default function ViewModal({
  show,
  handleClose,
  title,
  fields,
}: ViewModalProps) {
  return (
    <Modal show={show} onHide={handleClose} centered style={{ zIndex: 3500 }}>
      <Modal.Header
        style={{ backgroundColor: "#315951 ", borderRadius: "5px" }}
        closeButton
        closeVariant="white"
      >
        <Modal.Title
          className="fw-bold"
          style={{
            color: "#FFF",
          }}
        >
          {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: "#F8F9FA", borderRadius: "5px" }}>
        <div className="d-flex flex-column gap-3">
          {fields.map((field, index) => (
            <div
              key={index}
              className="d-flex justify-content-between align-items-start border-bottom pb-2 gap-3"
            >
              {/* LABEL */}
              <span
                className="fw-semibold text-success flex-shrink-0"
                style={{ minWidth: "120px" }}
              >
                {field.label}
              </span>

              {/* VALUE */}

              <div
                className="text-muted text-end"
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  maxWidth: "70%",
                }}
              >
                {field.label === "Status" ? (
                  <span
                    className="px-3 py-1 rounded-pill text-white small"
                    style={{
                      backgroundColor:
                        field.value === "ToDo"
                          ? "#E4E1F5"
                          : field.value === "InProgress"
                            ? "#EF9B28"
                            : "#198754",
                    }}
                  >
                    {field.value}
                  </span>
                ) : field.label === "Activation" ? (
                  <span
                    className="px-3 py-1 rounded-pill text-white small"
                    style={{
                      backgroundColor:
                        field.value === "Active" ? "#198754" : "#C97A7A",
                    }}
                  >
                    {field.value}
                  </span>
                ) : (
                  String(field.value || "N/A")
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
}
