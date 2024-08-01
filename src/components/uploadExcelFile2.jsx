import React, { useState, useRef } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { Button } from "@mui/material";
import Tray from "../Tray.jpg";
import html2canvas from 'html2canvas';

const UploadExcelFile2 = () => {
  const [addedExcelfile, setAddedExcelFile] = useState(null);
  const [excelFileName, setExcelFileName] = useState(null);
  const [excelFileProgress, setExcelFileProgress] = useState(0);

  const excelInputRef = useRef();
  const hiddenContainerRef = useRef();

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

  const handleDownloadPdf = async () => {
    for (let i = 0; i < addedExcelfile.length; i++) {
      const item = addedExcelfile[i];

      // Create a new div for each item
      const invoiceDiv = document.createElement("div");
      invoiceDiv.style.width = "450px";
      invoiceDiv.style.maxWidth = "190mm";
      invoiceDiv.style.margin = "auto";
      invoiceDiv.style.border = "1px solid black";

      // Populate the div with the template content
      invoiceDiv.innerHTML = `
        <div style="border: 1px solid black">
          <div style="display: flex; justify-content: center; position: relative;">
            <h4 style="text-decoration: underline; margin: 0;">Cash Memo</h4>
            <h4 style="margin: 0; position: absolute; right: 10px;">Mob: 8108098410</h4>
          </div>
          <div style="position: relative;">
            <img id="trayImage" style="height: 50px; width: 50px; left: 18px; top: -15px; position: absolute;" src="${Tray}" alt="tray"/>
          </div>
          <h1 style="font-family: 'DM Serif Text', serif; font-weight: 600; margin: 0;">KS EGG CENTER</h1>
          <p style="margin: 0;">
            Shop No 3,Parijat Tower Opp, Sunshrushti Complex,
            <br/>
            Saki Vihar Road, Chandivali Mumbai - 400 022
          </p>
          <div style="display: flex; justify-content: center; align-items: center; position: relative; margin: 0; height: 35px;">
            <h3 style="margin: 0; position: absolute; left: 5px;">No: ${item["Bill Number"]}</h3>
            <h2 style="margin: 0;">${item.Name}</h2>
            <p style="position: relative; left: 95px;">Date: <span style="text-decoration: underline;">${excelFileName?.name}</span></p>
          </div>
        </div>
        <table style="border: 1px solid black; border-collapse: collapse; width: 450px;">
          <thead>
            <tr>
              <th style="border: 1px solid black; padding: 8px; border-bottom: 1px solid black;">TRAY</th>
              <th style="border: 1px solid black; padding: 8px; border-bottom: 1px solid black;">QUANTITY</th>
              <th style="border: 1px solid black; padding: 8px;">RATE</th>
              <th style="border: 1px solid black; padding: 8px;">AMOUNT</th>
            </tr>
          </thead>
          <tbody style="height: 300px;">
            <tr>
              <td style="border: 1px solid black; width: 50px; border-bottom: 1px solid black;"></td>
              <td style="border: 1px solid black; padding: 8px; width: 150px; border-bottom: 1px solid black; position: relative;">
                <div style="position: absolute; top: 20px; left: 30px;">
                  <p style="font-weight: 600; font-size: 1.4rem; margin-bottom: 0;">Previous Balance</p>
                  <p style="font-size: 1.5rem; padding-top: 0; margin-top: 5px;">${item.Egg * item.Rate}</p>
                </div>
                <div style="position: absolute; top: 150px; left: 30px;">
                  <p style="font-weight: 600; font-size: 1.4rem; margin-bottom: 0;">CASH ONLINE</p>
                </div>
              </td>
              <td style="border: 1px solid black; padding: 0; width: 65px; text-align: left; vertical-align: bottom;">
                <p style="font-size: 13px; white-space: nowrap; font-weight: 600; padding-bottom: 3px; margin: 0; border-top: 1.4px solid black; border-bottom: 1.4px solid black; border-right: 0; border-left: 0; padding-left: 8px; padding-right: 8px;">
                  Total Amount:
                </p>
                <p style="font-size: 13px; white-space: nowrap; font-weight: 600; padding-bottom: 3px; margin: 0; border-top: 0; border-bottom: 0; border-right: 0; border-left: 0; padding-left: 8px; padding-right: 8px;">
                  Cash Paid:
                </p>
                <p style="font-size: 13px; white-space: nowrap; font-weight: 600; padding-bottom: 3px; margin: 0; border-top: 1.4px solid black; border-bottom: 0; border-right: 0; border-left: 0; padding-left: 8px; padding-right: 8px;">
                  Balance:
                </p>
              </td>
              <td style="border: 1px solid black; padding: 0; width: 75px; vertical-align: bottom;">
                <div style="position: relative; bottom: 90px; border-bottom: 1px solid black;">
                  <p style="margin: 0;">${item["Previous Balance"]}</p>
                  <p style="margin: 0; padding-top: 3px;"><span style="left: 2px; position: absolute; bottom: 2px;">+</span>${item.Amount}</p>
                </div>
                <div style="position: relative; bottom: 100px;">
                  <p>${item["Previous Balance"] + item.Amount}</p>
                  <div style="position: absolute; top: 50px; left: 30px;">
                    <p>${item.Cash}</p>
                    <p>${item.Online}</p>
                  </div>
                </div>
                <p style="font-size: 13px; white-space: nowrap; font-weight: 600; padding-bottom: 3px; margin: 0; border-top: 1.4px solid black; border-bottom: 1.4px solid black; border-right: 0; border-left: 0; padding-left: 8px; padding-right: 8px; height: 16px;"></p>
                <p style="font-size: 13px; white-space: nowrap; font-weight: 600; padding-bottom: 3px; margin: 0; border-top: 0; border-bottom: 0; border-right: 0; border-left: 0; padding-left: 8px; padding-right: 8px; height: 17px;"></p>
                <p style="font-size: 13px; white-space: nowrap; font-weight: 600; padding-bottom: 3px; margin: 0; border-top: 1.4px solid black; border-bottom: 0; border-right: 0; border-left: 0; padding-left: 8px; padding-right: 8px; height: 16px;"></p>
                <p style="margin: 0; height: 17px; position: relative; left: 0; top: 1px; border-top: 0; border-bottom: 1.4px solid black; border-right: 0; border-left: 0; padding-left: 8px; padding-right: 8px;">
                  ${item["Previous Balance"] + item.Amount - item.Cash}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      `;

      // Append the div to the hidden container
      hiddenContainerRef.current.appendChild(invoiceDiv);

      // Use html2canvas to capture the div and create a PDF
      await html2canvas(invoiceDiv).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 0, 0);
        pdf.save(`Invoice_${i + 1}.pdf`);
      }).catch(error => {
        console.error("Error capturing image:", error);
      });

      // Remove the div after capturing it
      hiddenContainerRef.current.removeChild(invoiceDiv);
    }
  };

  const handleDeleteExcelFile = () => {
    setExcelFileName(null);
    setExcelFileProgress(0);
    setAddedExcelFile(null);
    excelInputRef.current.value = null;
  };

  return (
    <div>
      <div className="file-upload-container">
        <div className="file-upload-heading">
          <h2>Upload File</h2>
          <DeleteIcon
            className="delete-icon"
            onClick={handleDeleteExcelFile}
            style={{
              display: excelFileProgress === 100 ? "block" : "none",
            }}
          />
        </div>

        <div
          className="file-upload-area"
          onClick={() => excelInputRef.current.click()}
        >
          <input
            type="file"
            accept=".xlsx, .xls"
            ref={excelInputRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <div className="file-upload-icon">
            <FileUploadIcon />
          </div>
          <div className="file-upload-info">
            {excelFileProgress === 0 && <p>Drag & drop or click to upload</p>}
            {excelFileProgress > 0 && (
              <>
                <p>{excelFileName.name}</p>
                <div className="file-upload-progress">
                  <div
                    className="file-upload-progress-bar"
                    style={{ width: `${excelFileProgress}%` }}
                  ></div>
                </div>
                <p>{excelFileProgress}%</p>
              </>
            )}
          </div>
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadPdf}
          disabled={excelFileProgress < 100}
        >
          Download PDF
        </Button>
      </div>

      {/* Hidden container to hold the invoice divs */}
      <div ref={hiddenContainerRef} style={{ display: "none" }}></div>
    </div>
  );
};

export default UploadExcelFile2;
