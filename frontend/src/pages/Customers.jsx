import { useEffect, useState } from "react";
import axios from "axios";

function Customers() {

  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [search, setSearch] = useState("");

  const [editId, setEditId] = useState(null);

  // =========================
  // FETCH CUSTOMERS
  // =========================

  const fetchCustomers = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/customers"
      );

      setCustomers(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);




  // =========================
  // ADD CUSTOMER
  // =========================

  const addCustomer = async () => {

    if (!name || !email || !phone) {
      alert("Please fill all fields");
      return;
    }

    try {

      await axios.post(
        "http://127.0.0.1:8000/customers",
        {
          name,
          email,
          phone
        }
      );

      fetchCustomers();

      setName("");
      setEmail("");
      setPhone("");

    } catch (error) {

      console.log(error);

      alert("Failed to add customer");

    }
  };

  // =========================
  // DELETE CUSTOMER
  // =========================

  const deleteCustomer = async (id) => {

    try {

      await axios.delete(
        `http://127.0.0.1:8000/customers/${id}`
      );

      fetchCustomers();

    } catch (error) {

      console.log(error);

    }
  };

  // =========================
  // EDIT CUSTOMER
  // =========================

  const editCustomer = (item) => {

    setEditId(item.id);

    setName(item.name);
    setEmail(item.email);
    setPhone(item.phone);
  };

  // =========================
  // UPDATE CUSTOMER
  // =========================

  const updateCustomer = async () => {

    try {

      await axios.put(
        `http://127.0.0.1:8000/customers/${editId}`,
        {
          name,
          email,
          phone
        }
      );

      setEditId(null);

      setName("");
      setEmail("");
      setPhone("");

      fetchCustomers();

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold text-gray-800">
          Customers Management
        </h1>
        <p className="text-gray-500 mt-2">
  Total Customers: {customers.length}
</p>


      </div>

      {/* ADD / UPDATE FORM */}

      <div className="bg-white p-8 rounded-2xl shadow-lg mb-10 mt-6">

        <h2 className="text-2xl font-bold mb-5">

          {
            editId ? "Update Customer" : "Add Customer"
          }

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded-xl"
          />

          <input
            type="email"
            placeholder="Customer Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded-xl"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-3 rounded-xl"
          />

          {
            editId ? (

              <button
                onClick={updateCustomer}
                className="bg-yellow-500 text-white rounded-xl hover:bg-yellow-600"
              >
                Update
              </button>

            ) : (

              <button
                onClick={addCustomer}
                className="bg-indigo-600 text-white px-6 py-3 text-lg rounded-xl hover:bg-indigo-700"
              >
                Add Customer
              </button>

            )
          }

        </div>

      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search Customer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-4 rounded-2xl mb-8 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      {/* CUSTOMER TABLE */}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-indigo-600 text-white">

            <tr>

              <th className="p-4 text-left">ID</th>

              <th className="p-4 text-left">Name</th>

              <th className="p-4 text-left">Email</th>

              <th className="p-4 text-left">Phone</th>

              <th className="p-4 text-left">Actions</th>

            </tr>

          </thead>

          
<tbody>

  {
    customers.length === 0 ? (

      <tr>

        <td
          colSpan="5"
          className="text-center p-6 text-gray-500 text-lg"
        >
          No Customers Found
        </td>

      </tr>

    ) : (

      customers
        .filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
        .map((item) => (

          <tr
            key={item.id}
            className="border-b hover:bg-indigo-50 transition duration-200"
          >

            <td className="p-4 font-medium text-gray-700">
              {item.id}
            </td>

            <td className="p-4 font-semibold text-gray-800">
              {item.name}
            </td>

            <td className="p-4 text-gray-600">
              {item.email}
            </td>

            <td className="p-4 text-gray-600">
              {item.phone}
            </td>

            <td className="p-4 flex gap-3">

              <button
                onClick={() => editCustomer(item)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                Edit
              </button>

              <button
                onClick={() => deleteCustomer(item.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>

            </td>

          </tr>

        ))

    )
  }


            
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Customers;