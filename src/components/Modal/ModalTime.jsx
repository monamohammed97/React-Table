import React from "react";

export default function ModalTime({ toggleModalTimeout }) {
  return (
    <div className={`modal-container`} onClick={toggleModalTimeout}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h4 style={{ color: "#fbff00" }}>Warning</h4>
        <p className="paragraph">The session will end in 5 minutes.</p>
        <button onClick={toggleModalTimeout}>Ok</button>
      </div>
    </div>
  );
}
