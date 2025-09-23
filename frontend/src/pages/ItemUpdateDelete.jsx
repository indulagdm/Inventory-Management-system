// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import {
//   updateItem,
//   deleteItem,
//   getCategories,
//   getItemByID,
// } from "../apis/api.js";

// const ItemUpdateDelete = ({ itemID }) => {
//   const [formData, setFormData] = useState({
//     itemCode: "",
//     itemName: "",
//     categoryID: "",
//     description: "",
//     unitPrice: "",
//     sellingPrice: "",
//     discount: "",
//     stock: "",
//   });
//   const [categories, setCategories] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     if (!itemID) return;
//     e.preventDefault();

//     const confirmUpdate = window.confirm(
//       "Are you want to update Item details?"
//     );
//     if (!confirmUpdate) return;

//     if (!formData.itemCode || !formData.itemName) {
//       toast.error("Item code and item name are required.");
//       return;
//     }

//     if (formData.unitPrice && parseFloat(formData.unitPrice) < 0) {
//       toast.error("Unit price cannot be negative.");
//       return;
//     }
//     if (formData.sellingPrice && parseFloat(formData.sellingPrice) < 0) {
//       toast.error("Selling price cannot be negative.");
//       return;
//     }
//     if (formData.discount && parseFloat(formData.discount) < 0) {
//       toast.error("Discount cannot be negative.");
//       return;
//     }
//     if (formData.stock && parseInt(formData.stock) < 0) {
//       toast.error("Stock cannot be negative.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const updatedData = {
//         ...formData,
//         unitPrice: formData.unitPrice ? parseFloat(formData.unitPrice) : 0,
//         sellingPrice: formData.sellingPrice
//           ? parseFloat(formData.sellingPrice)
//           : 0,
//         discount: formData.discount ? parseFloat(formData.discount) : 0,
//         stock: formData.stock ? parseInt(formData.stock) : 0,
//         categoryID: formData.categoryID || undefined, // Avoid empty string
//       };

//       const response = await updateItem(itemID, updatedData);

//       if (response?.success) {
//         toast.success("Item updated successfully");
//         window.location.reload();
//       } else {
//         toast.error(response?.error?.message || "Failed to update item");
//       }
//     } catch (error) {
//       toast.error(error.message || "An error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async (e) => {
//     e.preventDefault();

//     const confirmDelete = window.confirm(
//       "Are you want to delete Item details?"
//     );
//     if (!confirmDelete) return;
//     setIsLoading(true);
//     try {
//       const response = await deleteItem(itemID);
//       if (response?.success) {
//         toast.success("Item deleted successfully");
//         window.location.reload();
//       } else {
//         toast.error(response?.error?.message || "Failed to delete item");
//       }
//     } catch (error) {
//       toast.error(error.message || "An error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await getCategories();
//         if (response?.success && Array.isArray(response.data)) {
//           setCategories(Array.isArray(response.data) ? response.data : []);
//         } else {
//           setCategories([]);
//           toast.error(response?.error?.message || "Failed to load categories");
//         }
//       } catch (error) {
//         setCategories([]);
//         toast.error(error.message || "Error fetching categories");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (!itemID) return;

//     const fetchItemDetails = async () => {
//       setIsLoading(true);
//       try {
//         const response = await getItemByID(itemID);
//         if (response?.success) {
//           const item = response.data;
//           setFormData({
//             itemCode: item.itemCode || "",
//             itemName: item.itemName || "",
//             categoryID: item.categoryID?._id || "",
//             description: item.description || "",
//             unitPrice: item.unitPrice || "",
//             sellingPrice: item.sellingPrice || "",
//             discount: item.discount || "",
//             stock: item.stock || "",
//           });
//         } else {
//           toast.error(response?.error?.message || "Failed to fetch item");
//         }
//       } catch (error) {
//         toast.error(error.message || "An error occurred");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchItemDetails();
//   }, [itemID]);

