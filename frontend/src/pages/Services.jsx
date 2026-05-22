import { useEffect, useState } from "react";
import axios from "axios";

function Services() {

  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [amount, setAmount] = useState("");

  const fetchServices = async () => {
    const response = await axios.get(
      "http://127.0.0.1:8000/services"
    );

    setServices(response.data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const addService = async () => {

    await axios.post(
      "http://127.0.0.1:8000/services",
      {
        service_name: serviceName,
        amount: Number(amount)
      }
    );

    fetchServices();

    setServiceName("");
    setAmount("");
  };
return (

  <div className="p-6 bg-gray-100 min-h-screen">

    {/* HEADER */}

    <div className="flex justify-between items-center mb-8">

      <h1 className="text-4xl font-bold text-gray-800">
        Services
      </h1>

    </div>

    {/* ADD SERVICE FORM */}

    <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">

      <h2 className="text-2xl font-bold mb-5">
        Add Service
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <input
          type="text"
          placeholder="Service Name"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={addService}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-semibold"
        >
          Add Service
        </button>

      </div>

    </div>

    {/* SERVICES LIST */}

    {
      services.length === 0 ? (

        <div className="bg-white p-10 rounded-2xl shadow-lg text-center text-gray-500 text-xl">

          No Services Available

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {services.map((item) => (

            <div
              key={item.id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300"
            >

              <h2 className="text-2xl font-bold text-gray-800">
                {item.service_name}
              </h2>

              <p className="text-3xl mt-4 text-indigo-600 font-bold">
                ₹{item.amount}
              </p>

            </div>

          ))}

        </div>

      )
    }

  </div>
);
 
}

export default Services;