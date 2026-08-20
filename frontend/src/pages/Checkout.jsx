import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: "", city: "", state: "", zip: "", country: "" });
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const items = cartItems.map((i) => ({ product: i.product, quantity: i.quantity }));
      const { data } = await api.post("/orders", { items, shippingAddress: address, paymentMethod });
      clearCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit} className="form">
        {["street", "city", "state", "zip", "country"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field[0].toUpperCase() + field.slice(1)}
            value={address[field]}
            onChange={handleChange}
            required
          />
        ))}
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option>Cash on Delivery</option>
          <option>Credit Card</option>
          <option>PayPal</option>
        </select>
        <h3>Total: ${totalPrice.toFixed(2)}</h3>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? "Placing order..." : "Place Order"}</button>
      </form>
    </div>
  );
}
