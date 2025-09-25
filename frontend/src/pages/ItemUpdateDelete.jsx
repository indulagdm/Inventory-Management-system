import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  updateItem,
  deleteItem,
  getCategories,
  getItemByID,
} from "../apis/api.js";
import { useParams, useNavigate } from "react-router-dom";
import "./PopUpStyles.css"

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

  console.log("Received itemID:", itemID, typeof itemID);

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

      const response = await updateItem(itemID, updatedData);

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
      const response = await deleteItem(itemID);
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
        const categoriesResponse = await getCategories();
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
          const itemResponse = await getItemByID(itemID);
          if (itemResponse?.success) {
            const item = itemResponse.data;
            console.log("Fetched item full response:", itemResponse);
            console.log(
              "Fetched item.categoryID:",
              item.categoryID,
              typeof item.categoryID
            );
            let categoryIdValue = "";
            if (
              item.categoryID &&
              typeof item.categoryID === "object" &&
              item.categoryID._id
            ) {
              categoryIdValue = item.categoryID._id;
              console.log("Extracted _id:", categoryIdValue);
            } else if (typeof item.categoryID === "string") {
              categoryIdValue = item.categoryID;
              console.log("Used string categoryID:", categoryIdValue);
            } else {
              console.log(
                "categoryID is invalid or undefined:",
                item.categoryID
              );
            }
            setFormData({
              itemCode: item.itemCode || "",
              itemName: item.itemName || "",
              categoryID: categoryIdValue,
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

  useEffect(() => {
    console.log(
      "FormData categoryID:",
      formData.categoryID,
      typeof formData.categoryID
    );
  }, [formData]);

  return (
    // <div className="max-w-lg mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg border border-gray-200">
    //   <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800">
    //     Item Details
    //   </h2>
    //   <form onSubmit={handleSubmit} className="space-y-4">
    //     {/* Input fields remain the same */}
    //     <div>
    //       <label className="block text-sm font-medium text-gray-700 mb-1">
    //         Item Code
    //       </label>
    //       <input
    //         type="text"
    //         name="itemCode"
    //         value={formData.itemCode}
    //         onChange={handleChange}
    //         className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50"
    //         placeholder="Enter item code"
    //         disabled={isLoading}
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium text-gray-700 mb-1">
    //         Item Name
    //       </label>
    //       <input
    //         type="text"
    //         name="itemName"
    //         value={formData.itemName}
    //         onChange={handleChange}
    //         className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50"
    //         placeholder="Enter item name"
    //         disabled={isLoading}
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium text-gray-700 mb-1">
    //         Category
    //       </label>
    //       <select
    //         name="categoryID"
    //         value={formData.categoryID}
    //         onChange={handleChange}
    //         className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50"
    //         disabled={isLoading}
    //       >
    //         <option value="">Select a category</option>
    //         {Array.isArray(categories) && categories.length ? (
    //           [...categories]
    //             .sort((a, b) => a.categoryName.localeCompare(b.categoryName))
    //             .map((category) => (
    //               <option key={category._id} value={category._id}>
    //                 {category.categoryName}
    //               </option>
    //             ))
    //         ) : (
    //           <option value="" disabled>
    //             No categories available
    //           </option>
    //         )}
    //       </select>
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium text-gray-700 mb-1">
    //         Description
    //       </label>
    //       <input
    //         type="text"
    //         name="description"
    //         value={formData.description}
    //         onChange={handleChange}
    //         className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50"
    //         placeholder="Enter description"
    //         disabled={isLoading}
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium text-gray-700 mb-1">
    //         Unit Price
    //       </label>
    //       <input
    //         type="number"
    //         name="unitPrice"
    //         value={formData.unitPrice}
    //         onChange={handleChange}
    //         className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50"
    //         placeholder="Enter unit price"
    //         step="0.01"
    //         disabled={isLoading}
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium text-gray-700 mb-1">
    //         Selling Price
    //       </label>
    //       <input
    //         type="number"
    //         name="sellingPrice"
    //         value={formData.sellingPrice}
    //         onChange={handleChange}
    //         className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50"
    //         placeholder="Enter selling price"
    //         step="0.01"
    //         disabled={isLoading}
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium text-gray-700 mb-1">
    //         Discount
    //       </label>
    //       <input
    //         type="number"
    //         name="discount"
    //         value={formData.discount}
    //         onChange={handleChange}
    //         className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50"
    //         placeholder="Enter discount"
    //         step="0.01"
    //         disabled={isLoading}
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium text-gray-700 mb-1">
    //         Stock
    //       </label>
    //       <input
    //         type="number"
    //         name="stock"
    //         value={formData.stock}
    //         onChange={handleChange}
    //         className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50"
    //         placeholder="Enter stock"
    //         step="1"
    //         disabled={isLoading}
    //       />
    //     </div>

    //     {/* Other input fields remain the same */}

    //     <div className="flex flex-col sm:flex-row gap-3">
    //       <button
    //         type="submit"
    //         className={`flex-1 py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm transition-colors duration-200 ${
    //           isLoading ? "opacity-50 cursor-not-allowed" : ""
    //         }`}
    //         disabled={isLoading}
    //       >
    //         {isLoading ? "Updating..." : "Update"}
    //       </button>

    //       <button
    //         type="button"
    //         onClick={handleDelete}
    //         className={`flex-1 py-2.5 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm transition-colors duration-200 ${
    //           isLoading ? "opacity-50 cursor-not-allowed" : ""
    //         }`}
    //         disabled={isLoading}
    //       >
    //         {isLoading ? "Deleting..." : "Delete"}
    //       </button>
    //     </div>
    //   </form>
    // </div>

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
