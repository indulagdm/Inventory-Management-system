import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PrintPreview from "../components/PrintPreview.jsx";
import { FaArrowLeft } from "react-icons/fa6";
import { invoicePrint } from "../apis/api.js";

const PrintInvoice = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { invoiceID } = useParams();
 

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await invoicePrint(invoiceID);
        setHtmlContent(response.html);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [invoiceID]);

  if (loading) return <div>Loading report...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div className="report-container">
      <div >
        <FaArrowLeft
          onClick={() => navigate(`/invoices`)}
          style={{
            marginLeft: "2%",
            marginTop: "3.5rem",
            marginRight: "28%",
            cursor: "pointer",
          }}
        />
        <h1>Invoice Report Preview</h1>
      </div>

      <PrintPreview htmlContent={htmlContent} />
    </div>
  );
};

export default PrintInvoice;
