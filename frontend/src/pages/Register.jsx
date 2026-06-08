import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);

      alert("Registration Successful");

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />

          <input
            className="auth-input"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button
            className="auth-btn"
            type="submit"
          >
            Register
          </button>
        </form>

        <div className="auth-link">
          <Link to="/">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;