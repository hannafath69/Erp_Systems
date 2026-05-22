import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Products() {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState(""); 
  // Edit State
  const [editId, setEditId] = useState(null);

  

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/products"
      );

      setProducts(response.data);

    } catch (error) {

      console.log(error);

      toast.error("Failed to fetch products");

    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
   

  useEffect(() => {
  fetchProducts();
}, []);

useEffect(() => {

  const syncOfflineProducts = async () => {

    const offlineProducts =
      JSON.parse(localStorage.getItem("offlineProducts")) || [];

    if (offlineProducts.length > 0) {

      try {

        for (const product of offlineProducts) {

          await axios.post(
            "http://127.0.0.1:8000/products",
            product
          );
        }

        localStorage.removeItem("offlineProducts");

        toast.success("Offline products synced!");

        fetchProducts();

      } catch (error) {

        console.log(error);
      }
    }
  };

  window.addEventListener("online", syncOfflineProducts);

  return () => {
    window.removeEventListener("online", syncOfflineProducts);
  };

}, []);

  // =========================
  // ADD PRODUCT
  // =========================
     const addProduct = async () => {

  const productData = {
    name,
    price: Number(price),
    stock_quantity: Number(stockQuantity),
  };

  try {

    // =========================
    // ONLINE
    // =========================

    if (navigator.onLine) {

      await axios.post(
        "http://127.0.0.1:8000/products",
        productData
      );

      toast.success("Product Added");

    } else {

      // =========================
      // OFFLINE SAVE
      // =========================

      let offlineProducts =
        JSON.parse(localStorage.getItem("offlineProducts")) || [];

      offlineProducts.push(productData);

      localStorage.setItem(
        "offlineProducts",
        JSON.stringify(offlineProducts)
      );

      toast.success("No internet. Product saved locally.");
    }

    fetchProducts();

    setName("");
    setPrice("");
    setStockQuantity("");

  } catch (error) {

    console.log(error);

    toast.error("Failed to add product");
  }
};
  

  // =========================
  // DELETE PRODUCT
  // =========================

  const deleteProduct = async (id) => {

    try {

      await axios.delete(
        `http://127.0.0.1:8000/products/${id}`
      );

      toast.success("Product Deleted");

      fetchProducts();

    } catch (error) {

      console.log(error);

      toast.error("Delete Failed");

    }
  };

  // =========================
  // EDIT PRODUCT
  // =========================

  const editProduct = (item) => {

    setEditId(item.id);

    setName(item.name);
    setPrice(item.price);
    setStockQuantity(item.stock_quantity);
  };

  // =========================
  // UPDATE PRODUCT
  // =========================

  const updateProduct = async () => {

    try {

      await axios.put(
        `http://127.0.0.1:8000/products/${editId}`,
        {
          
             name,
             price: Number(price),
             stock_quantity: Number(stockQuantity),
          
        }
      );

      toast.success("Product Updated");

      setEditId(null);

      setName("");
      setPrice("");
      setStockQuantity("");
      fetchProducts();

    } catch (error) {

      console.log(error);

      toast.error("Update Failed");

    }
  };

  return (

    <div className="p-6 bg-gray-100 min-h-screen">

      <ToastContainer />

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold text-gray-800">
          Products
        </h1>

      </div>

      {/* Add Product Form */}

      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">

        <h2 className="text-2xl font-bold mb-5">

          {
            editId ? "Update Product" : "Add Product"
          }

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded-xl"
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-3 rounded-xl"
          />
          <input
  type="number"
  placeholder="Stock Quantity"
  value={stockQuantity}
  onChange={(e) => setStockQuantity(e.target.value)}
  className="border p-3 rounded-xl"
/>

          {
            editId ? (

              <button
                onClick={updateProduct}
                className="bg-yellow-500 text-white rounded-xl hover:bg-yellow-600"
              >
                Update Product
              </button>

            ) : (

              <button
  onClick={addProduct}
  className="bg-indigo-600 text-white px-6 py-3 text-lg rounded-xl hover:bg-indigo-700"
>
  Add Product
</button>

            )
          }

        </div>

      </div>

      {/* Search Box */}

      <input
        type="text"
        placeholder="Search Product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-3 rounded-xl mb-6 w-full"
      />

      {/* Product Cards */}

      {
        products.length === 0 ? (

          <div className="text-center text-2xl">
            Loading...
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {
              products
                .filter((item) =>
                  item.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((item) => (

                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-2xl shadow-lg"
                  >

                    <h2 className="text-2xl font-bold text-gray-800">
                      {item.name}
                    </h2>

                    <p className="text-indigo-600 text-xl mt-3 font-semibold">
                      ₹{item.price}
                    </p>
                    <p className="text-gray-600 mt-2">
                       Stock: {item.stock_quantity}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5">

                      {/* Edit Button */}

                      <button
                        onClick={() => editProduct(item)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                      >
                        Edit
                      </button>

                      {/* Delete Button */}

                      <button
                        onClick={() => deleteProduct(item.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))
            }

          </div>

        )
      }

    </div>
  );
}

export default Products;