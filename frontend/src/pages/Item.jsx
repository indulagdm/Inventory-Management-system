import React, { useState, useEffect } from "react";
import { getItems } from "../apis/api.js";
import { toast } from "react-toastify";
import "./Dashboard.css";

const Item = () => {
  // const [items, setItems] = useState([]);

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
          // setItems(response.data);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchData();
  }, []);

  const items = [
    {
      _id:"1",
      itemCode:"1255",
      itemName:"Solar panel",
    },
    {
      _id:"2",
      itemCode:"1256",
      itemName:"Solar Light"
    }

  ]

  const openAddItem = () => {
    window.electronAPI.send("open-add-item");
  };

  const openUpdateDeleteItem = (itemID) => {
    window.electronAPI.send("open-update-delete-item", itemID);
  };
  return (
    <div>
      <header>
        <h1 className="header-h1">Items</h1>
      </header>

      <section className="add-button-section">
        <button onClick={() => openAddItem()} className="add-button">
          Add Item
        </button>
      </section>

      <div className="container-item">
        {Array.isArray(items) && items.length > 0 ? (
          <table className="table-item">
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
                  onClick={() => openUpdateDeleteItem(item?._id)}
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

export default Item;
