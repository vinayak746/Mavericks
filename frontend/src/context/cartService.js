import axios from "axios";

// Local-only helpers (pure functions)
export function addToCartLocal(cartItems, itemId, size) {
  const cartData = structuredClone(cartItems || {});
  if (cartData[itemId]) {
    if (cartData[itemId][size]) {
      cartData[itemId][size]++;
    } else {
      cartData[itemId][size] = 1;
    }
  } else {
    cartData[itemId] = {};
    cartData[itemId][size] = 1;
  }
  return cartData;
}

export async function addToCartRemote(backendUrl, token, itemId, size) {
  if (!token) return;
  try {
    await axios.post(
      backendUrl + "/api/cart/add",
      { itemId, size },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    // propagate for caller to handle logging
    throw err;
  }
}

export function updateQuantityLocal(cartItems, itemId, size, quantity) {
  const cartData = structuredClone(cartItems || {});
  if (!cartData[itemId]) cartData[itemId] = {};
  cartData[itemId][size] = quantity;
  return cartData;
}

export async function updateQuantityRemote(
  backendUrl,
  token,
  itemId,
  size,
  quantity
) {
  if (!token) return;
  try {
    await axios.post(
      backendUrl + "/api/cart/update",
      { itemId, size, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    throw err;
  }
}

export async function syncCartToServer(cart, backendUrl, token) {
  if (!token) return;
  for (const itemId of Object.keys(cart || {})) {
    for (const size of Object.keys(cart[itemId] || {})) {
      const quantity = cart[itemId][size];
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.log(
          "syncCartToServer failed for",
          itemId,
          size,
          err?.message || err
        );
      }
    }
  }
}
