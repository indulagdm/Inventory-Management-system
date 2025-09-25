import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createItem, getCategories } from "../apis/api.js";
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";
import "./PopUpStyles.css";

const ItemAdd = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.itemCode || !formData.itemName) {
      toast.error("Item code and item name are required.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createItem({
        ...formData,
        categoryID: formData.categoryID || undefined,
        unitPrice: formData.unitPrice ? parseFloat(formData.unitPrice) : 0,
        sellingPrice: formData.sellingPrice
          ? parseFloat(formData.sellingPrice)
          : 0,
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        stock: formData.stock ? parseFloat(formData.stock) : 0,
      });

      if (response?.success) {
        toast.success("Item added successfully");
        navigate("/");
      } else {
        toast.error(response?.error?.message || "Failed to add item");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }

    window.close();
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response?.data) {
          setCategories(Array.isArray(response.data) ? response.data : []);
        } else {
          setCategories([]);
          toast.error("Failed to load categories");
        }
      } catch (error) {
        setCategories([]);
        toast.error(error.message || "Error fetching categories");
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <header>
        <h2 className="header-h2">Add New Item</h2>
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
            />
            <span className="placeholder">Stock</span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="add-button-item"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemAdd;
