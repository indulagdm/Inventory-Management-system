import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { itemGets, invoiceGetByID } from "../apis/api.js";
import { bufferToString } from "../helper/bufferToString.js";
// import { invoiceUpdate, invoiceDelete } from "../apis/api.js"; // Add these when ready

const InvoiceUpdateDelete = () => {
  const { invoiceID } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    invoiceNo: "",
    customerName: "",
    customerAddress: "",
    customerPhone: "",
    items: [
      {
        itemID: "",
        itemName: "",
        itemCode: "",
        sellingPrice: "",
        quantity: "",
        discount: "",
        total_item: "",
      },
    ],
    total: 0,
  });

  const [availableItems, setAvailableItems] = useState([]); // All items from DB
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all available items (for dropdown)
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await itemGets();
        setAvailableItems(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        toast.error("Failed to load items");
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceID) return;
      try {
        const res = await invoiceGetByID(invoiceID);
        const data = res?.data || {};

        const loadedItems = (data.items || []).map((item) => ({
          itemID: item.itemID?._id || item.itemID || "",
          itemName: item.itemName || "",
          sellingPrice: item.sellingPrice || 0,
          quantity: item.quantity || 1,
          discount: item.discount || 0,
          total_item: item.total_item || 0,
        }));

        console.log(res);


        setFormData({
          invoiceNo: data.invoiceNo || "",
          customerName: data.customerName || "",
          customerAddress: data.customerAddress || "",
          customerPhone: data.customerPhone || "",
          items: loadedItems,
          total: data.total || 0,
        });
      } catch (err) {
        toast.error("Failed to load invoice");
      }
    };

    if (availableItems.length > 0) {
      fetchInvoice();
    }
  }, [invoiceID, availableItems]);

  useEffect(() => {
    const updatedItems = formData.items.map((item) => {
      const matching = availableItems.find((i) => i._id === item.itemID);
      const sellingPrice = matching?.sellingPrice || item.sellingPrice || 0;
      const itemName = matching?.itemName || item.itemName || "";
      const total_item =
        (item.quantity || 0) * sellingPrice - (item.discount || 0);

      return { ...item, itemName, sellingPrice, total_item };
    });

    const newTotal = updatedItems.reduce((sum, i) => sum + i.total_item, 0);

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      total: newTotal,
    }));
  }, [formData.items.map((i) => i.itemID).join(), availableItems]);

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];

    if (field === "itemID") {
      const selected = availableItems.find((i) => i._id === value);
      updatedItems[index] = {
        ...updatedItems[index],
        itemID: value,
        itemName: selected?.itemName || "",
        unitPrice: selected?.sellingPrice || selected?.unitPrice || 0,
      };
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]:
          field === "quantity" || field === "discount"
            ? Number(value) || 0
            : value,
      };
    }

    const qty = updatedItems[index].quantity || 0;
    const price = updatedItems[index].unitPrice || 0;
    const disc = updatedItems[index].discount || 0;
    updatedItems[index].total_item = qty * price - disc;

    const newTotal = updatedItems.reduce(
      (sum, i) => sum + (i.total_item || 0),
      0
    );

    setFormData((prev) => ({ ...prev, items: updatedItems, total: newTotal }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemID: "",
          itemName: "",
          itemCode: "",
          sellingPrice: "",
          quantity: 1,
          discount: "",
          total_item: "",
        },
      ],
    }));
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const newTotal = updatedItems.reduce((sum, i) => sum + i.total_item, 0);
    setFormData((prev) => ({ ...prev, items: updatedItems, total: newTotal }));
  };

  const formatNumber = (num) =>
    Number(num || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.customerName ||
      !formData.customerAddress ||
      !formData.customerPhone
    ) {
      toast.error("Please fill in customer details");
      return;
    }

    if (formData.items.some((i) => !i.itemID || i.quantity < 1)) {
      toast.error("Each item must have a selected product and valid quantity");
      return;
    }

    const payload = {
      invoiceNo: formData.invoiceNo,
      customerName: formData.customerName,
      customerAddress: formData.customerAddress,
      customerPhone: formData.customerPhone,
      items: formData.items.map(({ itemID, quantity, discount }) => ({
        itemID,
        quantity,
        discount,
      })),
      total: formData.total,
    };

    setIsLoading(true);
    try {
      // const res = await invoiceUpdate(invoiceID, payload);
      // if (res.success) {
      toast.success("Invoice updated successfully");
      navigate("/invoices");
      // }
    } catch (err) {
      toast.error("Failed to update invoice");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this invoice permanently?")) return;

    setIsLoading(true);
    try {
      // await invoiceDelete(invoiceID);
      toast.success("Invoice deleted");
      navigate("/invoices");
    } catch (err) {
      toast.error("Failed to delete invoice");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <header>
        <h2 className="header-h2">Update Invoice</h2>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="item-container">
          {/* Customer Fields */}
          {[
            "invoiceNo",
            "customerName",
            "customerAddress",
            "customerPhone",
          ].map((field) => (
            <div className="input-container" key={field}>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleBasicChange}
                className="item-input"
                placeholder=" "
                disabled={isLoading}
              />
              <span className="placeholder">
                {field === "invoiceNo"
                  ? "Invoice Number"
                  : field === "customerName"
                  ? "Customer Name"
                  : field === "customerAddress"
                  ? "Customer Address"
                  : "Customer Mobile Number"}
              </span>
            </div>
          ))}

          {/* Editable Items Table */}
          <table className="table-invoice-item">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Qty</th>
                <th>Discount</th>
                <th>Selling Price</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((row, index) => (
                <tr key={index}>
                  <td>
                    <select
                      value={row.itemID}
                      onChange={(e) =>
                        handleItemChange(index, "itemID", e.target.value)
                      }
                      disabled={isLoading}
                    >
                      <option value="">Select Item</option>
                      {availableItems
                        .sort((a, b) => a.itemName.localeCompare(b.itemName))
                        .map((item) => (
                          <option key={item?._id} value={item?._id}>
                            {item.itemName}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={row.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={row.discount}
                      onChange={(e) =>
                        handleItemChange(index, "discount", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </td>
                  <td>{formatNumber(row.sellingPrice)}</td>
                  <td>{formatNumber(row.total_item)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => handleRemoveItem(index)}
                      disabled={isLoading}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {formData.items.length === 0 && <p>No items added yet.</p>}

          <button
            type="button"
            className="btn-add-item"
            onClick={handleAddItem}
            disabled={isLoading}
          >
            + Add Item
          </button>

          <div className="input-container">
            <input
              type="text"
              value={formatNumber(formData.total)}
              readOnly
              className="item-input"
            />
            <span className="placeholder">Invoice Total</span>
          </div>

          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? "Updating..." : "Update Invoice"}
          </button>

          <div className="print-delete-area">
            <button
              type="button"
              className="item-delete-button-ia"
              onClick={handleDelete}
              disabled={isLoading}
            >
              Delete Invoice
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InvoiceUpdateDelete;
