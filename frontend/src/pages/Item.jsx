import React from "react";

const Item = () => {
  const openAddItem = () => {
    window.electronAPI.send("open-add-item");
  };
  return (
    <div>
      <h1>item</h1>

      <button
        onClick={() => openAddItem()}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 w-full sm:w-auto"
      >
        Add Item
      </button>
    </div>
  );
};

export default Item;
