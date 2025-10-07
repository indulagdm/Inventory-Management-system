import React from "react";
import {
  getItems,
  getNumberOfStock,
  getNumberOfInStock,
  getNumberOfOutOfStock,
} from "../apis/api.js";
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
  const [noStock, setNoStock] = useState();
  const [noInStock, setNoInStock] = useState();

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getItems();
        if (response) {
          console.log(response);
          setItems(response.data);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchNumberOfStock = async () => {
      try {
        setIsLoading(true);
        const response = await getNumberOfStock();
        setNoStock(response.data);
        console.log("stock", response);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchNumberOfInStock = async () => {
      try {
        const response = await getNumberOfInStock();
        setNoInStock(response.data);
        console.log("In stock", response.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchNumberOfOutOFStock = async () => {
      try {
        const response = await getNumberOfOutOfStock();
        setNoInStock(response.data);
        console.log("Out stock", response.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    fetchNumberOfStock();
    fetchNumberOfInStock();
    fetchNumberOfOutOFStock();
  }, []);

  // const openAddItem = () => {
  //   window.electronAPI.send("open-add-item");
  // };

  // const openAddCategory = () => {
  //   window.electronAPI.send("open-add-category");
  // };

  const openUpdateStock = (itemID) => {
    window.electronAPI.send("open-update-stock", itemID);
  };

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
      <header>
        <h1 className="header-h1">Inventory Overview</h1>
      </header>

      <div className="container-items-with-summary">
        <section className="total-items">
          <h2 className="total-item-header">Total Items</h2>
          <p>{noStock}</p>
        </section>

        <section className="total-items">
          <h2 className="total-item-header">Items in stock</h2>
          <p>{noInStock}</p>
        </section>

        <section className="total-items">
          <h2 className="total-item-header">Low Stock</h2>
          <p>{}</p>
        </section>
      </div>

      <div className="container-recent-transactions"></div>

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
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item?._doc?._id || item?._id}
                  onClick={() => openUpdateStock(item?._id)}
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

      <header>
        <h1 className="header-h1" style={{ color: "red" }}>
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
                    onClick={() => openUpdateStock(item?._id)}
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
  );
};

export default Dashboard;
