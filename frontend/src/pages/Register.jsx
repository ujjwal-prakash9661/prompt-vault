import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Basic client-side validation to match backend requirements
    const parts = name.trim().split(/\s+/);
    if (parts.length < 2) {
      setError("Please enter your first and last name.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      // Backend expects: fullName.{firstName,lastName}, email, password
      const [firstName, ...rest] = parts;
      const lastName = rest.join(' ').trim();
      const res = await fetch("https://prompt-vault-wnpk.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, fullName: { firstName, lastName } }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Surface validation errors from backend if present
        if (Array.isArray(data?.errors) && data.errors.length) {
          setError(data.errors[0]?.msg || "Registration failed");
        } else {
          setError(data?.message || "Registration failed");
        }
        return;
      }

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <motion.div
        className="register-card bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-md"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.36 }}
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 tracking-tight">
          Register
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <motion.button
            type="submit"
            whileHover={{ y: -3 }}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transform transition"
          >
            <span className="font-semibold">Register</span>
          </motion.button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          Registered?{" "}
          <span
            onClick={() => navigate("/login")}
            className="font-semibold text-blue-600 cursor-pointer"
          >
            Login here
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
