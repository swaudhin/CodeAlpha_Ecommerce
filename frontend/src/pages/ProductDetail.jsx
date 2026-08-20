import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data)).catch(() => setError("Product not found"));
  }, [id]);

  if (error) return <div className="container"><p className="error">{error}</p></div>;
  if (!product) return <div className="container"><p>Loading...</p></div>;

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="container product-detail">
      <img src={product.image} alt={product.name} />
      <div className="detail-info">
        <h2>{product.name}</h2>
        <p className="category">{product.category}</p>
        <p className="price">${product.price.toFixed(2)}</p>
        <p>{product.description}</p>
        <p>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>

        {product.stock > 0 && (
          <div className="add-cart-row">
            <input
              type="number"
              min="1"
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
            />
            <button onClick={handleAdd}>{added ? "Added!" : "Add to Cart"}</button>
          </div>
        )}
        <button className="btn-secondary" onClick={() => navigate("/cart")}>Go to Cart</button>
      </div>
    </div>
  );
}
