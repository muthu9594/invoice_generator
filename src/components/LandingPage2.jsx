import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Tray from "../Tray.jpg";

function App() {
  const [data, setData] = useState([]);
  const invoiceRef = useRef();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);
      setData(sheetData);
    };

    reader.readAsBinaryString(file);
  };

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  const handleDownloadPdf = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('invoice.pdf');
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={handlePrint}>Print</button>
      <button onClick={handleDownloadPdf}>Download PDF</button>
      {data.length > 0 && (
        <div ref={invoiceRef} style={{ width: '450px' }}>
          <div style={{ border: '1px solid black' }}>
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <h4 style={{ textDecoration: 'underline', margin: '0px' }}>Cash Memo</h4>
              <h4 style={{ margin: '0px', position: 'absolute', right: '10px' }}>Mob: 8108098410</h4>
            </div>
            <img
              style={{ height: '50px', width: '50px', position: 'absolute', left: '30px', top: '315px' }}
              src={Tray}
              alt="tray"
            />
            <h1 style={{ fontFamily: "'DM Serif Text', serif", fontWeight: '600', margin: '0px' }}>KS EGG CENTER</h1>
            <p style={{ margin: '0px' }}>
              Shop No 3, Parijat Tower Opp, Sunshrushti Complex,
              <br />
              Saki Vihar Road, Chandivali Mumbai - 400 022
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                margin: '0px',
                height: '35px',
              }}
            >
              <h3 style={{ margin: '0px', position: 'absolute', left: '5px' }}>No:</h3>
              <h2 style={{ margin: '0px' }}>Name</h2>
              <p style={{ position: 'relative', left: '95px' }}>
                Date: <span style={{ textDecoration: 'underline' }}>05/04/2024</span>
              </p>
            </div>
          </div>
          <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '450px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>TRAY</th>
                <th style={{ border: '1px solid black', padding: '8px', borderBottom: '1px solid black' }}>QUANTITY</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>RATE</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>AMOUNT</th>
              </tr>
            </thead>
            <tbody style={{ height: '300px' }}>
              {data.map((row, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', width: '50px', borderBottom: '1px solid black' }}>{row.TRAY}</td>
                  <td
                    style={{
                      border: '1px solid black',
                      padding: '8px',
                      width: '150px',
                      borderBottom: '1px solid black',
                      position: 'relative',
                    }}
                  >
                    <div style={{ position: 'absolute', top: '20px', left: '30px' }}>
                      <p style={{ fontWeight: '600', fontSize: '1.4', marginBottom: '0px' }}>Previous Balance</p>
                      <p style={{ fontSize: '1.5rem', paddingTop: '0px', marginTop: '5px' }}>{row.QUANTITY}</p>
                    </div>
                    <div style={{ position: 'absolute', top: '150px', left: '30px' }}>
                      <p style={{ fontWeight: '600', fontSize: '1.4', marginBottom: '0px' }}>CASH ONLINE</p>
                    </div>
                  </td>
                  <td
                    style={{
                      border: '1px solid black',
                      padding: '0',
                      width: '65px',
                      textAlign: 'left',
                      verticalAlign: 'bottom',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '13px',
                        whiteSpace: 'nowrap',
                        fontWeight: '600',
                        paddingBottom: '3px',
                        margin: '0px',
                        borderTop: '1.4px solid black',
                        borderBottom: '1.4px solid black',
                        borderRight: '0px solid black',
                        borderLeft: '0px solid black',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                      }}
                    >
                      Total Amount:
                    </p>
                    <p
                      style={{
                        fontSize: '13px',
                        whiteSpace: 'nowrap',
                        fontWeight: '600',
                        paddingBottom: '3px',
                        margin: '0px',
                        borderTop: '0px solid black',
                        borderBottom: '0px solid black',
                        borderRight: '0px solid black',
                        borderLeft: '0px solid black',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                      }}
                    >
                      Cash Paid:
                    </p>
                    <p
                      style={{
                        fontSize: '13px',
                        whiteSpace: 'nowrap',
                        fontWeight: '600',
                        paddingBottom: '3px',
                        margin: '0px',
                        borderTop: '1.4px solid black',
                        borderBottom: '0px solid black',
                        borderRight: '0px solid black',
                        borderLeft: '0px solid black',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                      }}
                    >
                      Balance:
                    </p>
                  </td>
                  <td
                    style={{
                      border: '1px solid black',
                      padding: '0px',
                      width: '75px',
                      verticalAlign: 'bottom',
                    }}
                  >
                    <div style={{ position: 'relative', bottom: '90px', borderBottom: '1px solid black' }}>
                      <p style={{ margin: '0' }}>previous balance</p>
                      <p style={{ margin: '0', paddingTop: '3px' }}>
                        <span style={{ left: '2px', position: 'absolute' }}>+</span>Amount
                      </p>
                    </div>
                    <div style={{ position: 'relative', bottom: '100px' }}>
                      <p>prev bal + amount</p>
                      <div style={{ position: 'absolute', top: '50px', left: '30px' }}>
                        <p>G</p>
                        <p>H</p>
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: '13px',
                        whiteSpace: 'nowrap',
                        fontWeight: '600',
                        paddingBottom: '3px',
                        margin: '0px',
                        borderTop: '1.4px solid black',
                        borderBottom: '1.4px solid black',
                        borderRight: '0px solid black',
                        borderLeft: '0px solid black',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        height: '16px',
                      }}
                    ></p>
                    <p
                      style={{
                        fontSize: '13px',
                        whiteSpace: 'nowrap',
                        fontWeight: '600',
                        paddingBottom: '3px',
                        margin: '0px',
                        borderTop: '0px solid black',
                        borderBottom: '0px solid black',
                        borderRight: '0px solid black',
                        borderLeft: '0px solid black',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        height: '17px',
                      }}
                    ></p>
                    <p
                      style={{
                        fontSize: '13px',
                        whiteSpace: 'nowrap',
                        fontWeight: '600',
                        paddingBottom: '3px',
                        margin: '0px',
                        borderTop: '1.4px solid black',
                        borderBottom: '0px solid black',
                        borderRight: '0px solid black',
                        borderLeft: '0px solid black',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        height: '15px',
                      }}
                    >
                      J
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              borderBottom: '1px solid black',
              borderRight: '1px solid black',
              borderLeft: '1px solid black',
              display: 'flex',
              height: '50px',
            }}
          >
            <p style={{ padding: '0', margin: '0', paddingLeft: '5px', paddingTop: '5px' }}>Thank You!</p>
            <p style={{ padding: '0', margin: '0', paddingLeft: '215px', paddingTop: '5px' }}>For KS EGG CENTER</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
