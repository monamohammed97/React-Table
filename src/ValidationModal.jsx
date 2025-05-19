export default function ValidationModal({ errors = [], onConfirm, onReject }) {
  return (
    <div className="modal-container">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h4 className="pb-30">Validation Errors</h4>
        <ul style={{ listStyle: "none" }}>
          {errors.length === 1
            ? "Review this column:"
            : "Review these columns:"}
          {errors.length > 0 ? (
            errors.map((err, i) => (
              <li key={i} className="paragraph p-0">
                <strong>Column:</strong> {err.column}
                <ul>
                  {err.invalidRows.map(({ rowIndex, value }, idx) => (
                    <li key={idx}>
                      Row {rowIndex}:{" "}
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        Invalid
                      </span>{" "}
                      value "{value}"
                    </li>
                  ))}
                </ul>
              </li>
            ))
          ) : (
            <li className="paragraph">No validation errors found.</li>
          )}
        </ul>
        <p className="paragraph">
          Do you want to accept the data despite these errors?
        </p>
        <button className="btn-rejected" onClick={onReject}>
          Reject
        </button>
        <button className="btn-accepted" onClick={onConfirm}>
          Accept
        </button>
      </div>
    </div>
  );
}
