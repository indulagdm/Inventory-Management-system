import React, { useState } from "react";
import { toast } from "react-toastify";
import { createCategory } from "../apis/api.js";

const CategoryAdd = () => {
  const [formData, setFormData] = useState({ categoryName: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.categoryName) {
      toast.error("Category name is required.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createCategory({
        ...formData,
        categoryName: formData.categoryName || undefined,
      });

      if (response?.success) {
        toast.success("Category added successfully");
        window.location.reload();
      } else {
        toast.error(response?.error?.message || "Failed to add category");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Add New Category
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Category Name
          </label>
          <input
            type="text"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter Category"
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
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CategoryAdd;
