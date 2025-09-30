import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getItems, addInvoice } from "../apis/api.js";

const InvoiceAdd = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerAddress: "",
    customerPhone: "",
    item: [{ itemID: "", quantity: "", discount: "" }],
  });
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleItemInputChange = (e, index) => {
    const { name, value } = e.target;
    if (typeof value === "object") {
      console.error("Invalid value for input:", value); // Debug
      return; // Prevent updating state with an object
    }
    const updatedItems = [...formData.item];
    const newValue =
      name === "quantity" || name === "discount"
        ? value && !isNaN(value)
          ? Number(value)
          : ""
        : value;
    updatedItems[index] = { ...updatedItems[index], [name]: newValue };
    console.log("Updated item at index", index, ":", updatedItems[index]);
    setFormData((prev) => ({ ...prev, item: updatedItems }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data", formData);
    if (
      !formData.customerName ||
      !formData.customerAddress ||
      !formData.customerPhone ||
      formData.item.some(
        (i) =>
          !i.itemID ||
          i.quantity === "" ||
          typeof i.quantity !== "number" ||
          isNaN(i.quantity) ||
          i.quantity < 1
      )
    ) {
      toast.error(
        "Customer name, address, phone, and valid item details (item ID and quantity) are required."
      );
      return;
    }

    const cleanedFormData = {
      ...formData,
      item: formData.item.map((item) => ({
        itemID: item.itemID,
        quantity: isNaN(Number(item.quantity)) ? 0 : Number(item.quantity),
        discount: isNaN(Number(item.discount)) ? 0 : Number(item.discount),
      })),
    };

    console.log("Submitting cleaned formData:", cleanedFormData);

    setIsLoading(true);
    try {
      // Replace with your actual API call
      const response = await addInvoice(cleanedFormData);
      if (response?.success) {
        toast.success("Invoice added successfully");
        localStorage.removeItem("invoiceData");
        navigate("/invoices");
      } else {
        toast.error(response?.error?.message || "Failed to add invoice");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }

    window.close();
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getItems();
        console.log("getItems response:", response); // Debug
        setItems(Array.isArray(response?.data) ? response.data : []);
        if (!Array.isArray(response?.data)) {
          toast.error("Invalid data format from server");
        }
      } catch (error) {
        console.error("getItems error:", error); // Debug
        setItems([]);
        toast.error(error.message || "Error fetching items");
      }
    };
    fetchItems();
  }, []);

  //   useEffect(() => {
  //     const savedData = localStorage.getItem("invoiceData");
  //     if (savedData && savedData !== "undefined") {
  //       try {
  //         setFormData(JSON.parse(savedData));
  //       } catch (error) {
  //         console.error("Failed to parse invoiceData from localStorage:", error);
  //         localStorage.removeItem("invoiceData");
  //       }
  //     }
  //   }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("invoiceData");
    if (savedData && savedData !== "undefined") {
      try {
        const parsedData = JSON.parse(savedData);
        if (
          parsedData &&
          typeof parsedData === "object" &&
          Array.isArray(parsedData.item) &&
          parsedData.item.every(
            (i) =>
              (typeof i === "object" && !i.quantity) ||
              typeof i.quantity !== "object"
          )
        ) {
          setFormData(parsedData);
        } else {
          console.warn("Invalid localStorage data structure, clearing...");
          localStorage.removeItem("invoiceData");
        }
      } catch (error) {
        console.error("Failed to parse invoiceData from localStorage:", error);
        localStorage.removeItem("invoiceData");
      }
    }
  }, []);

  useEffect(() => {
    if (formData) {
      localStorage.setItem("invoiceData", JSON.stringify(formData));
    }
  }, [formData]);

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      item: [...prev.item, { itemID: "", quantity: "", discount: "" }],
    }));
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formData.item.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, item: updatedItems }));
  };

  return (
    <div>
      <header>
        <h2 className="header-h2">Add New Invoice</h2>
      </header>
      <form onSubmit={handleSubmit}>
        <div className="item-container">
          <div className="input-container">
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="item-input"
              placeholder=" "
              disabled={isLoading}
            />
            <span className="placeholder">Customer Name</span>
          </div>

          <div className="input-container">
            <input
              type="text"
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleChange}
              className="item-input"
              placeholder=" "
              disabled={isLoading}
            />
            <span className="placeholder">Customer Address</span>
          </div>

          <div className="input-container">
            <input
              type="text"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              className="item-input"
              placeholder=" "
              disabled={isLoading}
            />
            <span className="placeholder">Customer Mobile Number</span>
          </div>

          {formData.item.map((item, index) => (
            <div key={index}>
              <div className="input-container">
                <select
                  name="itemID"
                  value={item.itemID}
                  onChange={(e) => handleItemInputChange(e, index)}
                  className="item-input"
                  disabled={isLoading}
                >
                  <option value="">Select an item</option>
                  {Array.isArray(items) &&
                    items.length > 0 &&
                    items
                      .sort((a, b) =>
                        (a?.itemName || "").localeCompare(b?.itemName || "")
                      )
                      .map((item) => (
                        <option key={item?._id} value={item?._id}>
                          {item?.itemName || "Unknown"}
                        </option>
                      ))}
                </select>
              </div>

              <div className="input-container">
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemInputChange(e, index)}
                  className="item-input"
                  placeholder=" "
                  disabled={isLoading}
                  min={1}
                />
                <span className="placeholder">Quantity</span>
              </div>

              <div className="input-container">
                <input
                  type="number"
                  name="discount"
                  value={item.discount}
                  onChange={(e) => handleItemInputChange(e, index)}
                  className="item-input"
                  placeholder=" "
                  min={0}
                  disabled={isLoading}
                />
                <span className="placeholder">Discount</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <button type="button" onClick={handleAddItem} disabled={isLoading}>
            Add Item
          </button>

          {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}

          <button
            type="submit"
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

export default InvoiceAdd;
