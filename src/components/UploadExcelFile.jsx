import React, { useState, useRef } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { Button } from "@mui/material";
import Tray from "../Tray.jpg";

const UploadExcelFile = () => {
  const [addedExcelfile, setAddedExcelFile] = useState(null);
  const [excelFileName, setExcelFileName] = useState(null);
  const [excelFileProgress, setExcelFileProgress] = useState(0);

  const excelInputRef = useRef();

  const uploadExcelFile = () => {
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += 45;
      setExcelFileProgress(progress);

      if (progress >= 100) {
        clearInterval(uploadInterval);
      }
    }, 1000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setExcelFileName(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      setAddedExcelFile(data);
    };
    reader.readAsBinaryString(file);
    uploadExcelFile();
  };

  const generateInvoice = () => {
    addedExcelfile.forEach((item, index) => {
      const doc = new jsPDF();
      let yPos = 10;
      doc.text("Invoice", 10, yPos);
      yPos += 10;
      doc.text("-----------------------", 10, yPos);
      yPos += 10;

      Object.entries(item).forEach(([key, value]) => {
        doc.text(`${key}: ${value}`, 10, yPos);
        yPos += 10;
      });

      doc.save(`invoice_${index + 1}.pdf`);
    });
  };

  const deleteUploadedExcelFile = () => {
    setAddedExcelFile(null);
    setExcelFileName(null);
    setExcelFileProgress(0);
    if (excelInputRef.current) {
      excelInputRef.current.value = null;
    }
  };

  return (
    <div style={{ margin: "0 auto", textAlign: "center" }}>
      <label style={{ marginTop: "0", marginBottom: "0" }}>
        <p style={{ marginBottom: "0" }}>Upload File:</p>
      </label>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            border: "2px dashed black",
            borderRadius: "10px",
            marginTop: "20px",
            width: "400px",
          }}
        >
          <label
            htmlFor="excel"
            id="fileInput"
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <p style={{ color: "grey" }}>
              Upload File for Generating Invoice
              <span style={{ color: "grey" }}> (* max 1 File)</span>
            </p>
            <FileUploadIcon style={{ fontSize: "36px", color: "grey" }} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <h4 style={{ marginBottom: "0px" }}>Supported Files </h4>
              <h5 style={{ marginTop: "0px", fontWeight: "350" }}>csv,xlsx</h5>
            </div>
          </label>
          <input
            type="file"
            id="excel"
            name="excel"
            onChange={handleFileUpload}
            ref={excelInputRef}
            style={{ display: "none" }}
            accept=".xlsx, .xls, .csv"
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          marginTop: "10px",
        }}
      >
        <div style={{ width: "300px" }}>
          {addedExcelfile && (
            <div
              style={{
                display: "flex",
                height: "10%",
                width: "100%",
                alignItems: "center",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              }}
            >
              <svg
                style={{ fontSize: "1.7rem" }}
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <rect width="30" height="30" fill="none" />
                <path
                  fill="green"
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm1.8 18H14l-2-3.4l-2 3.4H8.2l2.9-4.5L8.2 11H10l2 3.4l2-3.4h1.8l-2.9 4.5zM13 9V3.5L18.5 9z"
                />
              </svg>
              <p>{excelFileName.name}</p>
              <div style={{ flex: "1" }} />

              {excelFileProgress >= 100 ? (
                <div style={{ color: "green" }}>Done</div>
              ) : (
                <div style={{ width: "20%" }}>
                  <span style={{ color: "grey" }}>{excelFileProgress}%</span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      // width: "20%",
                      height: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      marginTop: "5px",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "green",
                        width: `${excelFileProgress}%`,
                        height: "100%",
                        borderRadius: "5px",
                      }}
                    />
                  </div>
                </div>
              )}
              {/* <span style={{ color: "grey" }}>
                        {excelFileProgress}%
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "20%",
                          height: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          marginTop: "5px",
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "green",
                            width: `${excelFileProgress}%`, // Adjust the progress bar width based on progress
                            height: "100%",
                            borderRadius: "5px",
                          }}
                        ></div>
                      </div> */}
              <div style={{ flex: "1" }} />
              <div
                style={{
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  display: "flex",
                  cursor: "pointer",
                }}
              >
                <DeleteIcon
                  style={{ color: "#cc0000" }}
                  onClick={() => deleteUploadedExcelFile(addedExcelfile)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {addedExcelfile && (
        <Button
          variant="contained"
          style={{ marginTop: "10px" }}
          onClick={generateInvoice}
        >
          Generate Invoices
        </Button>
      )}
      <div style={{ width: "450px" }}>
        <div style={{ border: "1px solid black" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <h4 style={{ textDecoration: "underline", margin: "0px" }}>
              Cash Memo
            </h4>
            <h4 style={{ margin: "0px", position: "absolute", right: "10px" }}>
              Mob: 8108098410
            </h4>
          </div>
          <img
            style={{ height: "10px", width: "10px" }}
            src={Tray}
            alt="tray"
          />
          <h1
            style={{
              fontFamily: "'DM Serif Text', serif",
              fontWeight: "600",
              margin: "0px",
            }}
          >
            KS EGG CENTER
          </h1>
          <p style={{ margin: "0px" }}>
            Shop No 3,Parijat Tower Opp, Sunshrushti Complex,
            <br />
            Saki Vihar Road, Chandivali Mumbai - 400 022
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              margin: "0px",
              height: "35px",
            }}
          >
            <h2 style={{ margin: "0px" }}>Name</h2>
            <p style={{ position: "relative", left: "95px" }}>
              {" "}
              Date:
              <span style={{ textDecoration: "underline" }}>05/04/2024</span>
            </p>
          </div>
        </div>
        <table
          style={{
            border: "1px solid black",
            borderCollapse: "collapse",
            width: "450px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  borderBottom: "1px solid black",
                }}
              >
                TRAY
              </th>
              <th
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  borderBottom: "1px solid black",
                }}
              >
                QUANTITY
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                RATE
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                AMOUNT
              </th>
            </tr>
          </thead>
          <tbody style={{ height: "300px" }}>
            <tr>
              <td
                style={{
                  border: "1px solid black",
                  width: "50px",
                  borderBottom: "1px solid black",
                }}
              ></td>
              <td
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  width: "150px",
                  borderBottom: "1px solid black",
                }}
              ></td>
              <td
                style={{
                  border: "1px solid black",
                  padding: "0",
                  width: "65px",
                  textAlign: "left",
                  verticalAlign: "bottom",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                    fontWeight: "600",
                    paddingBottom: "3px",
                    margin: "0px",
                    borderTop: "1.4px solid black",
                    borderBottom: "1.4px solid black",
                    borderRight: "0px solid black",
                    borderLeft: "0px solid black",
                    paddingLeft: "8px",
                    paddingRight: "8px",
                  }}
                >
                  Total Amount:
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                    fontWeight: "600",
                    paddingBottom: "3px",
                    margin: "0px",
                    borderTop: "0px solid black",
                    borderBottom: "0px solid black",
                    borderRight: "0px solid black",
                    borderLeft: "0px solid black",
                    paddingLeft: "8px",
                    paddingRight: "8px",
                  }}
                >
                  Cash Paid:
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                    fontWeight: "600",
                    paddingBottom: "3px",
                    margin: "0px",
                    borderTop: "1.4px solid black",
                    borderBottom: "0px solid black",
                    borderRight: "0px solid black",
                    borderLeft: "0px solid black",
                    paddingLeft: "8px",
                    paddingRight: "8px",
                  }}
                >
                  Balance:
                </p>
              </td>

              <td
                style={{
                  border: "1px solid black",
                  padding: "0px",
                  width: "75px",
                  verticalAlign: "bottom",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                    fontWeight: "600",
                    paddingBottom: "3px",
                    margin: "0px",
                    borderTop: "1.4px solid black",
                    borderBottom: "1.4px solid black",
                    borderRight: "0px solid black",
                    borderLeft: "0px solid black",
                    paddingLeft: "8px",
                    paddingRight: "8px",
                    height: "16px",
                  }}
                ></p>
                <p
                  style={{
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                    fontWeight: "600",
                    paddingBottom: "3px",
                    margin: "0px",
                    borderTop: "0px solid black",
                    borderBottom: "0px solid black",
                    borderRight: "0px solid black",
                    borderLeft: "0px solid black",
                    paddingLeft: "8px",
                    paddingRight: "8px",
                    height: "15px",
                  }}
                ></p>
                <p
                  style={{
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                    fontWeight: "600",
                    paddingBottom: "3px",
                    margin: "0px",
                    borderTop: "1.4px solid black",
                    borderBottom: "0px solid black",
                    borderRight: "0px solid black",
                    borderLeft: "0px solid black",
                    paddingLeft: "8px",
                    paddingRight: "8px",
                    height: "15px",
                  }}
                ></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UploadExcelFile;
