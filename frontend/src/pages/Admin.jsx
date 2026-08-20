import React, { useEffect, useState } from "react";
import api from "../api/axios.js";

const emptyForm = { name: "", description: "", price: "", category: "", image: "", stock: "" };

export default function Admin() {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadProducts = () => api.get("/products?page=1").then((res) => setProducts(res.data.products));
  const loadOrders = () => api.get("/orders").then((res) => setOrders(res.data));

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      resetForm();
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, image: p.image, stock: p.stock });
    setEditingId(p._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  const handleStatusChange = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    loadOrders();
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <div className="tabs">
        <button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}>Products</button>
        <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>Orders</button>
      </div>

      {tab === "products" && (
        <>
          <form onSubmit={handleSubmit} className="form admin-form">
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
            <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
            <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
            <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
            {error && <p className="error">{error}</p>}
            <div className="admin-form-buttons">
              <button type="submit">{editingId ? "Update Product" : "Add Product"}</button>
              {editingId && <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>}
            </div>
          </form>

          <table className="cart-table">
            <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button className="btn-link" onClick={() => handleEdit(p)}>Edit</button>{" "}
                    <button className="btn-link" onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === "orders" && (
        <table className="cart-table">
          <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o._id.slice(-8)}</td>
                <td>{o.user?.name} ({o.user?.email})</td>
                <td>${o.totalPrice.toFixed(2)}</td>
                <td>
                  <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)}>
                    {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
