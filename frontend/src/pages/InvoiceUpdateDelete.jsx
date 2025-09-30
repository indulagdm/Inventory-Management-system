import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { getItems, getInvoiceByID, addInvoice } from "../apis/api.js";

const InvoiceUpdateDelete = () => {
  const [formData, setFormData] = useState({
    invoiceNo: "",
    customerName: "",
    customerAddress: "",
    customerPhone: "",
    item: [{ itemID: "", quantity: "", discount: "", total_item: "" }],
    // item: [],
    total: "",
  });
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { invoiceID } = useParams();

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
        toast.success("Invoice update successfully");
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getInvoiceByID(invoiceID);
        setFormData(response.data);
        console.log(response);
      } catch (error) {
        console.error("get invoices error:", error); // Debug
        toast.error(error.message || "Error fetching invoice");
      }
    };

    fetchData();
  }, [invoiceID]);

  //   useEffect(() => {
  //     const updatedItems = formData.item.map((item) => {
  //       const selectedItem = items.find((i) => i._id === item.itemID);
  //       const total_item = item.quantity * price - (item.discount || 0);
  //       return { ...item, total_item };
  //     });
  //     const total = updatedItems.reduce(
  //       (sum, item) => sum + (item.total_item || 0),
  //       0
  //     );
  //     setFormData((prev) => ({ ...prev, item: updatedItems, total }));
  //   }, [formData.item, items]);

  //   useEffect(() => {
  //     const savedData = localStorage.getItem("invoiceData");
  //     if (savedData && savedData !== "undefined") {
  //       try {
  //         const parsedData = JSON.parse(savedData);
  //         if (
  //           parsedData &&
  //           typeof parsedData === "object" &&
  //           Array.isArray(parsedData.item) &&
  //           parsedData.item.every(
  //             (i) =>
  //               (typeof i === "object" && !i.quantity) ||
  //               typeof i.quantity !== "object"
  //           )
  //         ) {
  //           setFormData(parsedData);
  //         } else {
  //           console.warn("Invalid localStorage data structure, clearing...");
  //           localStorage.removeItem("invoiceData");
  //         }
  //       } catch (error) {
  //         console.error("Failed to parse invoiceData from localStorage:", error);
  //         localStorage.removeItem("invoiceData");
  //       }
  //     }
  //   }, []);

  //   useEffect(() => {
  //     if (formData) {
  //       localStorage.setItem("invoiceData", JSON.stringify(formData));
  //     }
  //   }, [formData]);

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

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div>
      <header>
        <h2 className="header-h2">Update Invoice</h2>
      </header>

      <form>
        <div className="item-container">
          <div className="input-container">
            <input
              type="text"
              name="invoiceNo"
              value={formData.invoiceNo}
              onChange={handleChange}
              className="item-input"
              placeholder=" "
              disabled={isLoading}
              readOnly
            />
            <span className="placeholder">Invoice Number</span>
          </div>

          <div className="input-container">
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="item-input"
              placeholder=" "
              disabled={isLoading}
              readOnly
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
              readOnly
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
              readOnly
            />
            <span className="placeholder">Customer Mobile Number</span>
          </div>

          {Array.isArray(formData.item) && formData.item.length > 0 ? (
            <div>
              {/* <pre>{JSON.stringify(formData.item, null, 2)}</pre> */}

              <table className="table-invoice-item">
                <thead>
                  <tr>
                    <th className="th-table-name">Item Name</th>
                    <th className="th-table-qty">Qty</th>
                    <th className="th-table-discount">Discount</th>
                    <th className="th-table-total">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.item.map((item, index) => (
                    <tr key={index}>
                      <td className="td-table-name">{item.itemID.itemName}</td>
                      <td className="td-table-qty">{item.quantity}</td>
                      <td className="td-table-discount">{item.discount}</td>
                      <td className="td-table-total">
                        {formatNumber(item.total_item)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* // <div key={index}>
                //   <div className="input-container">
                //     <select
                //       name="itemID"
                //       value={item.itemID.itemName}
                //       onChange={(e) => handleItemInputChange(e, index)}
                //       className="item-input"
                //       disabled={isLoading}
                //     >
                //       <option value="">Select an item</option>
                //       {Array.isArray(items) &&
                //         items.length > 0 &&
                //         items
                //           .sort((a, b) =>
                //             (a?.itemName || "").localeCompare(b?.itemName || "")
                //           )
                //           .map((item) => (
                //             <option key={item?._id} value={item?._id}>
                //               {item?.itemName || "Unknown"}
                //             </option>
                //           ))}
                //     </select>
                //   </div>

                //   <div className="input-container">
                //     <input
                //       type="number"
                //       name="quantity"
                //       value={item.quantity}
                //       onChange={(e) => handleItemInputChange(e, index)}
                //       className="item-input"
                //       placeholder=" "
                //       disabled={isLoading}
                //       min={1}
                //     />
                //     <span className="placeholder">Quantity</span>
                //   </div>

                //   <div className="input-container">
                //     <input
                //       type="number"
                //       name="discount"
                //       value={item.discount}
                //       onChange={(e) => handleItemInputChange(e, index)}
                //       className="item-input"
                //       placeholder=" "
                //       min={0}
                //       disabled={isLoading}
                //     />
                //     <span className="placeholder">Discount</span>
                //   </div>

                //   <div className="input-container">
                //     <input
                //       type="number"
                //       name="total_item"
                //       value={item.total_item}
                //       className="item-input"
                //       placeholder=" "
                //       disabled
                //     />
                //     <span className="placeholder">Item Total</span>
                //   </div>

                //   <input type="text" value={item?.itemID?.itemName} />
                //   <input type="text" value={item?.quantity} />
                //   <input type="text" value={item?.discount} />
                //   <input type="text" value={item?.total_item} />
                // </div>
            //   ))} */}
            </div>
          ) : (
            <div>
              <p>No Item found</p>
            </div>
          )}

          {/* {Array.isArray(formData.item) && formData.item.length > 0 ? (
            formData.item.map((item, index) => (
              <div key={index} className="item-row">
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
                          (a?.itemID?.itemName || "").localeCompare(b?.itemID?.itemName || "")
                        )
                        .map((item) => (
                          <option key={item?.itemID?._id} value={item?.itemID?._id}>
                            {item?.itemID?._id || "Unknown"}
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

                <div className="input-container">
                  <input
                    type="number"
                    name="total_item"
                    value={item.total_item}
                    className="item-input"
                    placeholder=" "
                    disabled
                  />
                  <span className="placeholder">Item Total</span>
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
                  disabled={isLoading}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p>No items added. Click "Add Item" to start.</p>
          )}

          <button
            type="button"
            onClick={handleAddItem}
            style={{
              padding: "5px 10px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              cursor: "pointer",
              marginTop: "10px",
            }}
            disabled={isLoading}
          >
            Add Item
          </button> */}

          <div className="input-container">
            <input
              type="number"
              name="total"
              value={formData.total}
              className="item-input"
              placeholder=""
              readOnly
            />
            <span className="placeholder">Invoice Total</span>
          </div>

          {/* <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#2196f3",
              color: "white",
              border: "none",
              cursor: "pointer",
              marginTop: "10px",
            }}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Invoice"}
          </button> */}

          <div className="print-delete-area">
            <button className="delete-invoice">Delete</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InvoiceUpdateDelete;
