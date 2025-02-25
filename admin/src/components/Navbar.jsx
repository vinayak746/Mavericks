import React from 'react';
import logo from '../assets/logo.png'; // Correct import statement

const Navbar = () => {
  return (
    <div>
      <img className='w-[max(10%, 80px)] ' src={logo} alt='Logo' />
      <button className='bg-gray-600 text-white py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm  '>Logout</button>
    </div>
  );
};

export default Navbar;