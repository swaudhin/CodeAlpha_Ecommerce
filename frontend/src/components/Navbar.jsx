import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">ShopAlpha</Link>
      <div className="nav-links">
        <Link to="/">Products</Link>
        <Link to="/cart">Cart ({totalItems})</Link>
        {user ? (
          <>
            <Link to="/orders">My Orders</Link>
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
            <span className="nav-user">Hi, {user.name.split(" ")[0]}</span>
            <button onClick={handleLogout} className="btn-link">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
