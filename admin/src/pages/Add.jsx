import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      console.log("Sending request to:", `${backendUrl}/api/products/add`);
      const response = await axios.post(`${backendUrl}/api/products/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    if(response.data.success){
      toast.success(response.data.message);
      setName("");
      setDescription("");
      setImage1(false);
      setImage2(false);
      setImage3(false);
      setImage4(false);
      setPrice("");
    }else{
      toast.error(response.data.message);
    }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <div className="flex flex-col w-full items-start gap-3">
        <p className="mb-2">Upload Image</p>

        <div className="flex gap-2">
          <label htmlFor="image1">
            <img className="w-20" src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="upload" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" name="image1" hidden />
          </label>
          <label htmlFor="image2">
            <img className="w-20" src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="upload" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" name="image2" hidden />
          </label>
          <label htmlFor="image3">
            <img className="w-20" src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="upload" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" name="image3" hidden />
          </label>
          <label htmlFor="image4">
            <img className="w-20" src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="upload" />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" name="image4" hidden />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className="w-full max-w-[500px] px-3 py-2" type="text" id="name" name="name" placeholder="Type here...." required autoComplete="name" />
      </div>
      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className="w-full max-w-[500px] px-3 py-2" type="text" id="description" name="description" placeholder="Write here...." required autoComplete="description" />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product category</p>
          <select onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2" id="category" name="category" autoComplete="category">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Sub category</p>
          <select onChange={(e) => setSubCategory(e.target.value)} className="w-full px-3 py-2" id="subCategory" name="subCategory" autoComplete="sub-category">
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className="w-full px-3 py-2 sm:w-[120px]" type="number" id="price" name="price" placeholder="200" required autoComplete="price" />
        </div>
      </div>

      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          <div onClick={(e) => { e.preventDefault(); setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev, "S"]); }}>
            <p className={`${sizes.includes("S") ? "bg-purple-300 border" : "bg-slate-300"} px-3 py-1 cursor-pointer`}>S</p>
          </div>
          <div onClick={(e) => { e.preventDefault(); setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev, "M"]); }}>
            <p className={`${sizes.includes("M") ? "bg-purple-300 border" : "bg-slate-300"} px-3 py-1 cursor-pointer`}>M</p>
          </div>
          <div onClick={(e) => { e.preventDefault(); setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev, "L"]); }}>
            <p className={`${sizes.includes("L") ? "bg-purple-300 border" : "bg-slate-300"} px-3 py-1 cursor-pointer`}>L</p>
          </div>
          <div onClick={(e) => { e.preventDefault(); setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev, "XL"]); }}>
            <p className={`${sizes.includes("XL") ? "bg-purple-300 border" : "bg-slate-300"} px-3 py-1 cursor-pointer`}>XL</p>
          </div>
          <div onClick={(e) => { e.preventDefault(); setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev, "XXL"]); }}>
            <p className={`${sizes.includes("XXL") ? "bg-purple-300 border" : "bg-slate-300"} px-3 py-1 cursor-pointer`}>XXL</p>
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-2">
        <input onChange={() => setBestSeller(prev => !prev)} checked={bestseller} type="checkbox" id="bestseller" name="bestseller" autoComplete="bestseller" />
        <label className="cursor-pointer" htmlFor="bestseller">Add to Best Seller</label>
      </div>
      <button type="submit" className="bg-black text-white w-20 py-3 mt-4">Add</button>
    </form>
  );
};

export default Add;