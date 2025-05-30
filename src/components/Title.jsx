import React from "react";

export default function Title({ className, children }) {
  return (
    <h2
      className={className}
      style={{
        color: "var(--main-color)",
        marginBottom: "30px",
        textAlign: "left",
      }}
    >
      {children}
    </h2>
  );
}
