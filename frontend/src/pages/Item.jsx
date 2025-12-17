import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./Dashboard.css";
import Loading from "../components/Loading.jsx";
import { itemGets } from "../apis/api.js";
import { useModal } from "../components/GlobalModal.jsx";
import ItemAdd from "./ItemAdd.jsx";
import ItemUpdateDelete from "./ItemUpdateDelete.jsx";
import { useNavigate } from "react-router-dom";

const Item = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { openModal, confirmDelete } = useModal();

  const navigate = useNavigate();

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
        const response = await itemGets();
        console.log("response of items", response);
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

  const openAddItem = () => {
    window.electronAPI?.openPopup(`/item-add`);
  };

  const openUpdateDeleteItem = (itemID) => {
    window.electronAPI?.openPopup(`/item-update-delete/${itemID}`);
  };

  const openUpdateStock = (itemID) => {
    window.electronAPI?.openPopup(`/item-update-stock/${itemID}`);
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
                <tr key={item?._doc?._id || item?._id}>
                  <td onClick={() => openUpdateDeleteItem(item?._id)}>
                    {item?._doc?.itemCode || item?.itemCode}
                  </td>
                  <td onClick={() => openUpdateDeleteItem(item?._id)}>
                    {item?._doc?.itemName || item?.itemName}
                  </td>
                  <td onClick={() => openUpdateDeleteItem(item?._id)}>
                    {item?._doc?.categoryDetails[0].categoryName ||
                      item?.categoryDetails[0]?.categoryName}
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
                  <td onClick={() => openUpdateStock(item?._id)}>
                    {item?._doc?.stock || item?.stock}
                  </td>
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
