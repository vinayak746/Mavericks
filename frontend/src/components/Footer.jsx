import React from "react";
import { assets } from "../assets/assets.js";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14  my-10 mt-40 text-sm">
        <div>
          <Link to="/">
            <img src={assets.logo} alt="logo" className=" mb-5 w-32" />
          </Link>
          <p className="w-full md:2/3 text-gray-600">
            Mavericks is a leading online shopping platform that offers a wide
            range of products at competitive prices.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">Vinayak Company</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/About">About us</Link>
            </li>
            <li>
              <Link to="Delivery" className="pointer-events-none">
                Delivery
              </Link>
            </li>
            <li>
              <Link to="Privacy_policy" className="pointer-events-none">
                Privacy policy
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>
              Phone: <Link to="tel:+919319316514">+91 9319316514</Link>
            </li>
            <li>
              Email:{" "}
              <Link to="mailto:vinayakarora7461@gamil.com">
                vinayakarora7461@gamil.com
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          {" "}
          Copyright 2025@ Mavericks.com - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
