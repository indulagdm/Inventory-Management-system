import React, { useState, useEffect } from "react";
import { getItems } from "../apis/api.js";
import { toast } from "react-toastify";
import "./Dashboard.css";
import Loading from "../components/Loading.jsx";
import { MdOutlineUpdate } from "react-icons/md";

const Item = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

    fetchData();
  }, []);

  // const items = [
  //   {
  //     _id:"1",
  //     itemCode:"1255",
  //     itemName:"Solar panel",
  //   },
  //   {
  //     _id:"2",
  //     itemCode:"1256",
  //     itemName:"Solar Light"
  //   }

  // ]

  const openAddItem = () => {
    window.electronAPI.send("open-add-item");
  };

  const openUpdateDeleteItem = (itemID) => {
    window.electronAPI.send("open-update-delete-item", itemID);
  };

  const openUpdateStock = (itemID) => {
    window.electronAPI.send("open-update-stock", itemID);
  };

  if (isLoading) return <Loading />;
  return (
    <div className="overview-container">
      <header>
        <h1 className="header-h1-other">Items</h1>
      </header>

      <section className="add-button-section">
        <button onClick={() => openAddItem()} className="add-button">
          + Add Item
        </button>
      </section>

      <div className="container-items-inventory">
        {Array.isArray(items) &&
        items.filter((item) => item?.status === "show").length > 0 ? (
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
                >
                  <td onClick={() => openUpdateDeleteItem(item?._id)}>{item?._doc?.itemCode || item?.itemCode}</td>
                  <td onClick={() => openUpdateDeleteItem(item?._id)}>{item?._doc?.itemName || item?.itemName}</td>
                  <td onClick={() => openUpdateDeleteItem(item?._id)}>
                    {item?._doc?.categoryID.categoryName ||
                      item?.categoryID?.categoryName}
                  </td>
                  <td onClick={() => openUpdateDeleteItem(item?._id)}>
                    {formatNumber(item?._doc?.unitPrice || item?.unitPrice)}
                  </td>
                  <td onClick={() => openUpdateDeleteItem(item?._id)}>
                    {formatNumber(
                      item?._doc?.sellingPrice || item?.sellingPrice
                    )}
                  </td>
                  <td onClick={() => openUpdateDeleteItem(item?._id)}>
                    {formatNumber(item?._doc?.discount || item?.discount)}
                  </td>
                  <td onClick={() => openUpdateStock(item?._id)}>{item?._doc?.stock || item?.stock}</td>
                  
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
