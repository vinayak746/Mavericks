import React from "react";
import { toast } from "react-toastify";

const NewsletterBox = () => {
  // developer note hahaha i am calling myself a developer ha so i am injoying myself making this so yeah lets see some time later
  const onSubmitHandler = (event) => {
    event.preventDefault();
    toast.success("Subscribed to newsletter successfully");
  };

  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800">
        Subscribe now & get 20% off{" "}
      </p>
      <p className="text-gray-400 mt-3">
        Subscribe to our newsletter and get 20% off your first purchase. We
        promise to only send you the good stuff.
        <br /> No spam, we promise.
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-ceenter gap-3 mx-auto my-6 border pl-3"
      >
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full sm:flex-1 outline-none"
          required
        />
        <button
          type="submit"
          className="bg-black text-white text-xs px-10 py-4"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
