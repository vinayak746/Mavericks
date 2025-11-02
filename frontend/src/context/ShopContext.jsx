import { createContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  loadPendingOrders,
  savePendingOrders,
  addPendingOrder,
  removePendingOrderAt,
} from "./orderUtils";
import { computeCartCount, computeCartAmount, mergeCarts } from "./cartUtils";
import {
  addToCartLocal,
  addToCartRemote,
  updateQuantityLocal,
  updateQuantityRemote,
  syncCartToServer as syncCartService,
} from "./cartService";

export const ShopContext = createContext();
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [pendingOrders, setPendingOrders] = useState([]);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const navigate = useNavigate();
  const cartUpdatedInitialized = useRef(false);

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select the product size");
      return;
    }
    // local update immediately
    const prevCount = computeCartCount(cartItems);
    const cartData = addToCartLocal(cartItems, itemId, size);
    setCartItems(cartData);
    const newCount = computeCartCount(cartData);
    if (prevCount === 0 && newCount > 0) {
      console.log(
        "addToCart: prevCount=",
        prevCount,
        "newCount=",
        newCount,
        "-> firing toast"
      );
      toast.success("Product has been added to the cart");
    } else {
      console.log("addToCart: prevCount=", prevCount, "newCount=", newCount);
    }
    // try to update server if we have token
    if (token) {
      try {
        await addToCartRemote(backendUrl, token, itemId, size);
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    return computeCartCount(cartItems);
  };

  const updateQuantity = async (itemId, size, quantity) => {
    const cartData = updateQuantityLocal(cartItems, itemId, size, quantity);
    setCartItems(cartData);
    if (token) {
      try {
        await updateQuantityRemote(backendUrl, token, itemId, size, quantity);
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    return computeCartAmount(cartItems, products);
  };

  const getProductsData = async () => {
    try {
      const response = await axios(`${backendUrl}/api/products/list`);
      if (response.data.success) {
        setProducts(response.data.products);
        try {
          // Cache the products list in localStorage so we can show them when offline
          localStorage.setItem(
            "products_cache",
            JSON.stringify(response.data.products)
          );
        } catch (err) {
          console.log("Failed to cache products in localStorage:", err);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      // Try to load products from localStorage when network is unavailable
      try {
        const cached = localStorage.getItem("products_cache");
        if (cached) {
          setProducts(JSON.parse(cached));
          toast.info("Loaded products from cache (offline)");
          return;
        }
      } catch (err) {
        console.log("Failed to read products_cache:", err);
      }
      toast.error(error.message);
    }
  };

  const getUserCart = async (token) => {
    console.log("Fetching user cart with token:", token);
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("User cart response:", response.data);
      if (response.data.success) {
        // Merge server cart with local cart stored in localStorage.
        // Prefer local changes (assume local is more recent when user was offline).
        let serverCart = response.data.cartData || {};
        let localCart = {};
        try {
          const raw = localStorage.getItem("cart_local");
          if (raw) localCart = JSON.parse(raw);
        } catch (err) {
          console.log("Failed to read cart_local:", err);
        }

        const merged = mergeCarts(serverCart, localCart);

        setCartItems(merged);
        console.log("Cart items set (merged):", merged);

        // Attempt to sync merged cart back to server
        if (token && navigator.onLine) {
          try {
            await syncCartToServer(merged, token);
          } catch (err) {
            console.log("Failed to sync merged cart to server:", err);
          }
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart_local", JSON.stringify(cartItems));
    } catch (err) {
      console.log("Failed to write cart_local:", err);
    }
  }, [cartItems]);

  // Show a toast whenever the cart updates (skip initial load)
  useEffect(() => {
    if (!cartUpdatedInitialized.current) {
      cartUpdatedInitialized.current = true;
      return;
    }
    // Generic cart update toast
    try {
      toast.info("Cart updated");
    } catch (err) {
      console.log("Failed to show cart update toast:", err);
    }
  }, [cartItems]);

  // Sync function: iterate through cart and update server quantities
  const syncCartToServer = async (cart, token) => {
    return syncCartService(cart, backendUrl, token);
  };

  // On reconnect, try to sync local cart to server
  useEffect(() => {
    function handleOnline() {
      console.log("Network reconnected — attempting cart sync");
      if (token) {
        const raw = localStorage.getItem("cart_local");
        if (raw) {
          try {
            const localCart = JSON.parse(raw);
            syncCartToServer(localCart, token).catch((err) =>
              console.log("syncCartToServer error on reconnect:", err)
            );
          } catch (err) {
            console.log("Failed to parse cart_local on reconnect:", err);
          }
        }
      }
    }
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [token]);

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (token) {
      getUserCart(token);
    }
  }, [token]);

  // Place order (handles offline queuing for COD)
  const placeOrder = async (orderData, method) => {
    if (!token) {
      toast.error("Please login to place an order.");
      return;
    }

    // COD offline support: queue order when offline
    if (method === "cod" && !navigator.onLine) {
      try {
        const newEntry = {
          orderData,
          method,
          token,
          createdAt: new Date().toISOString(),
        };
        const result = addPendingOrder(newEntry);
        // result: { arr, added }
        const pending = result?.arr || [];
        const added = result?.added;
        // update in-memory state from storage
        setPendingOrders(pending);
        if (added) {
          // only clear cart when a new queued order was actually added
          setCartItems({});
          toast.info(
            "You're offline — order queued and will be placed when you're online."
          );
        } else {
          toast.info("This order is already queued.");
        }
        return;
      } catch (err) {
        console.log("Failed to queue order:", err);
        toast.error("Unable to queue order locally.");
        return;
      }
    }

    // For online COD or Stripe, perform the network request
    try {
      if (method === "cod") {
        const response = await axios.post(
          backendUrl + "/api/order/place",
          orderData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          setCartItems({});
          navigate("/orders");
        } else {
          toast.error(response.data.message);
        }
      } else if (method === "stripe") {
        const response = await axios.post(
          backendUrl + "/api/order/stripe",
          orderData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          const { session_url } = response.data;
          window.location.replace(session_url);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (err) {
      console.log("placeOrder error:", err);
      toast.error(err?.message || "Order failed");
    }
  };

  // Sync pending orders on reconnect or when token becomes available
  const syncPendingOrders = async () => {
    const pending = loadPendingOrders();
    if (!pending || !pending.length) return;
    // Attempt to send each pending order
    const remaining = [];
    for (const p of pending) {
      try {
        // require token — prefer the token stored with queued order
        const orderToken = p.token || token;
        if (!orderToken) {
          remaining.push(p);
          continue;
        }
        if (p.method === "cod") {
          const res = await axios.post(
            backendUrl + "/api/order/place",
            p.orderData,
            {
              headers: { Authorization: `Bearer ${orderToken}` },
            }
          );
          if (!res.data.success) {
            console.log("Server rejected queued order:", res.data.message);
            remaining.push(p);
          }
        } else {
          // Stripe or other payment methods require interactive flow — keep them pending
          remaining.push(p);
        }
      } catch (err) {
        console.log("Failed to sync pending order:", err);
        remaining.push(p);
      }
    }
    try {
      savePendingOrders(remaining);
      setPendingOrders(remaining);
      if (remaining.length === 0) {
        toast.success("All queued orders have been placed.");
      } else {
        toast.info(`${remaining.length} queued orders remain unsent.`);
      }
    } catch (err) {
      console.log("Failed to update pending_orders storage:", err);
    }
  };

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      if (token) syncPendingOrders();
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    // initialize pendingOrders from storage
    try {
      const initial = loadPendingOrders();
      if (initial) setPendingOrders(initial);
    } catch (err) {
      console.log("Failed to initialize pending_orders:", err);
    }
    // listen for cross-component pending order updates
    function onPendingUpdated() {
      try {
        const fresh = loadPendingOrders();
        setPendingOrders(fresh || []);
      } catch (err) {
        console.log("Failed to update pending_orders from event:", err);
      }
    }
    window.addEventListener("pendingOrdersUpdated", onPendingUpdated);
    // also try on mount if online
    if (navigator.onLine && token) syncPendingOrders();
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("pendingOrdersUpdated", onPendingUpdated);
    };
  }, [token]);

  // helper exposed to components so they don't manipulate localStorage directly
  const removePendingOrder = (index) => {
    const updated = removePendingOrderAt(index);
    setPendingOrders(updated);
    return updated;
  };

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    placeOrder,
    pendingOrders,
    removePendingOrder,
    isOnline,
    syncPendingOrders,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
