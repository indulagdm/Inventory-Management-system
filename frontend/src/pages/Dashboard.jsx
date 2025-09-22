import React from "react";
import { getItems } from "../apis/api.js";
import { useState } from "react";
import { toast } from "react-toastify";
import Popup from "../components/Popup.jsx";
import ItemAdd from "./ItemAdd.jsx";
import CategoryAdd from "./CategoryAdd.jsx";
import { useEffect } from "react";
import { Buffer } from "buffer";

const Dashboard = () => {
  const [isItemPopup, setIsItemPopup] = useState(false);
  const [isCategoryPopUp, setIsCategoryPopUp] = useState(false);
  const [items, setItems] = useState();

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
          console.log(response.data);
          setItems(response.data);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <div className="p-6">
        <button
          onClick={() => setIsCategoryPopUp(true)}
          // onClick={()=>navigate('/add-category')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Category
        </button>

        <Popup
          isOpen={isCategoryPopUp}
          onClose={() => setIsCategoryPopUp(false)}
          title="Add Category"
        >
          <CategoryAdd />
        </Popup>

        <button
          onClick={() => setIsItemPopup(true)}
          // onClick={()=>navigate('/add-category')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>

        <Popup
          isOpen={isItemPopup}
          onClose={() => setIsItemPopup(false)}
          title="Add Item"
        >
          <ItemAdd />
        </Popup>
      </div>

      <div>
        {Array.isArray(items) && items.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>item code</th>
                <th>item name</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(items) &&
                [...items].map((item) => (
                  <tr>
                    <td>{item._doc.itemCode}</td>
                    <td>{item._doc.itemName}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <div>
            Empty items...
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
