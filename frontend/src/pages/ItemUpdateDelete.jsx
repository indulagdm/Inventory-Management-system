import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  itemUpdate,
  itemDelete,
  categoryGets,
  itemGetByID,
} from "../apis/api.js";
import { useParams, useNavigate } from "react-router-dom";
import "./PopUpStyles.css";
import Loading from "../components/Loading.jsx";

const ItemUpdateDelete = () => {
  const [formData, setFormData] = useState({
    itemCode: "",
    itemName: "",
    categoryID: "",
    description: "",
    unitPrice: "",
    sellingPrice: "",
    discount: "",
    stock: "",
  });

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { itemID } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if (!itemID) return;
    e.preventDefault();

    const confirmUpdate = window.confirm(
      "Are you sure you want to update item details?"
    );
    if (!confirmUpdate) return;

    if (!formData.itemCode || !formData.itemName) {
      toast.error("Item code and item name are required.");
      return;
    }

    if (formData.unitPrice && parseFloat(formData.unitPrice) < 0) {
      toast.error("Unit price cannot be negative.");
      return;
    }
    if (formData.sellingPrice && parseFloat(formData.sellingPrice) < 0) {
      toast.error("Selling price cannot be negative.");
      return;
    }
    if (formData.discount && parseFloat(formData.discount) < 0) {
      toast.error("Discount cannot be negative.");
      return;
    }
    if (formData.stock && parseInt(formData.stock) < 0) {
      toast.error("Stock cannot be negative.");
      return;
    }

    setIsLoading(true);
    try {
      const updatedData = {
        ...formData,
        unitPrice: formData.unitPrice ? parseFloat(formData.unitPrice) : 0,
        sellingPrice: formData.sellingPrice
          ? parseFloat(formData.sellingPrice)
          : 0,
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        stock: formData.stock ? parseInt(formData.stock) : 0,
        categoryID: formData.categoryID || undefined,
      };

      const response = await itemUpdate(itemID, updatedData);

      if (response?.success) {
        toast.success("Item updated successfully");
        navigate("/");
        window.close();
      } else {
        toast.error(response?.error?.message || "Failed to update item");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete item details?"
    );
    if (!confirmDelete) return;
    setIsLoading(true);
    try {
      const response = await itemDelete(itemID);
      if (response?.success) {
        toast.success("Item deleted successfully");
        navigate("/");
        window.close();
      } else {
        toast.error(response?.error?.message || "Failed to delete item");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const categoriesResponse = await categoryGets();
        if (
          categoriesResponse?.success &&
          Array.isArray(categoriesResponse.data)
        ) {
          setCategories(categoriesResponse.data);
        } else {
          setCategories([]);
          toast.error(
            categoriesResponse?.error?.message || "Failed to load categories"
          );
        }

        if (itemID) {
          const itemResponse = await itemGetByID(itemID);
          if (itemResponse?.success) {
            const item = itemResponse.data;

            setFormData({
              itemCode: item.itemCode || "",
              itemName: item.itemName || "",
              categoryID: item.categoryID || "",
              description: item.description || "",
              unitPrice: item.unitPrice || "",
              sellingPrice: item.sellingPrice || "",
              discount: item.discount || "",
              stock: item.stock || "",
            });
          } else {
            toast.error(itemResponse?.error?.message || "Failed to fetch item");
          }
        }
      } catch (error) {
        toast.error(error.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [itemID]);

  if (isLoading) return <Loading />;

  return (
    <div>
      <header>
        <h2 className="header-h2">Update Item</h2>
      </header>
      <form onSubmit={handleSubmit}>
        <div className="item-container">
          <div className="input-container">
            {/* <label className="item-label">
              Item Code
            </label> */}
            <input
              type="text"
              name="itemCode"
              value={formData.itemCode}
              onChange={handleChange}
              className="item-input"
              placeholder=" "
              disabled={isLoading}
            />
            <span className="placeholder">Item Code</span>
          </div>

          <div className="input-container">
            {/* <label className="block text-sm font-medium text-gray-700">
              Item Name
            </label> */}
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              className="item-input"
              placeholder=" "
              disabled={isLoading}
            />
            <span className="placeholder">Item Name</span>
          </div>

          <div className="input-container">
            {/* <label className="block text-sm font-medium text-gray-700">
              Category
            </label> */}
            <select
              name="categoryID"
              value={formData.categoryID}
              onChange={handleChange}
              className="item-input"
              disabled={isLoading}
            >
              <option value="">
                <span className="placeholder">Select a category</span>
              </option>
              {categories
                .sort((a, b) =>
                  (a?.categoryName || "").localeCompare(b?.categoryName || "")
                )
                .map((category) => (
                  <option key={category?._id} value={category?._id}>
                    {category?.categoryName || "Unknown"}
                  </option>
                ))}
            </select>
          </div>

          <div className="input-container">
            {/* <label className="block text-sm font-medium text-gray-700">
              Description
            </label> */}
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="item-input"
              placeholder=" "
              disabled={isLoading}
            />
            <span className="placeholder">Description</span>
          </div>

          <div className="input-container">
            {/* <label className="block text-sm font-medium text-gray-700">
              Unit Price
            </label> */}
            <input
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              className="item-input"
              placeholder=" "
              step="0.01"
              disabled={isLoading}
            />
            <span className="placeholder">Unit Price</span>
          </div>

          <div className="input-container">
            {/* <label className="block text-sm font-medium text-gray-700">
              Selling Price
            </label> */}
            <input
              type="number"
              name="sellingPrice"
              value={formData.sellingPrice}
              onChange={handleChange}
              className="item-input"
              placeholder=" "
              step="0.01"
              disabled={isLoading}
            />
            <span className="placeholder">Selling Price</span>
          </div>

          <div className="input-container">
            {/* <label className="block text-sm font-medium text-gray-700">
              Discount
            </label> */}
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="item-input"
              placeholder=" "
              step="0.01"
              disabled={isLoading}
            />
            <span className="placeholder">Discount</span>
          </div>

          <div className="input-container">
            {/* <label className="block text-sm font-medium text-gray-700">
              Stock
            </label> */}
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="item-input"
              placeholder=" "
              step="0.01"
              disabled={isLoading}
              readOnly
            />
            <span className="placeholder">Stock</span>
          </div>

          <div className="button-container">
            <button
              type="submit"
              className="item-update-button"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="item-delete-button"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ItemUpdateDelete;
