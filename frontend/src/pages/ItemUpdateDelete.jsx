import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  updateItem,
  deleteItem,
  getCategories,
  getItemByID,
} from "../apis/api.js";
import { Buffer } from "buffer";

const ItemUpdateDelete = ({ itemID }) => {
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

     if (name === "categoryID") {
      // store only the _id string for backend
      setFormData((prev) => ({
        ...prev,
        categoryID: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const bufferConvertString = (company) => {
    const convertedCompanyID = company?._id
      ? Buffer.from(company._id.buffer).toString("hex")
      : null;
    return convertedCompanyID;
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.itemCode || !formData.itemName) {
      toast.error("Item code and item name are required.");
      return;
    }

    setIsLoading(true);
    try {
      //   const response = await updateItem({
      //     itemID,
      //     ...formData,
      //     categoryID: formData.categoryID || undefined,
      //     cost: formData.cost ? parseFloat(formData.cost) : 0,
      //     sellingPrice: formData.sellingPrice
      //       ? parseFloat(formData.sellingPrice)
      //       : 0,
      //     discount: formData.discount ? parseFloat(formData.discount) : 0,
      //   });

      const response = await updateItem(itemID, formData);

      if (response?.success) {
        toast.success("Item updated successfully");
        navigate("/");
      } else {
        toast.error(response?.error?.message || "Failed to add item");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handelDelete = async () => {
    try {
      const response = await deleteItem(itemID);
      if (response?.success) {
        toast.success("Item deleted.");
        navigate("/");
      } else {
        toast.error(response?.error?.message);
      }
    } catch (error) {
      toast.error(error.message || "An error occurs.");
    } finally {
      setIsLoading(false);
    }
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

    const fetchItemDetails = async () => {
      try {
        const response = await getItemByID(itemID);

        if (response?.success) {
          setFormData(response.data);
          console.log(response)
        } else {
          toast.error(response?.error?.message || "Failed to fetch item");
        }
      } catch (error) {
        toast.error(error.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
    fetchItemDetails();
  }, [itemID]);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Item Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Item Code
          </label>
          <input
            type="text"
            name="itemCode"
            value={formData.itemCode}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter item code"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Item Name
          </label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter item name"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="categoryID"
            value={formData.categoryID.categoryName}
            id="categoryID"
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          >
            <option value="">Select a category</option>
            {categories
              .sort((a, b) =>
                (a?._doc?.categoryName || "").localeCompare(
                  b?._doc?.categoryName || ""
                )
              )
              .map((category) => (
                <option
                  key={bufferConvertString(category?._doc)}
                  value={bufferConvertString(category?._doc)}
                >
                  {category._doc.categoryName || "Unknown"}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter description"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Unit Price
          </label>
          <input
            type="number"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter cost"
            step="0.01"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Selling Price
          </label>
          <input
            type="number"
            name="sellingPrice"
            value={formData.sellingPrice}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter selling price"
            step="0.01"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Discount
          </label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter discount"
            step="0.01"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter stock"
            step="0.01"
            disabled={isLoading}
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className={`w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update"}
        </button>

        <button
          type="button"
          onClick={handelDelete}
          className={`w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default ItemUpdateDelete;
