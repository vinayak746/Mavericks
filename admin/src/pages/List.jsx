import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const List = ({token}) => {

  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/products/list');
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching list:", error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/products/remove' , {id}, {headers: {
        Authorization: `Bearer ${token}`
      }});
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>
        {/* ...................List Table Title................... */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] text-center text-sm bg-gray-200 py-1 px-2'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>
        {/* ---------------product list----------------- */}
        {
          list.map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
              <div className='flex justify-center'>
                <img src={item.image[0]} className='w-12' alt={item.name} />
              </div>
              <p className='text-center'>{item.name}</p>
              <p className='text-center'>{item.category}</p>
              <p className='text-center'>{currency}{item.price}</p>
              <p onClick={()=>removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg' >X</p>
            </div>
          ))
        }
      </div>
    </>
  );
};

export default List;