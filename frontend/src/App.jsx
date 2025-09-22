import Dashboard from "./pages/Dashboard";
import CategoryAdd from "./pages/CategoryAdd";
import ItemAdd from "./pages/ItemAdd";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
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

      <Router>
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/add-item" element={<ItemAdd/>}/>
          <Route path="/add-category" element={<CategoryAdd/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
