import React, { useState } from "react";
import { toast } from "react-toastify";
import { downloadReport } from "../apis/api.js";
import './PrintPreview.css'

const PrintPreview = ({ invoiceID, htmlContent }) => {
  const [isPrinting, setIsPrinting] = useState(false);

  console.log("invoice id", invoiceID);

  // const handlePrint = () => {
  // setIsPrinting(true);
  // const printWindow = window.open("", "_blank");
  // printWindow.document.write(htmlContent);
  // printWindow.document.close();

  // printWindow.onload = () => {
  //   printWindow.focus();
  //   printWindow.print();
  //   setIsPrinting(false);
  // };

  const handlePrint = () => {
    setIsPrinting(true);

    // Create a temporary iframe to print the content
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    // Write content to iframe
    iframe.contentDocument.write(htmlContent);
    iframe.contentDocument.close();

    // Wait for iframe content to load
    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      // Remove iframe after printing
      document.body.removeChild(iframe);
      setIsPrinting(false);
    };
  };

  const handleDownloadPDF = async () => {
    const response = await downloadReport(invoiceID, {
      htmlContent,
    });
    if (response.success) {
      toast.success(`PDF saved to: ${response.filePath}`);
    } else {
      toast.error(response.message || "PDF save canceled");
    }
  };

  return (
    <div className={"print_preview_container"}>
      <div className={"preview_header"}>
        <button
          onClick={handlePrint}
          disabled={isPrinting}
          style={{ marginLeft: "45%" }}
        >
          {isPrinting ? "Printing..." : "Print Document"}
        </button>
        <button onClick={handleDownloadPDF}>Download</button>
      </div>

      <div
        style={
          {
            // display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            // minHeight: "100vh", // Full viewport height for vertical centering
            // padding: "1rem", // Add some padding for smaller screens
            // boxSizing: "border-box",
          }
        }
      >
        <iframe
          title="invoice-preview"
          srcDoc={htmlContent}
          style={{
            width: "242mm",
            height: "297.2mm",
            border: "1px solid #ccc",
            marginLeft: "1rem",
          }}
        />
      </div>
    </div>
  );
};

export default PrintPreview;
