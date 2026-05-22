import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  
  const handleLogin = async () => {
  try {
    const res = await axios.post("http://127.0.0.1:8000/login", {
      email,
      password,
    });

    localStorage.setItem("user", JSON.stringify(res.data));

    // 👇 redirect to dashboard
    window.location.href = "/";
  } catch (err) {
    console.log(err);
  }
};
  


  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Smart ERP Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-xl mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-xl mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white p-3 rounded-xl"
        >
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;