import React, { useState, useEffect } from "react";
import { getInvoices } from "../apis/api.js";
import { toast } from "react-toastify";
import Loading from "../components/Loading.jsx";
import { useNavigate } from "react-router-dom";

const Invoice = () => {
  const [invoice, setInvoice] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const openAddInvoice = () => {
    window.electronAPI.send("open-add-invoice");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getInvoices();
        if (response) {
          console.log(response);
          setInvoice(response.data);
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

  if (isLoading) return <Loading />;

  return (
    <div>
      <header>
        <h1 className="header-h1">Invoice</h1>
      </header>

      <section className="add-button-section">
        <button onClick={() => openAddInvoice()} className="add-button">
          Add Category
        </button>
      </section>

      <div className="container-item">
        {Array.isArray(invoice) && invoice.length > 0 ? (
          <table className="table-item">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Customer Name</th>
                <th>Customer Address</th>
                <th>Customer Phone</th>
                <th>Total</th>
                <th>Response</th>
              </tr>
            </thead>
            <tbody>
              {invoice.map((invoice) => (
                <tr
                  key={invoice?._doc?._id || invoice?._id}
                  // onClick={() => openUpdateDeleteItem(item?._id)}
                >
                  <td>{invoice?._doc?.invoiceNo || invoice?.invoiceNo}</td>
                  <td>
                    {invoice?._doc?.customerName || invoice?.customerName}
                  </td>
                  <td>
                    {invoice?._doc?.customerAddress || invoice?.customerAddress}
                  </td>
                  <td>
                    {invoice?._doc?.customerPhone || invoice?.customerPhone}
                  </td>
                  <td>
                    {formatNumber(invoice?._doc?.total || invoice?.total)}
                  </td>
                  <td>
                    <button
                      onClick={()=>navigate(
                        `/print/${
                          invoice?._doc?._id || invoice?._id
                        }`
                      )}
                    >
                      Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ marginLeft: "5rem" }}>No Invoices</p>
        )}
      </div>
    </div>
  );
};

export default Invoice;
