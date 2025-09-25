import React from "react";
import { getItems } from "../apis/api.js";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ItemAdd from "./ItemAdd.jsx";
import CategoryAdd from "./CategoryAdd.jsx";
import ItemUpdateDelete from "./ItemUpdateDelete.jsx";
import { Buffer } from "buffer";
import "./Dashboard.css";

const Dashboard = () => {
  const [items, setItems] = useState([]);

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getItems();
        if (response) {
          console.log(response);
          setItems(response.data);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchData();
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

  return (
    <div className="container">
      <div className="">

        <header>

        </header>
      </div>

      {/* Items Table */}
      {Array.isArray(items) && items.length > 0 ? (
        <div className="table-container">
          <table className="table" border={1}>
            <thead className="table-header">
              <tr>
                <th className="table-header-row">Item Code</th>
                <th className="table-header-row">Item Name</th>
                <th className="table-header-row">Category</th>
                <th className="table-header-row">Unit Price</th>
                <th className="table-header-row">Selling Price</th>
                <th className="table-header-row">Discount</th>
                <th className="table-header-row">No of Items</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item?._doc?._id || item?._id}
                  className="table-body-tr"
                  onClick={() => openUpdateStock(item?._id)}
                >
                  <td className="table-body-td">
                    {item?._doc?.itemCode || item?.itemCode}
                  </td>
                  <td className="table-body-td">
                    {item?._doc?.itemName || item?.itemName}
                  </td>
                  <td className="table-body-td">
                    {item?._doc?.categoryID.categoryName ||
                      item?.categoryID?.categoryName}
                  </td>
                  <td className="table-body-td">
                    {formatNumber(item?._doc?.unitPrice || item?.unitPrice)}
                  </td>
                  <td className="table-body-td">
                    {formatNumber(
                      item?._doc?.sellingPrice || item?.sellingPrice
                    )}
                  </td>
                  <td className="table-body-td">
                    {formatNumber(item?._doc?.discount || item?.discount)}
                  </td>
                  <td className="table-body-td">
                    {item?._doc?.stock || item?.stock}
                    {/* <button
                      onClick={() => openUpdateDeleteItem(item?._id)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Action
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-600 py-8">
          No items available...
        </div>
      )}

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
    </div>
  );
};

export default Dashboard;
