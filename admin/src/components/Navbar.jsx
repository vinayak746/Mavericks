import React from 'react';
import logo from '../assets/logo.png'; // Correct import statement

const Navbar = () => {
  return (
    <div>
      <img className='w-full justify-center' src={logo} alt='Logo' />
      <button>Logout</button>
    </div>
  );
};

export default Navbar;