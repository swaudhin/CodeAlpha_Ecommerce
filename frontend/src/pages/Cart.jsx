import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <p>Your cart is empty.</p>
        <Link to="/">Continue shopping</Link>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user) return navigate("/login");
    navigate("/checkout");
  };

  return (
    <div className="container">
      <h2>Your Cart</h2>
      <table className="cart-table">
        <thead>
          <tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.product}>
              <td className="cart-product-cell">
                <img src={item.image} alt={item.name} />
                {item.name}
              </td>
              <td>${item.price.toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  max={item.stock}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.product, Math.max(1, Number(e.target.value)))}
                />
              </td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
              <td><button className="btn-link" onClick={() => removeFromCart(item.product)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Total: ${totalPrice.toFixed(2)}</h3>
      <button onClick={handleCheckout}>Proceed to Checkout</button>
    </div>
  );
}
