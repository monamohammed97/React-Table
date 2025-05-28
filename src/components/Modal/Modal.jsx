import React from "react";

export default function Modal({ toggleModal }) {
  return (
    <div className={`modal-container`} onClick={toggleModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h4>Alert</h4>
        <p className="paragraph">Choose an Excel File</p>
        <button onClick={toggleModal}>Close</button>
      </div>
    </div>
  );
}
