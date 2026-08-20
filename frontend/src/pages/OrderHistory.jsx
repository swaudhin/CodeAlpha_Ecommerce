import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my").then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (orders.length === 0) return <div className="container"><p>You have no orders yet.</p></div>;

  return (
    <div className="container">
      <h2>My Orders</h2>
      <table className="cart-table">
        <thead>
          <tr><th>Order ID</th><th>Date</th><th>Total</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o._id.slice(-8)}</td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td>${o.totalPrice.toFixed(2)}</td>
              <td><span className={`status status-${o.status.toLowerCase()}`}>{o.status}</span></td>
              <td><Link to={`/orders/${o._id}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
