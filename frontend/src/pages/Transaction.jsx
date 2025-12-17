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
        console.log(response);
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
                      item?.status === "PURCHASE" ? "text-green" : "text-red"
                    }
                  >
                    <td>{item?.old_data?.itemCode}</td>
                    <td>{item?.old_data?.itemName}</td>
                    <td>{item?.old_data?.categoryID?.categoryName}</td>
                    <td>{formatNumber(item?.old_data?.unitPrice)}</td>
                    <td>{formatNumber(item?.old_data?.sellingPrice)}</td>
                    <td>{formatNumber(item?.old_data?.discount)}</td>
                    <td>{item?.old_data?.stock}</td>
                    <td>{item?.old_data?.status}</td>
                    <td>{formatDate(item?.old_data?.createdAt)}</td>
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
