import React from 'react'
import Title from '../components/Title.jsx'
import { assets } from '../assets/assets.js'
import NewsletterBox from '../components/NewsletterBox.jsx'

function Contact() {
  return (
    <div>
      <div className='text-2xl text-center pt-10 border-t'>
          <Title text1={'CONTACT'} text2={'US'}/>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img src={assets.contact_img} alt='contact' className='w-full md:max-w-[480px]'/>
        <div className='flex flex-col gap-6 justify-center items-start'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>High Valley,Barotiwala<br />Solan, Himachal Pradesh,INDIA</p>
          <p className='text-gray-500'>Tel: (+91) 9319316514 <br /> Email: vinayakarora7461@gamil.com</p>
          <p className='font-semibold text-gray-600'>Careers at Mavericks</p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
          
        </div>
      </div>
      <NewsletterBox />
    </div>
  )
}

export default Contact