import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createCategory } from "../apis/api.js";

const CategoryAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ categoryName: "" });

  //   const handleSubmit = async (e) => {
  //     e.preventdefault();
  //     try {
  //         console.log(formData)
  //       const response = await createCategory(formData);
  //       if (response?.success) {
  //         toast.success(response.message)
  //         // navigate("/");
  //       }else{
  //         toast.error(response?.message)
  //       }
  //     } catch (error) {
  //       toast.error(error.message);
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    try {
      const response = await createCategory(formData);
      console.log("API response:", response);

      if (response?.success) {
        toast.success(response.message || "Category created");
        navigate('/')
      } else {
        toast.error(response?.error.message || "Error creating category");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.message || "Request failed");
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
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <label>Add New Category</label>
          <input
            type="text"
            name="categoryName"
            onChange={handleChange}
            value={formData.categoryName}
          />

          <input type="submit" value={"submit"} />
        </form>
      </div>
    </div>
  );
};

export default CategoryAdd;
