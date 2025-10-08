import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getRecentTransactionAll } from "../apis/api.js";
import Loading from "../components/Loading.jsx";

const Transaction = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);

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

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await getRecentTransactionAll();
        if (response.success) {
          setItems(response.data);
        } else {
          toast.error(response.error.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllTransactions();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="overview-container">
        <header>
          <h1 className="header-h1-other">Transactions</h1>
        </header>

        <div className="container-items-inventory">
          {Array.isArray(items) && items.length > 0 ? (
            <table className="table-items-inventory">
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Unit Price</th>
                  <th>Selling Price</th>
                  <th>Discount</th>
                  <th>No of Items</th>
                  <th>Type</th>
                  <th>Purchase/Sale date</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item?._id}
                    // onClick={() => openUpdateStock(item?._id)}
                    className={
                      item?.status === "purchase" ? "text-green" : "text-red"
                    }
                  >
                    <td>{item?.itemID?.itemCode}</td>
                    <td>{item?.itemID?.itemName}</td>
                    <td>{item?.itemID?.categoryID?.categoryName}</td>
                    <td>{formatNumber(item?.itemID?.unitPrice)}</td>
                    <td>{formatNumber(item?.itemID?.sellingPrice)}</td>
                    <td>{formatNumber(item?.itemID?.discount)}</td>
                    <td>{item?.stock}</td>
                    <td>{item?.status}</td>
                    <td>{formatDate(item?.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No Transactions</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transaction;
