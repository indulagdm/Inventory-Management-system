import React from "react";

const Category = () => {
  const openAddCategory = () => {
    window.electronAPI.send("open-add-category");
  };
  return (
    <div>
      <h1>category</h1>

      <button onClick={() => openAddCategory()}> Add Category</button>
    </div>
  );
};

export default Category;
