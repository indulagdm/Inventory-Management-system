import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { getCategories } from "../apis/api.js";
import { toast } from "react-toastify";
import Loading from "../components/Loading.jsx";

const Category = () => {
  const [items, setItems] = useState([]);
  const [isLoading,setIsLoading] = useState(true);

  // const formatNumber = (value) => {
  //   return Number(value || 0).toLocaleString("en-US", {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   });
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await getCategories();
        if (response) {
          console.log(response);
          setItems(response.data);
        }
      } catch (error) {
        toast.error(error.message);
      }finally{
        setIsLoading(false)
      }
    };

    fetchData();
  }, []);

  const openAddCategory = () => {
    window.electronAPI.send("open-add-category");
  };

  // const items = [
  //   {
  //     _id:"1",
  //     categoryName:"Solar panel",
  //   },
  //   {
  //     _id:"2",
  //     categoryName:"Solar Light"
  //   }

  // ]

  if(isLoading) return <Loading/>
  return (
    <div>
      <header>
        <h1 className="header-h1">Category</h1>
      </header>

      <section className="add-button-section">
        <button onClick={() => openAddCategory()} className="add-button">
          Add Category
        </button>
      </section>

      <div className="container-category">
        {Array.isArray(items) && items.length > 0 ? (
          <table className="table-category">
            <thead>
              <tr>
                <th>Category Name</th>
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
                    
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <p style={{marginLeft:"5rem"}}>No Categories</p>
        )}
      </div>
    </div>
  );
};

export default Category;
