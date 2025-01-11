import React from 'react'
import { assets } from '../assets/assets.js'

const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14  my-10 mt-40 text-sm'>
            <div>
                <img src={assets.logo} alt='logo' className=' mb-5 w-32' />
                <p className='w-full md:2/3 text-gray-600'> 
                    Vinayak the lord hahahah hahahha i don't know what to write here so i am just writing anything that comes to my mind
                </p>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>Vinayak Company</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>Phone: +91 9319316514</li>
                    <li>Email: vinayakarora7461@gamil.com</li>
                </ul>
            </div>
        </div>
        <div>
            <hr />
            <p className='py-5 text-sm text-center'> Copyright 2025@ Mavericks.com - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer