// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { createItem, getCategories } from "../apis/api.js";
// import { Buffer } from "buffer";

// const ItemAdd = () => {
//   const [formData, setFormData] = useState({
//     itemCode: "",
//     itemName: "",
//     categoryID: "",
//     description: "",
//     cost: "",
//     sellingPrice: "",
//     discount: "",
//   });
//   const [categories, setCategories] = useState("");

//   const navigate = useNavigate();

//   const handleChange = async (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventdefault();
//     console.log("Submitted data",formData)
//     try {
//       const response = await createItem(formData);
//       if (response?.success) {
//         toast.success("Item added");
//         console.log("API response:", response);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const bufferConvertString = (company) => {
//     const convertedCompanyID = company?._id
//       ? Buffer.from(company._id.buffer).toString("hex")
//       : null;
//     return convertedCompanyID;
//   };

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await getCategories();

//         if (response) {
//           setCategories(Array.isArray(response.data) ? response.data : []);
//           console.log(response.data);
//         }
//       } catch (error) {
//         toast.error(error.message);
//       }
//     };

//     fetchCategories();
//   }, []);

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <label>Item code</label>
//         <input
//           type="text"
//           name="itemCode"
//           onChange={handleChange}
//           value={formData.itemCode}
//         />
//         <label>Item Name</label>
//         <input
//           type="text"
//           name="itemName"
//           onChange={handleChange}
//           value={formData.itemName}
//         />

//         <label htmlFor="">Category</label>
//         <select
//           name="categoryID"
//           value={formData.categoryID}
//           onChange={handleChange}
//         >
//           <option value="">--</option>
//           {Array.isArray(categories) &&
//             [...categories]
//               .sort((a, b) =>
//                 a?._doc?.categoryName.localeCompare(b?._doc?.categoryName)
//               )
//               .map((category) => (
//                 <option key={category?._doc?._id} value={category?._doc?._id}>
//                   {category?._doc?.categoryName}
//                 </option>
//               ))}
//         </select>

//         <label>Description</label>
//         <input
//           type="text"
//           name="description"
//           onChange={handleChange}
//           value={formData.description}
//         />

//         <label>Cost</label>
//         <input
//           type="text"
//           name="cost"
//           onChange={handleChange}
//           value={formData.cost}
//         />

//         <label>Selling Price</label>
//         <input
//           type="text"
//           name="sellingPrice"
//           onChange={handleChange}
//           value={formData.sellingPrice}
//         />

//         <label>Discount</label>
//         <input
//           type="text"
//           name="discount"
//           onChange={handleChange}
//           value={formData.discount}
//         />

//         <input type="submit" value="Submit" />
//       </form>
//     </div>
//   );
// };

// export default ItemAdd;

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createItem, getCategories } from "../apis/api.js";
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";

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
        navigate("/")
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
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Item</h2>
      <form onSubmit={handleSubmit}>
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
              value={formData.categoryID}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isLoading}
            >
              <option value="">Select a category</option>
              {categories
                .sort((a, b) =>
                  (a?.categoryName || "").localeCompare(b?.categoryName || "")
                )
                .map((category) => (
                  <option
                    key={bufferConvertString(category)}
                    value={bufferConvertString(category)}
                  >
                    {category?.categoryName || "Unknown"}
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
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemAdd;
