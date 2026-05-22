import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {

  // ================= STATES =================
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  // ================= FETCH DATA =================
  useEffect(() => {

  axios.get("http://localhost:8000/sales")
    .then((res) => {
      console.log(res.data);
      setSales(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  

    axios.get("http://127.0.0.1:8000/customers")
      .then((res) => setCustomers(res.data || []))
      .catch(() => setCustomers([]));

    axios.get("http://127.0.0.1:8000/products")
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]));

  }, []);

  // ================= BASIC KPI =================
  const totalRevenue = sales.reduce(
    (acc, item) => acc + (Number(item?.total) || 0),
    0
  );

  const totalStock = products.reduce(
    (acc, item) => acc + (Number(item?.stock_quantity) || 0),
    0
  );

  // ================= DATE FORMAT =================
  // ================= DATE FORMAT =================
const getDateOnly = (date) => {

  if (!date) return "";

  if (date.includes("/")) {

    const [day, month, year] = date.split("/");

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return new Date(date)
    .toISOString()
    .split("T")[0];
};

  // ================= TODAY SALES =================
  const today = new Date().toISOString().split("T")[0];

  const todaysSales = sales.filter(
    (item) => getDateOnly(item?.date) === today
  );
  {sales.length === 0 && (
  <tr>
    <td colSpan="5" className="text-center p-4 text-gray-500">
      No orders found
    </td>
  </tr>
)}

  const todaysRevenue = todaysSales.reduce(
    (acc, item) => acc + (Number(item?.total) || 0),
    0
  );

  // ================= LOW STOCK =================
  const lowStockItems = products.filter(
    (item) =>
      (item?.stock_quantity || 0) <= (item?.reorder_level || 5)
  );

  // ================= INVENTORY VALUE =================
  const totalInventoryValue = products.reduce(
    (acc, item) =>
      acc + (Number(item?.stock_quantity || 0) * Number(item?.price || 0)),
    0
  );

  // ================= 📊 LAST 7 DAYS CHART DATA =================
  const getLast5DaysRevenue = () => {
    const last5Days = [];

    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const dateStr = d.toISOString().split("T")[0];

      const total = sales
        .filter((s) => getDateOnly(s?.date) === dateStr)
        .reduce((acc, s) => acc + (Number(s?.total) || 0), 0);

      last5Days.push({
        date: dateStr,
        revenue: total,
      });
    }

    return last5Days;
  };

  const chartData = getLast5DaysRevenue();

  // ================= UI =================
  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-gray-800">
        Smart ERP
      </h1>

      <p className="text-gray-500 mt-2">
        Welcome back Admin 👋
      </p>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-500">Total Sales</h2>
          <p className="text-3xl font-bold text-indigo-600">{sales.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-500">Customers</h2>
          <p className="text-3xl font-bold text-green-600">{customers.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-500">Products</h2>
          <p className="text-3xl font-bold text-orange-500">{products.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-500">Stock Quantity</h2>
          <p className="text-3xl font-bold text-blue-500">{totalStock}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-500">Revenue</h2>
          <p className="text-3xl font-bold text-pink-600">
            ₹{totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-500">Today's Sales</h2>
          <p className="text-3xl font-bold text-indigo-700">
            {todaysSales.length}
          </p>
          <p className="text-sm text-gray-400">
            ₹{todaysRevenue.toFixed(2)}
          </p>
        </div>
<div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-500">Inventory Value</h2>
          <p className="text-3xl font-bold text-blue-600">
            ₹{totalInventoryValue.toFixed(2)}
          </p>
        </div>
      </div>



        <div className="bg-white p-6 rounded-2x1 shadow-lg mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 ">Low Stock Items</h2>
          <p className="text-3xl font-bold text-red-600">
            {lowStockItems.length}
          </p>

<ul className="mt-3 text-sm text-gray-700 space-y-1">
  {lowStockItems.map((item) => (
    <li key={item.id} className="flex justify-between">
      <span>{item.name || item.product_name || "Unknown Product"}</span>
      <span className="text-red-600 font-bold">
        {item.stock_quantity}
      </span>
    </li>
  ))}
</ul>
    </div>    

      {/* ================= 📊 SALES CHART ================= */}
      <div className="bg-white p-6 rounded-2x1 shadow-lg mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Revenue (Last 5 Days)
        </h2>

        <ResponsiveContainer width="60%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Recent Orders
        </h2>

        <table className="w-full">

          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody>

            {sales.slice(0, 5).map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-100">

                <td className="p-4 font-bold text-indigo-600">
                  #ORD{item.id}
                </td>

                <td className="p-4">{item.customer_name}</td>
                <td className="p-4">{item.product_name}</td>

                <td className="p-4 text-green-600 font-bold">
                  ₹{item?.total || 0}
                </td>

                <td className="p-4 text-gray-500">
                  {item.date}
                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </div>

    </div>
  );
}

export default Dashboard;