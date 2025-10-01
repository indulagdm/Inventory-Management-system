import Dashboard from "./pages/Dashboard";
import CategoryAdd from "./pages/CategoryAdd";
import ItemAdd from "./pages/ItemAdd";
import ItemUpdateDelete from "./pages/ItemUpdateDelete";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Category from "./pages/Category";
import Item from "./pages/Item";
import UpdateStock from "./pages/UpdateStock";
import Invoice from "./pages/Invoice";
import InvoiceAdd from "./pages/InvoiceAdd";
import PrintInvoice from "./pages/PrintInvoice";
import InvoiceUpdateDelete from "./pages/InvoiceUpdateDelete";
import TitleBar from "./components/TitleBar";

function App() {
  return (
    <Router>
      <div className="App flex">
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
            <Route path="/invoice-add" element={<InvoiceAdd />} />
            <Route
              path="/item-update-delete/:itemID"
              element={<ItemUpdateDelete />}
            />
            <Route
              path="/invoice-update-delete/:invoiceID"
              element={<InvoiceUpdateDelete />}
            />
            <Route
              path="/item-update-stock/:itemID"
              element={<UpdateStock />}
            />

            <Route path="/items" element={<Item />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/invoices" element={<Invoice />} />

            <Route path="/print/:invoiceID" element={<PrintInvoice />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
