import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import Table from "./Table";
import "./App.css";
import compareTables from "./utils/compareTables";
import Modal from "./Modal";
import guessColumnTypes from "./utils/guessColumnTypes";
import ValidationModal from "./ValidationModal";
import validateValues from "./utils/validateValues";

function App() {
  // State to hold the current table data
  const [currentTable, setCurrentTable] = useState([]);
  // State to hold the differences between the old and new data
  const [differences, setDifferences] = useState([]);
  // State to hold the button title
  const [titleBtn, setTitleBtn] = useState("Import Excel File");
  // Ref to hold the file input element
  const inputRef = useRef(null);
  const [isFirstUpload, setIsFirstUpload] = useState(false);
  const [isCheckFile, setCheckFile] = useState(false);
  const [fileName, setFileName] = useState("");

  // State to hold validation errors
  const [invalidNumericColumns, setInvalidNumericColumns] = useState([]);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  // Function to handle file upload
  const handleFileUpload = (e) => {
    // Check if a file is selected
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name.split(".").slice(0, -1).join("."));
    // Check if the file is an Excel file
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls"].includes(fileExtension)) {
      setCheckFile(true);
    }

    const reader = new FileReader();
    // Read the file as an array buffer
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        // Parse the Excel file using XLSX library
        const workbook = XLSX.read(data, { type: "array" });
        // Get the first sheet and convert it to JSON
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        // Convert the sheet to JSON format, Set default value to empty string for all cells {"defval: ""}
        let jsonData = XLSX.utils.sheet_to_json(worksheet, {
          defval: "",
          cellDates: true,
          raw: false,
          dateNF: "yyyy-mm-dd",
        });
        if (currentTable.length > 0) {
          const guessedTypes = guessColumnTypes(jsonData);
          const invalids = validateValues(jsonData, guessedTypes);
          if (invalids.length > 0) {
            setInvalidNumericColumns(invalids);
            setPendingData(jsonData);
            setShowValidationModal(true);
            e.target.value = null;
            return;
          }
        }
        processValidData(jsonData);
      } catch {
        localStorage.removeItem("dataTable");
        setCurrentTable([]);
        setDifferences([]);
        setIsFirstUpload(false);
        setTitleBtn("Import Excel File");
      }
    };
    // Reset the file input value to allow re-uploading the same file
    e.target.value = null;
    reader.readAsArrayBuffer(file);
    setTitleBtn("Import and Analyze");
  };

  const handleClick = () => {
    inputRef.current.click();
  };
  function processValidData(jsonData) {
    // get the old data from local storage
    const oldData = JSON.parse(localStorage.getItem("dataTable")) || [];
    // Check if the file is being uploaded for the first time
    const isFirst = oldData.length === 0;
    setIsFirstUpload(isFirst);
    // Compare the old and new data and get the differences
    const diffs = compareTables(oldData, jsonData);
    // Set the differences to state
    setDifferences(diffs);

    // Update the current table with the new data
    // Merge the new data with the old data
    diffs.forEach(({ rowIndex, changes }) => {
      Object.entries(changes).forEach(([key, { new: newValue }]) => {
        if (!jsonData[rowIndex]) jsonData[rowIndex] = {};
        jsonData[rowIndex][key] = newValue;
      });
    });

    // delete empty rows
    jsonData = jsonData.filter((row) =>
      Object.values(row).some(
        (cell) => cell !== "" && cell !== null && cell !== undefined
      )
    );

    // delete empty columns
    const allKeys = Object.keys(jsonData[0] || {});
    const columnsToDelete = allKeys.filter((col) =>
      jsonData.every(
        (row) => row[col] === "" || row[col] === null || row[col] === undefined
      )
    );

    jsonData = jsonData.map((row) => {
      columnsToDelete.forEach((col) => delete row[col]);
      return row;
    });
    // Update the current table with the new dataF
    setCurrentTable(jsonData);
    localStorage.setItem("dataTable", JSON.stringify(jsonData));
  }
  // Effect to check if there is data in local storage
  useEffect(() => {
    const dataTableFromLocalStorage = localStorage.getItem("dataTable");
    if (dataTableFromLocalStorage) {
      const parsed = JSON.parse(dataTableFromLocalStorage);
      setCurrentTable(parsed);
      setTitleBtn("Import and Analyze");
    }
  }, []);

  return (
    <>
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
        <Table
          data={currentTable}
          differences={differences}
          isFirstUpload={isFirstUpload}
          fileName={fileName}
        />
      </div>
      {isCheckFile && <Modal toggleModal={(e) => setCheckFile(false)} />}
      {showValidationModal && (
        <ValidationModal
          errors={invalidNumericColumns}
          onConfirm={() => {
            setShowValidationModal(false);
            processValidData(pendingData);
            setPendingData(null);
          }}
          onReject={() => {
            setShowValidationModal(false);
            setPendingData(null);
          }}
        />
      )}
    </>
  );
}

export default App;
