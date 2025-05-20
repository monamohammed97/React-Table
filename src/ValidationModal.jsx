import { useState } from "react";

export default function ValidationModal({
  errors = [],
  onConfirm,
  onReject,
  handleUpdate,
  toggleModal,
  isUpdated,
  handleShowUpdate,
  columnTypes,
}) {
  const [inputValue, setInputValue] = useState("");
  const [idRow, setIdRow] = useState({ id: null, column: "" });
  const [inputError, setInputError] = useState("");

  function getInputType(column) {
    if (!column) return "text";
    const type = columnTypes[column];
    if (type === "number") return "number";
    if (type === "email") return "email";
    if (type === "date") return "date";
    return "text";
  }

  function validateInput(value, type) {
    if (!value) return "Value cannot be empty";

    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Invalid email format";
    } else if (type === "number") {
      if (isNaN(value)) return "Must be a number";
    } else if (type === "date") {
      const date = new Date(value);
      if (isNaN(date.getTime())) return "Invalid date format";
    }
    return "";
  }

  const handleAcceptEdit = () => {
    const inputType = getInputType(idRow.column);
    const error = validateInput(inputValue, inputType);
    if (error) {
      setInputError(error);
      return;
    }

    if (inputValue !== "") {
      handleUpdate({
        id: idRow.id,
        column: idRow.column,
        value: inputValue,
      });
    }
    setInputValue("");
    setIdRow({ id: null, column: "" });
    setInputError("");
    handleShowUpdate(false);
  };

  return (
    <div className="modal-container" onClick={toggleModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h4 className="pb-30">Validation Errors</h4>
        <ul style={{ listStyle: "none" }}>
          {errors.length > 0
            ? errors.length === 1
              ? "Review this column:"
              : "Review these columns:"
            : null}
          {errors.length > 0 ? (
            errors.map((err, i) => (
              <li key={i} className="paragraph p-0">
                <strong>Column:</strong> {err.column}
                <ul>
                  {err.invalidRows.map(({ rowIndex, value, id }, idx) => {
                    const inputType = getInputType(err.column);
                    const isEditing =
                      isUpdated &&
                      idRow.id === id &&
                      idRow.column === err.column;

                    return (
                      <li key={idx}>
                        <div>
                          Row {rowIndex}:{" "}
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            Invalid
                          </span>{" "}
                          value{" "}
                          {isEditing ? (
                            <div>
                              <input
                                type={inputType}
                                value={inputValue}
                                onChange={(e) => {
                                  setInputValue(e.target.value);
                                  if (inputError) setInputError("");
                                }}
                              />
                              <button
                                className="btn-accepted"
                                onClick={handleAcceptEdit}
                              >
                                ✓
                              </button>
                              <button
                                className="btn-rejected"
                                onClick={() => {
                                  setInputValue("");
                                  setIdRow({ id: null, column: "" });
                                  setInputError("");
                                  handleShowUpdate(false);
                                }}
                              >
                                X
                              </button>
                              {inputError && (
                                <p style={{ color: "red", marginTop: "4px" }}>
                                  {inputError}
                                </p>
                              )}
                            </div>
                          ) : (
                            value
                          )}
                        </div>
                        {!isEditing && (
                          <button
                            onClick={() => {
                              setIdRow({ id, column: err.column });
                              setInputValue(value);
                              handleShowUpdate(true);
                              setInputError("");
                            }}
                          >
                            update
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))
          ) : (
            <li className="paragraph">No validation errors found.</li>
          )}
        </ul>
        {errors.length > 0 && (
          <p className="paragraph">
            Do you want to accept the data despite these errors?
          </p>
        )}
        {errors.length > 0 && (
          <button className="btn-rejected" onClick={onReject}>
            Reject
          </button>
        )}
        <button className="btn-accepted" onClick={onConfirm}>
          {errors.length == 0 ? "Ok" : "Accept"}
        </button>
      </div>
    </div>
  );
}
