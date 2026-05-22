import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  Link
} from "react-router-dom";


import Dashboard from "./pages/Dashboard";
import Products from "./pages/product";
import Customers from "./pages/Customers";
import Sales from "./pages/sales";
import Login from "./pages/Login";


import {
  FaTachometerAlt,
  FaBox,
  FaUsers,
  FaChartLine,
  FaSignOutAlt,
} from "react-icons/fa";


// ================= SIDEBAR =================
function Sidebar() {

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.clear();   // IMPORTANT
  navigate("/login");
  };

  const menuClass = (path) =>
    `flex items-center gap-3 p-4 rounded-xl transition ${
      location.pathname === path
        ? "bg-white text-indigo-700 font-bold"
        : "hover:bg-indigo-500"
    }`;

  return (
    <div className="w-72 bg-indigo-700 text-white p-6 shadow-2xl">

      <h1 className="text-3xl font-bold mb-10">
        SmartERP
      </h1>

      <nav className="flex flex-col gap-5">

        <Link to="/" className={menuClass("/")}>
          <FaTachometerAlt />
          HOME
        </Link>

        <Link to="/products" className={menuClass("/products")}>
          <FaBox />
          PRODUCTS
        </Link>

        <Link to="/customers" className={menuClass("/customers")}>
          <FaUsers />
          CUSTOMERS
        </Link>

        <Link to="/sales" className={menuClass("/sales")}>
          <FaChartLine />
          SALES
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-4 rounded-xl hover:bg-red-500 transition mt-10"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </nav>
    </div>
  );
}


// ================= LAYOUT =================
function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-5">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="sales" element={<Sales />} />
        </Routes>
      </div>
    </div>
  );
}


// ================= APP =================
function App() {
  const user = localStorage.getItem("user") !== null;

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED LAYOUT */}
        <Route
          path="/*"
          element={user ? <Layout /> : <Navigate to="/login" />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;