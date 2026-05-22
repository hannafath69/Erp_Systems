import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function Sales() {

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [sales, setSales] = useState([]);

  // ================= FETCH SALES =================
  const fetchSales = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/sales");
      setSales(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= FETCH DATA =================
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/products")
      .then(res => setProducts(res.data));

    axios.get("http://127.0.0.1:8000/customers")
      .then(res => setCustomers(res.data));

    fetchSales();
  }, []);

  // ================= CALCULATIONS =================
  const product = products.find(
  p => String(p.id) === String(selectedProduct)
);
  const price = product ? product.price : 0;

  const subtotal = price * quantity;
  const gst = Number((subtotal * 0.2).toFixed(2));
  const total = subtotal + gst;

  // ================= ADD SALE =================
  const addSale = async () => {

    if (!selectedProduct || !selectedCustomer) {
      alert("Select product & customer");
      return;
    }

    const newSale = {
      customer_name: customers.find(c => c.id == selectedCustomer)?.name,
      product_name: product?.name || "",
      quantity: Number(quantity),
      price,
      subtotal,
      gst,
      total,
      date: new Date().toLocaleDateString()
    };

    try {
      await axios.post("http://127.0.0.1:8000/sales", newSale);

      alert("Sale saved successfully");
      fetchSales();

      setQuantity(1);
      setSelectedCustomer("");
      setSelectedProduct("");

    } catch (error) {
      console.log(error.response?.data);
      alert("Sale not saved");
    }
  };

  // ================= 🧾 INVOICE FUNCTION =================
  const downloadInvoice = (sale) => {

    const doc = new jsPDF();

    // HEADER
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, 210, 40, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text("SMART ERP INVOICE", 20, 25);

    // COMPANY INFO
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text("SmartERP Solutions", 20, 55);
    doc.text("Kochi, Kerala, India", 20, 62);

    // INVOICE DETAILS
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("BILL DETAILS", 20, 80);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    doc.text(`Customer : ${sale.customer_name}`, 20, 100);
    doc.text(`Product  : ${sale.product_name}`, 20, 110);
    doc.text(`Quantity : ${sale.quantity}`, 20, 120);
    doc.text(`Subtotal : ₹${sale.subtotal}`, 20, 130);
    doc.text(`GST (2%) : ₹${Number(sale.gst).toFixed(2)}`, 20, 140);
    doc.text(`Total    : ₹${Number(sale.total).toFixed(2)}`, 20, 150);
    doc.text(`Date     : ${sale.date}`, 20, 160);

    // FOOTER
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.text("Thank you for your Purchase!", 50, 200);

    doc.save(`Invoice_${sale.customer_name}_${sale.id}.pdf`);
  };

  return (

    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-4xl font-bold mb-8">
        Sales Management
      </h1>

      {/* SALES FORM */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">

        <h2 className="text-2xl font-bold mb-5">
          New Sale
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <select
            className="border p-3 rounded-xl"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="">Select Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="border p-3 rounded-xl"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border p-3 rounded-xl"
          />

          <button
            onClick={addSale}
            className="bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
          >
            Add Sale
          </button>

        </div>

        {/* CALCULATIONS */}
        <div className="mt-6 grid grid-cols-3 gap-4">

          <div className="bg-gray-100 p-4 rounded-xl">
            Subtotal: ₹{subtotal}
          </div>

          <div className="bg-gray-100 p-4 rounded-xl">
            GST: ₹{gst.toFixed(2)}
          </div>

          <div className="bg-green-100 p-4 rounded-xl font-bold">
            Total: ₹{total.toFixed(2)}
          </div>

        </div>
      </div>
       {/* SALES TABLE */}
<div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

  <h2 className="text-2xl font-bold mb-6 text-gray-800">
    Sales Records
  </h2>

  <div className="overflow-x-auto">

    <table className="w-full">

      {/* HEADER */}
      <thead className="bg-indigo-600 text-white">
        <tr>
          <th className="p-4 text-left whitespace-nowrap">Customer</th>
          <th className="p-4 text-left whitespace-nowrap">Product</th>
          <th className="p-4 text-left whitespace-nowrap">Qty</th>
          <th className="p-4 text-left whitespace-nowrap">Subtotal</th>
          <th className="p-4 text-left whitespace-nowrap">GST</th>
          <th className="p-4 text-left whitespace-nowrap">Total</th>
          <th className="p-4 text-left whitespace-nowrap">Date</th>
          <th className="p-4 text-left whitespace-nowrap">Invoice</th>
        </tr>
      </thead>

      {/* BODY */}
      <tbody>

        {sales.map((s, index) => (
          <tr
            key={index}
            className="border-b hover:bg-gray-50 transition"
          >

            <td className="p-4 whitespace-nowrap">
              {s.customer_name}
            </td>

            <td className="p-4 whitespace-nowrap">
              {s.product_name}
            </td>

            <td className="p-4 whitespace-nowrap">
              {s.quantity}
            </td>

            <td className="p-4 whitespace-nowrap">
              ₹{Number(s.subtotal).toFixed(2)}
            </td>

            <td className="p-4 whitespace-nowrap">
              ₹{Number(s.gst).toFixed(2)}
            </td>

            <td className="p-4 whitespace-nowrap font-bold text-green-600">
              ₹{Number(s.total).toFixed(2)}
            </td>

            <td className="p-4 whitespace-nowrap text-gray-600">
              {s.date}
            </td>

            <td className="p-4 whitespace-nowrap">
              <button
                onClick={() => downloadInvoice(s)}
                className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
              >
                Invoice
              </button>
            </td>

          </tr>
        ))}

      </tbody>

    </table>

  </div>

</div>
      

    </div>
  );
}

export default Sales;