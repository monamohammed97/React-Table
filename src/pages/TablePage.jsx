import React, { useCallback, useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import Table from "../components/Table";
import compareTables from "../utils/compareTables";
import Modal from "../components/Modal/Modal";
import guessColumnTypes from "../utils/guessColumnTypes";
import ValidationModal from "../components/Modal/ValidationModal";
import validateValues from "../utils/validateValues";
import ArrowIcon from "../assets/ArrowIcon";
import saveToLocalStorage from "../utils/saveToLocalStorage";
import getDataFromLocal from "../utils/getDataFromLocal";
import ModalTime from "../components/Modal/ModalTime";
import TrashIcon from "../assets/TrashIcon";
import Title from "../components/Title";
import { classifyRemainingTime } from "../utils/classifyRemainingTime";
import { io } from "socket.io-client";

function TablePage() {
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
  const [modalTime, setModalTime] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);

  // State to hold validation errors
  const [invalidNumericColumns, setInvalidNumericColumns] = useState([]);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  // State to handle dropdown visibility
  const [showDropDown, setShowDropDown] = useState(false);
  const [activeItem, setActiveItem] = useState("Save Data");
  const [remainingTime, setRemainingTime] = useState(null);
  const [redTime, setRedTime] = useState("");
  const modalShownRef = useRef(false);

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
        const hasIdColumn = jsonData.some((row) => "id" in row);

        if (!hasIdColumn) {
          jsonData = jsonData.map((row, index) => ({
            id: index + 1,
            ...row,
          }));
        }
        const oldData = JSON.parse(localStorage.getItem("dataTable")) || [];
        // Check if the file is being uploaded for the first time
        const isFirst = oldData.length === 0;
        setIsFirstUpload(isFirst);
        const guessedTypes = guessColumnTypes(jsonData);
        const invalids = validateValues(jsonData, guessedTypes);
        if (invalids.length > 0) {
          setInvalidNumericColumns(invalids);
          setPendingData(jsonData);
          setShowValidationModal(true);
          e.target.value = null;
          return;
        }
        processValidData(jsonData);
      } catch {
        localStorage.removeItem("dataTable");
        localStorage.removeItem("expiry");
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
  const handleUpdate = ({ id, column, value }) => {
    if (!pendingData) return;

    const updatedPending = pendingData.map((row) => {
      if (row.id === id) {
        return { ...row, [column]: value };
      }
      return row;
    });

    setPendingData(updatedPending);

    const guessedTypes = guessColumnTypes(updatedPending);
    const invalids = validateValues(updatedPending, guessedTypes);
    setInvalidNumericColumns(invalids);
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
    saveToLocalStorage(jsonData, activeItem);
  }

  const handleEdit = useCallback((rowData) => {
    console.log("Edit clicked:", rowData);
    // const dataAfterEdit = dataTable.filter((item)=>{

    // })
  }, []);

  const handleDelete = useCallback(
    (rowData) => {
      if (!rowData?.id) {
        return;
      }

      const dataAfterDelete = currentTable.filter(
        (item) => item?.id !== rowData.id
      );

      setCurrentTable(dataAfterDelete);
      if (dataAfterDelete.length == 0) {
        setActiveItem("Don't Save");
        setRemainingTime(null);
      }
      saveToLocalStorage(dataAfterDelete, activeItem);
    },
    [currentTable, activeItem, setCurrentTable, saveToLocalStorage]
  );

  // Effect to check if there is data in local storage
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeItem === "Don't Save") return;
      const stored = getDataFromLocal("dataTable");
      const expiryStr = localStorage.getItem("expiry");
      if (!expiryStr) return;

      const expiryTime = parseInt(expiryStr, 10);
      const now = Date.now();

      if (stored) {
        setCurrentTable(stored);
        setTitleBtn("Import and Analyze");
      }

      const timeLeft = expiryTime - now;
      if (timeLeft <= 60 * 1000 && !modalShownRef.current) {
        setModalTime(true);
        setRedTime("red-time");
        modalShownRef.current = true;
      }
      if (timeLeft > 60 * 1000) {
        setRedTime("");
      }
      if (timeLeft <= 0) {
        localStorage.removeItem("dataTable");
        localStorage.removeItem("expiry");
        window.location.reload();
        setRemainingTime(null);
      } else {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        const format = `${String(days).padStart(2, "0")}:${String(
          hours
        ).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
          seconds
        ).padStart(2, "0")}`;
        setRemainingTime(format);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [activeItem]);

  useEffect(() => {
    const stored = getDataFromLocal("dataTable");
    if (stored) {
      setCurrentTable(stored);
      setTitleBtn("Import and Analyze");
    }
  }, []);


  useEffect(() => {
    const time = localStorage.getItem("expiry");
    const nowTime = classifyRemainingTime(Number(time));
    setActiveItem(nowTime);
  }, []);

  useEffect(() => {
    if (
      (currentTable.length > 0 && activeItem !== "Don't Save") ||
      activeItem !== "Save Data"
    ) {
      saveToLocalStorage(currentTable, activeItem);
    }
  }, [activeItem]);
  return (
    <>
      <Title>Import and Export Excel File</Title>
      {remainingTime && activeItem !== "Don't Save" && (
        <div className={`remaining-time ${redTime} `}>
          <strong>{remainingTime}</strong>
        </div>
      )}
      <div className="flex title-box">
        <h3 className="cursor-pointer" onClick={handleClick}>
          {titleBtn}
        </h3>
        <div className="flex">
          {currentTable.length > 0 && (
            <>
              <div
                className={`flex title-box-dropdown ${
                  showDropDown && "border-0"
                }`}
                onClick={() => setShowDropDown(!showDropDown)}
              >
                <span className="active">{activeItem}</span>
                <span style={{ display: "flex", marginLeft: "10px" }}>
                  <ArrowIcon />
                </span>
                {showDropDown && (
                  <ul>
                    <li
                      onClick={(e) => {
                        setActiveItem(e.target.innerText);
                      }}
                    >
                      Don't Save
                    </li>
                    <li
                      onClick={(e) => {
                        setActiveItem(e.target.innerText);
                      }}
                    >
                      Hour
                    </li>
                    <li
                      onClick={(e) => {
                        setActiveItem(e.target.innerText);
                      }}
                    >
                      Week
                    </li>
                    <li
                      onClick={(e) => {
                        setActiveItem(e.target.innerText);
                      }}
                    >
                      Month
                    </li>
                    <li
                      onClick={(e) => {
                        setActiveItem(e.target.innerText);
                      }}
                    >
                      Year
                    </li>
                  </ul>
                )}
              </div>
              <div
                className="rotate-animation"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  localStorage.removeItem("dataTable");
                  localStorage.removeItem("expiry");
                  window.location.reload();
                }}
              >
                <TrashIcon />
              </div>
            </>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx, .xls"
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
      <div className="t-container">
        <Table
          data={currentTable}
          differences={differences}
          isFirstUpload={isFirstUpload}
          fileName={fileName}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
      {isCheckFile && <Modal toggleModal={() => setCheckFile(false)} />}
      {modalTime && (
        <ModalTime
          toggleModalTimeout={() => {
            setModalTime(false);
            // modalShownRef.current = false;
          }}
        />
      )}
      {showValidationModal && (
        <ValidationModal
          columnTypes={guessColumnTypes(pendingData)}
          isUpdated={isUpdated}
          handleUpdate={handleUpdate}
          handleShowUpdate={(value) => {
            setIsUpdated(!!value);
          }}
          errors={invalidNumericColumns}
          onConfirm={() => {
            setShowValidationModal(false);
            processValidData(pendingData);
            setPendingData(null);
            setIsUpdated(false);
          }}
          onReject={() => {
            setShowValidationModal(false);
            setPendingData(null);
            setIsUpdated(false);
          }}
          toggleModal={() => {
            setShowValidationModal(false);
            setIsUpdated(false);
          }}
        />
      )}
    </>
  );
}

export default TablePage;
