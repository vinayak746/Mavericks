// Small helpers for cart calculations and merging
export function computeCartCount(cartItems) {
  let totalCount = 0;
  for (const items in cartItems || {}) {
    for (const size in cartItems[items] || {}) {
      const qty = Number(cartItems[items][size]) || 0;
      if (qty > 0) totalCount += qty;
    }
  }
  return totalCount;
}

export function computeCartAmount(cartItems, products) {
  let totalAmount = 0;
  for (const items in cartItems || {}) {
    const itemInfo = (products || []).find((p) => p._id === items);
    for (const size in cartItems[items] || {}) {
      try {
        const qty = Number(cartItems[items][size]) || 0;
        if (qty > 0 && itemInfo) {
          totalAmount += (itemInfo.price || 0) * qty;
        }
      } catch (err) {
        // ignore malformed entries
      }
    }
  }
  return totalAmount;
}

export function mergeCarts(serverCart = {}, localCart = {}) {
  const merged = { ...serverCart };
  for (const itemId of Object.keys(localCart || {})) {
    if (!merged[itemId]) merged[itemId] = {};
    for (const size of Object.keys(localCart[itemId] || {})) {
      merged[itemId][size] = localCart[itemId][size];
    }
  }
  return merged;
}
