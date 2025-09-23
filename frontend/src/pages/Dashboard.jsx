// import React from "react";
// import { getItems } from "../apis/api.js";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import ItemAdd from "./ItemAdd.jsx";
// import CategoryAdd from "./CategoryAdd.jsx";
// import ItemUpdateDelete from "./ItemUpdateDelete.jsx";
// import { useEffect } from "react";
// import { Buffer } from "buffer";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [items, setItems] = useState();

//   const bufferConvertString = (company) => {
//     const convertedCompanyID = company?._id
//       ? Buffer.from(company._id.buffer).toString("hex")
//       : null;
//     return convertedCompanyID;
//   };

//   const formatNumber = (value) => {
//     return Number(value || 0).toLocaleString("en-US", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     });
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getItems();

//         if (response) {
//           console.log(response);
//           setItems(response.data);
//         }
//       } catch (error) {
//         toast.error(error.message);
//       }
//     };

//     fetchData();
//   }, []);
//   return (
//     <div>
//       <div className="p-6">
//         <button popoverTarget="addItem">Add Item</button>

//         <div id="addItem" popover="auto">
//           <ItemAdd />
//         </div>

//         <button popoverTarget="addCategory">Add Category</button>

//         <div id="addCategory" popover="auto">
//           <CategoryAdd />
//         </div>
//       </div>

//       <div>
//         {Array.isArray(items) && items.length > 0 ? (
//           <table border={"1"}>
//             <thead>
//               <tr>
//                 <th>item code</th>
//                 <th>item name</th>
//                 <th>category</th>
//                 <th>unit price</th>
//                 <th>selling price</th>
//                 <th>discount</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {Array.isArray(items) &&
//                 [...items].map((item) => (
//                   <tr key={item?._doc?._id || item?._id}>
//                     <div id="updateDeleteItem" popover="auto">
//                       <ItemUpdateDelete
//                         itemID={bufferConvertString(item?._doc)}
//                       />
//                     </div>
//                     <td>{item?._doc?.itemCode || item?.itemCode}</td>
//                     <td>{item?._doc?.itemName || item?.itemName}</td>
//                     <td>{item?._doc?.categoryID._id.categoryName}</td>
//                      <td>{item?._doc?.unitPrice || item?.unitPrice}</td>
//                       <td>{item?._doc?.sellingPrice || item?.sellingPrice}</td>
//                         <td>{item?._doc?.discount || item?.discount}</td>

//                     <td></td>
//                     <td>
//                       <button
//                         popoverTarget={`updateDeleteItem-${
//                           item?._doc?._id || item?._id
//                         }`}
//                       >
//                         Action
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         ) : (
//           <div>Empty items...</div>
//         )}

//         {Array.isArray(items) &&
//           items.map((item) => (
//             <div
//               key={`popover-${item?._doc?._id || item?._id}`}
//               id={`updateDeleteItem-${item?._doc?._id || item?._id}`}
//               popover="auto"
//               className="bg-white p-4 rounded-lg shadow-lg max-w-md border border-gray-200"
//             >
//               <ItemUpdateDelete
//                 itemID={bufferConvertString(item?._doc || item)}
//               />
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React from "react";
import { getItems } from "../apis/api.js";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ItemAdd from "./ItemAdd.jsx";
import CategoryAdd from "./CategoryAdd.jsx";
import ItemUpdateDelete from "./ItemUpdateDelete.jsx";
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const bufferConvertString = (company) => {
    const convertedCompanyID = company?._id
      ? Buffer.from(company._id.buffer).toString("hex")
      : null;
    return convertedCompanyID;
  };

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getItems();
        if (response) {
          console.log(response);
          setItems(response.data);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          popovertarget="addItem"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 w-full sm:w-auto"
        >
          Add Item
        </button>
        <div
          id="addItem"
          popover="auto"
          className="bg-white p-4 rounded-lg shadow-lg max-w-md border border-gray-200"
        >
          <ItemAdd />
        </div>

        <button
          popovertarget="addCategory"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 w-full sm:w-auto"
        >
          Add Category
        </button>
        <div
          id="addCategory"
          popover="auto"
          className="bg-white p-4 rounded-lg shadow-lg max-w-md border border-gray-200"
        >
          <CategoryAdd />
        </div>
      </div>

      {/* Items Table */}
      {Array.isArray(items) && items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Item Code</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Item Name</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 hidden sm:table-cell">Category</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 hidden md:table-cell">Unit Price</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 hidden md:table-cell">Selling Price</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 hidden lg:table-cell">Discount</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item?._doc?._id || item?._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-600">{item?._doc?.itemCode || item?.itemCode}</td>
                  <td className="p-3 text-sm text-gray-600">{item?._doc?.itemName || item?.itemName}</td>
                  <td className="p-3 text-sm text-gray-600 hidden sm:table-cell">
                    {item?._doc?.categoryID._id.categoryName || item?.categoryID?._id?.categoryName}
                  </td>
                  <td className="p-3 text-sm text-gray-600 hidden md:table-cell">
                    {formatNumber(item?._doc?.unitPrice || item?.unitPrice)}
                  </td>
                  <td className="p-3 text-sm text-gray-600 hidden md:table-cell">
                    {formatNumber(item?._doc?.sellingPrice || item?.sellingPrice)}
                  </td>
                  <td className="p-3 text-sm text-gray-600 hidden lg:table-cell">
                    {formatNumber(item?._doc?.discount || item?.discount)}
                  </td>
                  <td className="p-3 text-sm">
                    <button
                      popovertarget={`updateDeleteItem-${item?._doc?._id || item?._id}`}
                      className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Action
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-600 py-8">No items available...</div>
      )}

      {/* Popover for Update/Delete */}
      {Array.isArray(items) &&
        items.map((item) => (
          <div
            key={`popover-${item?._doc?._id || item?._id}`}
            id={`updateDeleteItem-${item?._doc?._id || item?._id}`}
            popover="auto"
            className="bg-white p-4 rounded-lg shadow-lg max-w-md border border-gray-200"
          >
            <ItemUpdateDelete itemID={bufferConvertString(item?._doc || item)} />
          </div>
        ))}
    </div>
  );
};

export default Dashboard;