 
// React E-commerce App (JSX)

import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { create } from "zustand";
import "./index.css";

const queryClient = new QueryClient();

const useCartStore = create((set) => ({
  cart: [],
  addToCart: (product) => set((state) => ({ cart: [...state.cart, product] })),
  removeFromCart: (id) =>
    set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
}));

const fetchProducts = async () => {
  const res = await fetch("https://fakestoreapi.com/products");
  return res.json();
};

const ProductList = () => {
  const { data: products, error, isLoading } = useQuery("products", fetchProducts);
  const addToCart = useCartStore((state) => state.addToCart);

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded shadow">
          <img src={product.image} alt={product.title} className="h-32 mx-auto" />
          <h3 className="text-lg font-semibold mt-2">{product.title}</h3>
          <p className="text-gray-500">${product.price}</p>
          <button onClick={() => addToCart(product)} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

const Cart = () => {
  const { cart, removeFromCart } = useCartStore();
  return (
    <div className="p-4 border-t">
      <h2 className="text-xl font-bold">Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="flex justify-between p-2 border-b">
            <span>{item.title} - ${item.price}</span>
            <button onClick={() => removeFromCart(item.id)} className="text-red-500">
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Product Listing</h1>
      <ProductList />
      <Cart />
    </div>
  </QueryClientProvider>
);

const root = createRoot(document.getElementById("root"));
root.render(<App />);
export default App;