import Dashboard from "./pages/Dashboard";
import CategoryAdd from "./pages/CategoryAdd";
import ItemAdd from "./pages/ItemAdd";
import ItemUpdateDelete from "./pages/ItemUpdateDelete";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="page-wrapper">
          <div className="content">
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </div>
        </div>
        {/* Only show navbar in main window */}
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/item-add" element={<ItemAdd />} />
            <Route path="/category-add" element={<CategoryAdd />} />
            <Route
              path="/item-update-delete/:itemID"
              element={<ItemUpdateDelete />}
            />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
