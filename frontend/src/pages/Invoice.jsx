import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "../components/Loading.jsx";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { MdPrint } from "react-icons/md";
import { invoiceGets } from "../apis/api.js";
import { useModal } from "../components/GlobalModal.jsx";

const Invoice = () => {
  const [invoice, setInvoice] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const openAddInvoice = () => {
    window.electronAPI?.openPopup(`/invoice-add`);
  };

  const openUpdateDeleteInvoice = (invoiceID) => {
    window.electronAPI?.openPopup(`/invoice-update-delete/${invoiceID}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await invoiceGets();
        if (response?.success) {
          console.log(response);
          setInvoice(response.data);
        } else {
          toast.error(response.error.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="overview-container">
        <header>
          <h1 className="header-h1-other">Invoice</h1>
        </header>

        <section className="add-button-section">
          <button onClick={() => openAddInvoice()} className="add-button">
            + Add Invoice
          </button>
        </section>

        <div className="container-items-inventory">
          {Array.isArray(invoice) && invoice.length > 0 ? (
            <table className="table-items-inventory">
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Customer Name</th>
                  <th>Customer Address</th>
                  <th>Customer Phone</th>
                  <th>Total</th>
                  <th>Sale date</th>
                  <th>Response</th>
                </tr>
              </thead>
              <tbody>
                {invoice.map((invoice) => (
                  <tr
                    key={invoice?._id}
                    onDoubleClick={() => openUpdateDeleteInvoice(invoice?._id)}
                  >
                    <td>{invoice?.invoiceNo}</td>
                    <td>{invoice?.customerName}</td>
                    <td>{invoice?.customerAddress}</td>
                    <td>{invoice?.customerPhone}</td>
                    <td>{formatNumber(invoice?.total)}</td>
                    <td>{formatDate(invoice?.createdAt)}</td>
                    <td onClick={() => navigate(`/print/${invoice?._id}`)}>
                      <MdPrint />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No Invoices</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invoice;
