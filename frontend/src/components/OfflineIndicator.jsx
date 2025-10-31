import React, { useState } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext.jsx";

export default function OfflineIndicator() {
  const { isOnline, pendingOrders, syncPendingOrders, removePendingOrder } =
    useContext(ShopContext);
  const [showQueued, setShowQueued] = useState(false);
  // Only show this indicator while offline
  if (isOnline) return null;

  return (
    <>
      <div className="fixed left-4 top-4 z-50 flex items-center gap-3">
        <div
          title={isOnline ? "Online" : "Offline - changes will queue"}
          className={`w-3 h-3 rounded-full ${
            isOnline ? "bg-green-400" : "bg-red-500"
          } ring-2 ring-white`}
        />
        <div className="text-sm font-medium text-gray-800 dark:text-white">
          {isOnline ? "Online" : "Offline"}
        </div>
        <button
          onClick={() => setShowQueued((s) => !s)}
          className="ml-2 px-2 py-1 bg-gray-100 rounded text-sm border"
        >
          Queued:{" "}
          <span className="font-semibold">{pendingOrders?.length || 0}</span>
        </button>
        <button
          onClick={() => syncPendingOrders()}
          className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-sm"
        >
          Retry
        </button>
      </div>

      {showQueued && (
        <div className="fixed left-4 top-14 z-50 w-96 max-h-[60vh] overflow-auto bg-white border rounded shadow-lg p-3">
          <h4 className="font-semibold mb-2">
            Queued Orders ({pendingOrders?.length || 0})
          </h4>
          {pendingOrders && pendingOrders.length > 0 ? (
            pendingOrders.map((p, idx) => (
              <div key={idx} className="mb-2 p-2 border rounded">
                <div className="text-xs text-gray-600">
                  Queued at: {new Date(p.createdAt).toLocaleString()}
                </div>
                <div className="text-sm">
                  Items: {p.orderData.items?.length || 0}
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      try {
                        removePendingOrder(idx);
                      } catch (err) {
                        console.log("Failed to remove queued order:", err);
                      }
                    }}
                    className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => syncPendingOrders()}
                    className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                  >
                    Retry All
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No queued orders.</div>
          )}
        </div>
      )}
    </>
  );
}
