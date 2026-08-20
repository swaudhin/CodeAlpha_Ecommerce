import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data)).catch(() => setError("Order not found"));
  }, [id]);

  if (error) return <div className="container"><p className="error">{error}</p></div>;
  if (!order) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <h2>Order #{order._id.slice(-8)}</h2>
      <p>Status: <span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span></p>
      <h3>Shipping Address</h3>
      <p>{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}, {order.shippingAddress?.country}</p>
      <h3>Items</h3>
      <table className="cart-table">
        <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr></thead>
        <tbody>
          {order.items.map((item, idx) => (
            <tr key={idx}>
              <td className="cart-product-cell"><img src={item.image} alt={item.name} />{item.name}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.quantity}</td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Total: ${order.totalPrice.toFixed(2)}</h3>
    </div>
  );
}