//   return (
//     <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Item Details</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Item Code
//             </label>
//             <input
//               type="text"
//               name="itemCode"
//               value={formData.itemCode}
//               onChange={handleChange}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Enter item code"
//               disabled={isLoading}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Item Name
//             </label>
//             <input
//               type="text"
//               name="itemName"
//               value={formData.itemName}
//               onChange={handleChange}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Enter item name"
//               disabled={isLoading}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Category
//             </label>
//             <select
//               name="categoryID"
//               value={formData.categoryID}
//               onChange={handleChange}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//               disabled={isLoading}
//             >
//               <option value="">Select a category</option>
//               {Array.isArray(categories) && categories.length ? (
//                 [...categories]
//                   .sort((a, b) => a.categoryName.localeCompare(b.categoryName))
//                   .map((category) => (
//                     <option key={category._id} value={category._id}>
//                       {category.categoryName}
//                     </option>
//                   ))
//               ) : (
//                 <option value="" disabled>
//                   No categories available
//                 </option>
//               )}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Description
//             </label>
//             <input
//               type="text"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Enter description"
//               disabled={isLoading}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Unit Price
//             </label>
//             <input
//               type="number"
//               name="unitPrice"
//               value={formData.unitPrice}
//               onChange={handleChange}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Enter unit price"
//               step="0.01"
//               disabled={isLoading}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Selling Price
//             </label>
//             <input
//               type="number"
//               name="sellingPrice"
//               value={formData.sellingPrice}
//               onChange={handleChange}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Enter selling price"
//               step="0.01"
//               disabled={isLoading}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Discount
//             </label>
//             <input
//               type="number"
//               name="discount"
//               value={formData.discount}
//               onChange={handleChange}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Enter discount"
//               step="0.01"
//               disabled={isLoading}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Stock
//             </label>
//             <input
//               type="number"
//               name="stock"
//               value={formData.stock}
//               onChange={handleChange}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Enter stock"
//               step="1"
//               disabled={isLoading}
//             />
//           </div>

//           <button
//             type="button"
//             className={`w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
//               isLoading ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//             disabled={isLoading}
//           >
//             {isLoading ? "Updating..." : "Update"}
//           </button>
//         </div>
//       </form>

//       <button
//         type="button"
//         onClick={handleDelete} 
//         className={`w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
//           isLoading ? "opacity-50 cursor-not-allowed" : ""
//         }`}
//         disabled={isLoading}
//       >
//         {isLoading ? "Deleting..." : "Delete"}
//       </button>
//     </div>
//   );
// };

// export default ItemUpdateDelete;

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  updateItem,
  deleteItem,
  getCategories,
  getItemByID,
} from "../apis/api.js";

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

    const confirmUpdate = window.confirm("Are you sure you want to update item details?");
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
        sellingPrice: formData.sellingPrice ? parseFloat(formData.sellingPrice) : 0,
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        stock: formData.stock ? parseInt(formData.stock) : 0,
        categoryID: formData.categoryID || undefined,
      };

      const response = await updateItem(itemID, updatedData);

      if (response?.success) {
        toast.success("Item updated successfully");
        window.location.reload();
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

    const confirmDelete = window.confirm("Are you sure you want to delete item details?");
    if (!confirmDelete) return;
    setIsLoading(true);
    try {
      const response = await deleteItem(itemID);
      if (response?.success) {
        toast.success("Item deleted successfully");
        window.location.reload();
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
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response?.success && Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          setCategories([]);
          toast.error(response?.error?.message || "Failed to load categories");
        }
      } catch (error) {
        setCategories([]);
        toast.error(error.message || "Error fetching categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!itemID) return;

    const fetchItemDetails = async () => {
      setIsLoading(true);
      try {
        const response = await getItemByID(itemID);
        if (response?.success) {
          const item = response.data;
          setFormData({
            itemCode: item.itemCode || "",
            itemName: item.itemName || "",
            categoryID: item.categoryID?._id || "",
            description: item.description || "",
            unitPrice: item.unitPrice || "",
            sellingPrice: item.sellingPrice || "",
            discount: item.discount || "",
            stock: item.stock || "",
          });
        } else {
          toast.error(response?.error?.message || "Failed to fetch item");
        }
      } catch (error) {
        toast.error(error.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemID]);

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800">Item Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Code
          </label>
          <input
            type="text"
            name="itemCode"
            value={formData.itemCode}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50"
            placeholder="Enter item code"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name
          </label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50"
            placeholder="Enter item name"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="categoryID"
            value={formData.categoryID}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50"
            disabled={isLoading}
          >
            <option value="">Select a category</option>
            {Array.isArray(categories) && categories.length ? (
              [...categories]
                .sort((a, b) => a.categoryName.localeCompare(b.categoryName))
                .map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.categoryName}
                  </option>
                ))
            ) : (
              <option value="" disabled>
                No categories available
              </option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50"
            placeholder="Enter description"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit Price
          </label>
          <input
            type="number"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50"
            placeholder="Enter unit price"
            step="0.01"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selling Price
          </label>
          <input
            type="number"
            name="sellingPrice"
            value={formData.sellingPrice}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50"
            placeholder="Enter selling price"
            step="0.01"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount
          </label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50"
            placeholder="Enter discount"
            step="0.01"
            disabled={isLoading}
          />
        </div>

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

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className={`flex-1 py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm transition-colors duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className={`flex-1 py-2.5 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm transition-colors duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemUpdateDelete;

