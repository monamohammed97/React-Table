import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import "./App.css";
import Table from "./Table";
function App() {
  const [currentTable, setCurrentTable] = useState([]);
  const [previousTable, setPreviousTable] = useState([]);
  const [titleBtn, setTitleBtn] = useState("Import Excel File");
  const inputRef = useRef(null);

  // upload file and read data
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      setCurrentTable(jsonData);
      localStorage.setItem("dataTable", JSON.stringify(jsonData));
    };
    e.target.value = null;

    reader.readAsArrayBuffer(file);
    setTitleBtn("Import and Analyze");
  };

  // handle click on title button instead of input
  const handleClick = () => {
    inputRef.current.click();
  };

  // add data from localStorage if available
  useEffect(() => {
    const dataTableFromLocalStorage = localStorage.getItem("dataTable");
    if (dataTableFromLocalStorage) {
      setCurrentTable(JSON.parse(dataTableFromLocalStorage));
      setTitleBtn("Import and Analyze");
    }
  }, []);
  return (
    <div className="container" style={{ padding: "20px" }}>
      <h3 className="cursor-pointer" onClick={handleClick}>
        {titleBtn}
      </h3>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx, .xls"
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
      <Table data={currentTable} />
    </div>
  );
}

export default App;
