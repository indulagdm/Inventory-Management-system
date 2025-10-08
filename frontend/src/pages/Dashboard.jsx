import React from "react";
import { getItems, getRecentTransaction, getCategories } from "../apis/api.js";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ItemAdd from "./ItemAdd.jsx";
import CategoryAdd from "./CategoryAdd.jsx";
import ItemUpdateDelete from "./ItemUpdateDelete.jsx";
import { Buffer } from "buffer";
import "./Dashboard.css";
import Loading from "../components/Loading.jsx";

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [category, setCategory] = useState([]);

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
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getItems();
        if (response?.success) {
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

    const fetchRecentTransactions = async () => {
      try {
        const response = await getRecentTransaction();
        if (response?.success) {
          setRecentTransactions(response.data);
        } else {
          toast.error(response.error.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await getCategories();
        if (response.success) {
          setCategory(response.data);
        }else{
          toast.error(response.error.message)
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    fetchRecentTransactions();
    fetchCategories();
  }, []);

  // const openAddItem = () => {
  //   window.electronAPI.send("open-add-item");
  // };

  // const openAddCategory = () => {
  //   window.electronAPI.send("open-add-category");
  // };

  // const openUpdateStock = (itemID) => {
  //   window.electronAPI.send("open-update-stock", itemID);
  // };

  // const items = [
  //   {
  //     _id: "1",
  //     itemCode: "1255",
  //     itemName: "Solar panel",
  //   },
  //   {
  //     _id: "2",
  //     itemCode: "1256",
  //     itemName: "Solar Light",
  //   },
  // ];

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="overview-container">
        <header>
          <h1 className="header-h1-other">Inventory Overview</h1>
        </header>

        <div className="container-items-with-summary">
          <section className="total-items">
            <h2 className="total-item-header">Total Items</h2>
            <p>{items?.length}</p>
          </section>

          <section className="total-items">
            <h2 className="total-item-header">Items in stock</h2>
            <p>
              {items.filter((item) => item?.stockStatus === "in-stock").length}
            </p>
          </section>

          <section className="total-items">
            <h2 className="total-item-header">Total categories</h2>
            <p>
              {category?.length}
            </p>
          </section>

          <section className="total-items">
            <h2 className="total-item-header">Low Stock</h2>
            <p>
              {items.filter((item) => item?.stockStatus === "low-stock").length}
            </p>
          </section>
        </div>
      </div>

      <div className="overview-container">
        <header>
          <h1 className="header-h1-other">Recent Transactions</h1>
        </header>

        <div className="container-items-inventory">
          {Array.isArray(recentTransactions) &&
          recentTransactions.length > 0 ? (
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
                {recentTransactions.map((item) => (
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
            <p>No Items</p>
          )}
        </div>
      </div>

      {/* Popover for Update/Delete */}
      {/* {Array.isArray(items) &&
        items.map((item) => (
          <div
            key={`popover-${item?._doc?._id || item?._id}`}
            id={`updateDeleteItem-${item?._doc?._id || item?._id}`}
            popover="auto"
            className="bg-white p-4 rounded-lg shadow-lg max-w-md border border-gray-200"
          >
            <ItemUpdateDelete itemID={bufferConvertString(item?._doc || item)} />
          </div>
        ))} */}

      <div className="overview-container">
        <header>
          <h1 className="header-h1-other" style={{ color: "red" }}>
            Low Inventory
          </h1>
        </header>

        <div className="container-items-inventory">
          {Array.isArray(items) &&
          items.filter((item) => item?.stock <= 5).length > 0 ? (
            <table className="table-items-inventory" style={{ color: "red" }}>
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Unit Price</th>
                  <th>Selling Price</th>
                  <th>Discount</th>
                  <th>No of Items</th>
                </tr>
              </thead>
              <tbody>
                {items
                  .filter((item) => item?.stock <= 5)
                  .map((item) => (
                    <tr
                      key={item?._doc?._id || item?._id}
                      // onClick={() => openUpdateStock(item?._id)}
                    >
                      <td>{item?._doc?.itemCode || item?.itemCode}</td>
                      <td>{item?._doc?.itemName || item?.itemName}</td>
                      <td>
                        {item?._doc?.categoryID.categoryName ||
                          item?.categoryID?.categoryName}
                      </td>
                      <td>
                        {formatNumber(item?._doc?.unitPrice || item?.unitPrice)}
                      </td>
                      <td>
                        {formatNumber(
                          item?._doc?.sellingPrice || item?.sellingPrice
                        )}
                      </td>
                      <td>
                        {formatNumber(item?._doc?.discount || item?.discount)}
                      </td>
                      <td>{item?._doc?.stock || item?.stock}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p>No Items</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
