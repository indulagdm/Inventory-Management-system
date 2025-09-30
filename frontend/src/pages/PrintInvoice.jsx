import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PrintPreview from "../components/PrintPreview.jsx";
import { FaArrowLeft } from "react-icons/fa6";
import { invoicePrint } from "../apis/api.js";
import "./PrintInvoice.css";
import Loading from "../components/Loading.jsx";

const PrintInvoice = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { invoiceID } = useParams();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true);
        const response = await invoicePrint(invoiceID);
        setHtmlContent(response.html);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [invoiceID]);

  if (isLoading) return <Loading />;
  return (
    <div className="report-container">
      <div className="report-area">
        <div className="divider"></div>
        <div className="report-header">
          <FaArrowLeft onClick={() => navigate(`/invoices`)} className="fa-arrow-left"/>
          <h1>Invoice Report Preview</h1>
        </div>
      </div>
      <div className="report">
        <PrintPreview invoiceID={invoiceID} htmlContent={htmlContent}/>
      </div>
    </div>
  );
};

export default PrintInvoice;
