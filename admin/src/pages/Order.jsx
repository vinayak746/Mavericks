import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");

  const fetchAllOrders = async () => {
    // console.log({token});
    if (!token) return;
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3>Order Page</h3>
        <select onChange={(event) => setFilter(event.target.value)}>
          <option value="All">All</option>
          <option value="Order Placed">Order Placed</option>
          <option value="Packing">Packing</option>
          <option value="Shipped">Shipped</option>
          <option value="Out for delivery">Out for delivery</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>
      <div>
        {orders
          .slice()
          .reverse()
          .map(
            (order, index) =>
              (filter === "All" || order.status === filter) && (
                <div
                  className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs text-gray-700   "
                  key={index}
                >
                  <img
                    className="w-12"
                    src={assets.parcel_icon}
                    alt="Parcel Icon"
                  />
                  <div>
                    <div>
                      {order.items.map((item, itemIndex) => (
                        <p className="py-0.5" key={itemIndex}>
                          {item.name} x {item.quantity} <span>{item.size}</span>
                          ,
                        </p>
                      ))}
                    </div>
                    <p className="mt-3 mb-3 font-medium">
                      {order.address.firstName + " " + order.address.lastName}{" "}
                    </p>
                    <div>
                      <p>{order.address.street + ","}</p>
                      <p>
                        {order.address.city +
                          ", " +
                          order.address.state +
                          ", " +
                          order.address.country +
                          ", " +
                          order.address.zipcode}
                      </p>
                    </div>
                    <p>{order.address.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm sm:text-[15px]">
                      Items : {order.items.length}
                    </p>
                    <p className="mt-3">Method : {order.paymentMethod}</p>
                    <p>Payment : {order.payment ? "Done" : "Pending"}</p>
                    <p>Date : {new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm sm:text-[15px] ">
                    {currency}
                    {order.amount}
                  </p>
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                    className="p-2 font-semibold"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              )
          )}
      </div>
    </div>
  );
};

export default Order;
