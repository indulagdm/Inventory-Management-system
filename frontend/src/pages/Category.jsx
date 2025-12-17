import React, { useState, useEffect } from "react";
import { categoryGets, categoryDelete } from "../apis/api.js";
import { toast } from "react-toastify";
import Loading from "../components/Loading.jsx";
import "./Dashboard.css";
import { MdDelete } from "react-icons/md";
import { usePopup } from "../hooks/usePopup.js";

const Category = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //const { openPopup } = usePopup();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await categoryGets();
        if (response.success) {
          setItems(response.data);
        } else {
          toast.error(response.error.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenPopup = () => {
    window.electronAPI?.openPopup("/category-add", { width: 600, height: 400 });
  };

  const handleDelete = async (categoryID) => {
    const deleteCategory = window.confirm(
      "Are you sure to delete this category?"
    );

    if (!deleteCategory) return;

    try {
      const response = await categoryDelete(categoryID);

      if (response?.success) {
        toast.success(response.message);
        window.location.reload();
      } else {
        toast.error(response.error.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // const openAddCategory = () => {
  //   // window.electronAPI.send("open-add-category");
  //   openPopup("/category-add", { width: 500, height: 700, model: false });
  // };

  // const handleAddItem = () => {
  //   window.electronAPI.openChildWindow(
  //     "/category-add",
  //     450,
  //     500,
  //     "add-category"
  //   );
  // };

  if (isLoading) return <Loading />;
  return (
    <div className="overview-container">
      <header>
        <h1 className="header-h1-other">Category</h1>
      </header>

      <section className="add-button-section">
        <button className="add-button" onClick={handleOpenPopup}>
          + Add Category
        </button>
      </section>

      <div className="container-items-inventory">
        {Array.isArray(items) && items.length > 0 ? (
          <table className="table-items-inventory">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item?._doc?._id || item?._id}
                  className=""
                  // onClick={() => openUpdateDeleteItem(item?._id)}
                >
                  <td className="">
                    {item?._doc?.categoryName || item?.categoryName}
                  </td>
                  <td onClick={()=>handleDelete(item?._id)}>
                    <MdDelete />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Categories</p>
        )}
      </div>

      {/* <header>
        <h1 className="header-h1">Items</h1>
      </header>

      <section className="add-button-section">
        <button onClick={() => openAddCategory()} className="add-button">
          Add Item
        </button>
      </section>

      <div className="container-item">
        {Array.isArray(items) && items.length > 0 ? (
          <table className="table-item">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Created Date</th>
                <th>Option</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item._id}
                >
                  <td>{item.categoryName}</td>
                  <td>{item.createdAt}</td>
                  <td>
                    {}
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ marginLeft: "5rem" }}>No Categories</p>
        )}
      </div> */}
    </div>
  );
};

export default Category;
