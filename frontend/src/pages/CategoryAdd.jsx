import React, { useState } from "react";
import { toast } from "react-toastify";
import { categoryCreate } from "../apis/api.js";
import "./PopUpStyles.css";
import { useNavigate } from "react-router-dom";
import PopupWrapper from "../components/PopupWrapper.jsx";

const CategoryAdd = () => {
  const [formData, setFormData] = useState({ categoryName: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!formData.categoryName) {
      toast.error("Category name is required.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await categoryCreate({
        ...formData,
        categoryName: formData.categoryName || undefined,
      });

      if (response?.success) {
        toast.success("Category added successfully");
        navigate("/category");
        window.close();
      } else {
        toast.error(response?.error?.message || "Failed to add category");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
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
      <PopupWrapper>
        <header>
          <h2 className="header-h2">Add New Category</h2>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="item-container">
            <div className="input-container">
              {/* <label className="">
            Category Name
          </label> */}
              <input
                type="text"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                className="item-input"
                placeholder=" "
                step="0.01"
                disabled={isLoading}
              />
              <span className="placeholder">Category Name</span>
            </div>

            <section>
              <button
                type="button"
                onClick={handleSubmit}
                className="add-button-item"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
              <button type="button" onClick={window.close}>
                Cancel
              </button>
            </section>
          </div>
        </form>
      </PopupWrapper>
    </div>
  );
};

export default CategoryAdd;
