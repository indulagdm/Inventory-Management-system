import React from "react";
import { getItems } from "../apis/api.js";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ItemAdd from "./ItemAdd.jsx";
import CategoryAdd from "./CategoryAdd.jsx";
import ItemUpdateDelete from "./ItemUpdateDelete.jsx";
import { Buffer } from "buffer";

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

  const openAddItem = () => {
    window.electronAPI.send("open-add-item");
  };

  const openAddCategory = () => {
    window.electronAPI.send("open-add-category");
  };

  const openUpdateDeleteItem = (itemID) => {
    window.electronAPI.send("open-update-delete-item", itemID); // Pass ID if editing specific item
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={() => openAddItem()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 w-full sm:w-auto"
        >
          Add Item
        </button>

        <button onClick={() => openAddCategory()}> Add Category</button>
      </div>

      {/* Items Table */}
      {Array.isArray(items) && items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Item Code
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Item Name
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Unit Price
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Selling Price
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Discount
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item?._doc?._id || item?._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3 text-sm text-gray-600">
                    {item?._doc?.itemCode || item?.itemCode}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {item?._doc?.itemName || item?.itemName}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {item?._doc?.categoryID.categoryName ||
                      item?.categoryID?.categoryName}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {formatNumber(item?._doc?.unitPrice || item?.unitPrice)}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {formatNumber(
                      item?._doc?.sellingPrice || item?.sellingPrice
                    )}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {formatNumber(item?._doc?.discount || item?.discount)}
                  </td>
                  <td className="p-3 text-sm">
                    <button
                      onClick={() =>
                        openUpdateDeleteItem(item?._id)
                      }
                      className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Action
                    </button>
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
