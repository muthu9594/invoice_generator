import React, { useState, useRef } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { Button } from "@mui/material";
import Tray from "../Tray.jpg";
import html2canvas from 'html2canvas';


const UploadExcelFile = () => {
    const [addedExcelfile, setAddedExcelFile] = useState(null);
    const [excelFileName, setExcelFileName] = useState(null);
    const [excelFileProgress, setExcelFileProgress] = useState(0);
    const [toggle,setToggle] = useState(false);
  
    const excelInputRef = useRef();
    const invoiceRefs = useRef([]); // array of refs
  
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
  
 //  const handleFileUpload = (e) => {
 //     const file = e.target.files[0];
   //   setExcelFileName(file);
  //    console.log(file,"FILE");
   //   const reader = new FileReader();
   //   reader.onload = (event) => {
  //      const workbook = XLSX.read(event.target.result, { type: "binary" });
   //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];
     //   const data = XLSX.utils.sheet_to_json(sheet);
     //   setAddedExcelFile(data);
   //   };
  //    reader.readAsBinaryString(file);
   //   uploadExcelFile();
   // };

         const handleFileUpload = (e) => {
      const file = e.target.files[0];
       setExcelFileName(file);
       console.log(file, "FILE");
    
      const reader = new FileReader();
     reader.onload = (event) => {
         const workbook = XLSX.read(event.target.result, { type: "binary" });
         const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
    
         // Specify that headers are in the second row (index 1) and the data starts from the third row (index 2)
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 1 });
    
        // Extract headers from the second row and data from the rest
         const headers = data[0];
        const rows = data.slice(1);
    
        // Convert rows to objects with headers as keys
         const formattedData = rows.map(row => {
           return headers.reduce((acc, header, index) => {
           acc[header] = row[index];
            return acc;
           }, {});
         });
    
        setAddedExcelFile(formattedData);
      };
       reader.readAsBinaryString(file);
       uploadExcelFile();
     };

    
    
  
    const deleteUploadedExcelFile = () => {
      setAddedExcelFile(null);
      setExcelFileName(null);
      setExcelFileProgress(0);
      if (excelInputRef.current) {
        excelInputRef.current.value = null;
      }
    };
  
    const handleDownloadPdf = async () => {
      for (let i = 0; i < invoiceRefs.current.length; i++) {
        const element = invoiceRefs.current[i];
        if (!element) continue; // skip if ref is not assigned
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          unit: 'mm',
          format: 'a4',
        });
        const a4Width = 210;
        const a4Height = 297;
        const imgProperties = pdf.getImageProperties(data);
        const imgWidth = imgProperties.width;
        const imgHeight = imgProperties.height;
        const desiredWidth = a4Width * 0.55;
        const desiredHeight = a4Height * 0.55;
        const scaleWidth = desiredWidth / imgWidth;
        const scaleHeight = desiredHeight / imgHeight;
        const scaleFactor = Math.min(scaleWidth, scaleHeight);
        const pdfWidth = imgWidth * scaleFactor;
        const pdfHeight = imgHeight * scaleFactor;
        const xOffset = (a4Width - pdfWidth) / 2;
        const yOffset = (a4Height - pdfHeight) / 2;
        pdf.addImage(data, 'PNG', xOffset, yOffset, pdfWidth, pdfHeight);
        pdf.save(`invoice_${i + 1}.pdf`);
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
        // <Button
        //   variant="contained"
        //   style={{ marginTop: "10px" }}
        //   onClick={generateInvoice}
        // >
        //   Generate Invoices
        // </Button>
        <Button onClick={handleDownloadPdf}>Download PDF</Button>

      )}
      <div style={{height:"600px",overflow:"auto"}}>

    
    { addedExcelfile?.length > 0 &&  
    
    addedExcelfile.map((data,index)=>(
        <div style={{ width: "450px", maxWidth: "190mm", margin: "auto",paddingBottom:"20px" }}    ref={(el) => (invoiceRefs.current[index] = el)}>
        
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
          <div style={{position:"relative" }}
          >
          <img
            style={{ height: "50px", width: "50px",left:"18px",top:"-15px", position:"absolute" }}
            src={Tray}
            alt="tray"
          />
          </div>
        
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
            <h3 style={{ margin: "0px",position:"absolute",left:"5px" }}>No: {addedExcelfile[0]?.["Bill Number"]}</h3>
            <h2 style={{ margin: "0px",paddingRight:"15px" }}>{addedExcelfile[0].Name}</h2>
            <p style={{ position: "relative", left: "95px",fontWeight:"700" }}>
              {" "}
              Date:
              <span style={{ textDecoration: "underline",fontSize:"1.2rem" }}>{excelFileName.name.replace(/\.[^/.]+$/, ``)}</span>
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
                  position:"relative"
                }}
              >
                <div style={{position:"absolute",top:"20px" ,left:"30px" }}>
                    <p style={{fontWeight:"600", fontSize:"1.4",marginBottom:"0px"}}>Previous Balance</p>
                    <p style={{fontSize:"1.5rem",paddingTop:"0px",marginTop:"5px"}}>{data.Egg * data.Rate}</p>
                </div>

                <div style={{position:"absolute",top:"150px" ,left:"30px"}}>
                    <p style={{fontWeight:"600", fontSize:"1.4",marginBottom:"0px"}}>CASH ONLINE</p>
                    
                </div>


              </td>
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
                <div style={{position:"relative",bottom:"90px" , borderBottom:"1px solid black"}}>
                    <p style={{margin:"0"}}>{data?.["Previous Balance"]}</p>
                  <p style={{margin:"0",paddingTop:"3px"}}><span style={{left:"2px",position:"absolute", bottom:"2px"}}>+</span>{addedExcelfile[0]?.Amount}</p>
                </div> 
                <div style={{position:"relative", bottom:"100px"}}>
                    <p> {data?.["Previous Balance"] +data?.Amount}</p>

                    <div style={{position:"absolute", top:"50px", left:"30px"}}>
                    <p>{data.Cash}</p>
                    <p>{data.Online}</p>
                </div>
                </div>
             
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
                    height: "17px",
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
                > {data?.["Current Balance"]}</p>
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{borderBottom:"1px solid black", borderRight:"1px solid black", borderLeft:"1px solid black", display:"flex",height:"50px"}}>
       
                <p style={{padding:"0",margin:"0",paddingLeft:"5px",paddingTop:"5px"}}>Thank You!</p>
           
                <p style={{padding:"0",margin:"0",paddingLeft:"215px",paddingTop:"5px"}}>For KS EGG CENTER</p>
                 
        </div>
      </div>

    ))
    
   }
     </div>
    </div>
  );
};

export default UploadExcelFile;
