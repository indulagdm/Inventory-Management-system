import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { updateStock } from "../apis/api.js";

const UpdateStock = () => {
  const [formData, setFormData] = useState({
    stock: "",
  });

  const [isLoading, setIsLoading] = useState();

  const navigate = useNavigate();
  const { itemID } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to:`, value);
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

    if (formData.stock && parseInt(formData.stock) < 0) {
      toast.error("Stock cannot be negative.");
      return;
    }

    setIsLoading(true);
    try {
      const updatedData = {
        ...formData,
        stock: formData.stock ? parseInt(formData.stock) : 0,
      };

      const response = await updateStock(itemID, updatedData);

      if (response?.success) {
        toast.success("Stock updated successfully");
        navigate("/");
        window.close();
      } else {
        toast.error(response?.error?.message || "Failed to update stock");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50"
            placeholder="Enter stock"
            step="1"
            disabled={isLoading}
          />
        </div>

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateStock;
