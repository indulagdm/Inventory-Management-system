import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { getItems } from "../apis/api.js";
import { toast } from "react-toastify";

const Category = () => {
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

  const openAddCategory = () => {
    window.electronAPI.send("open-add-category");
  };

  return (
    <div>
      <header>
        <h1 className="header-h1">Category</h1>
      </header>

      <section className="add-button-section">
        <button onClick={() => openAddCategory()} className="add-button">
          Add Category
        </button>
      </section>

      <div className="container">
        {Array.isArray(items) && items.length > 0 ? (
          <div className="table-container">
            <table className="table">
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
                    // onClick={() => openUpdateDeleteItem(item?._id)}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="">No items available...</div>
        )}
      </div>
    </div>
  );
};

export default Category;
