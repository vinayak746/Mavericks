// Lightweight helpers to manage pending orders in localStorage
export function loadPendingOrders() {
  try {
    const raw = localStorage.getItem("pending_orders");
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.log("orderUtils.loadPendingOrders failed:", err);
    return [];
  }
}

export function savePendingOrders(arr) {
  try {
    localStorage.setItem("pending_orders", JSON.stringify(arr));
    // notify any listeners in the app to refresh their view
    try {
      window.dispatchEvent(new Event("pendingOrdersUpdated"));
    } catch (e) {
      // ignore dispatch errors in unusual environments
    }
    return true;
  } catch (err) {
    console.log("orderUtils.savePendingOrders failed:", err);
    return false;
  }
}

export function addPendingOrder(entry) {
  const arr = loadPendingOrders();
  // create a lightweight signature to prevent duplicate queued orders
  function sigFor(o) {
    try {
      const items = (o.items || []).map((it) => ({
        id: it._id || it.id || it.productId || it.product || "",
        size: it.size || "",
        quantity: it.quantity || it.qty || 0,
      }));
      // sort items to make signature order-independent
      items.sort((a, b) => (a.id + a.size).localeCompare(b.id + b.size));
      const address = o.address || {};
      const addrParts = Object.keys(address)
        .sort()
        .reduce((acc, k) => {
          acc[k] = address[k];
          return acc;
        }, {});
      return JSON.stringify({ items, address: addrParts });
    } catch (e) {
      return JSON.stringify(o);
    }
  }

  const entrySig = sigFor(entry.orderData || {});
  const exists = arr.some((ex) => {
    try {
      const s = sigFor(ex.orderData || {});
      return s === entrySig;
    } catch (e) {
      return false;
    }
  });
  if (exists) {
    return { arr, added: false };
  }
  arr.push(entry);
  savePendingOrders(arr);
  return { arr, added: true };
}

export function removePendingOrderAt(index) {
  const arr = loadPendingOrders();
  if (index < 0 || index >= arr.length) return arr;
  arr.splice(index, 1);
  savePendingOrders(arr);
  return arr;
}
