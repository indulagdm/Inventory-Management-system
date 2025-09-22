import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createItem, getCategories } from "../apis/api.js";

const ItemAdd = () => {
  const [formData, setFormData] = useState({
    itemCode: "",
    itemName: "",
    categoryID: "",
    description: "",
    cost: "",
    sellingPrice: "",
    discount: "",
  });

  const navigate = useNavigate();

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventdefault();
      const response = await createItem(formData);
      if (response) {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();

        if (response) {
          setFormData(response.data);
          console.log(response);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <form onSubmit={handleSubmit}>
        <label>Item code</label>
        <input
          type="text"
          name="itemCode"
          onChange={handleChange}
          value={formData.itemCode}
        />
        <label>Item Name</label>
        <input
          type="text"
          name="itemName"
          onChange={handleChange}
          value={formData.itemName}
        />

        <label>Description</label>
        <input
          type="text"
          name="description"
          onChange={handleChange}
          value={formData.description}
        />

        <label>Cost</label>
        <input
          type="text"
          name="cost"
          onChange={handleChange}
          value={formData.cost}
        />

        <label>Selling Price</label>
        <input
          type="text"
          name="sellingPrice"
          onChange={handleChange}
          value={formData.sellingPrice}
        />

        <label>Discount</label>
        <input
          type="text"
          name="discount"
          onChange={handleChange}
          value={formData.discount}
        />

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default ItemAdd;
