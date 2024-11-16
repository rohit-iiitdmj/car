import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux"
import {addProductDetails}  from "../services/AuthL"
const CarAdd = () => {
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: {
      carType: '',
      company: '',
      dealer: '',
      otherTags: [],
    },
    images: [],
  });

  const [imageFiles, setImageFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('tags.')) {
      const tagKey = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        tags: { ...prev.tags, [tagKey]: value },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 10) {
      alert('You can upload up to 10 images only.');
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("tags[carType]", formData.tags.carType);
    data.append("tags[company]", formData.tags.company);
    data.append("tags[dealer]", formData.tags.dealer);
    formData.tags.otherTags.forEach((tag, idx) =>
      data.append(`tags[otherTags][${idx}]`, tag)
    );
    imageFiles.forEach((file) => data.append("images", file));
  
    console.log("Token being sent:", token);
    console.log("FormData being sent:", [...data]);
  
    try {
      const response = await axios.post("https://car-t4vz.onrender.com/api/v1/auth/addCar", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("API Response:", response.data);
      alert("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert("Unauthorized: Please check your token or login again.");
      } else {
        alert("Error creating product. Check console for details.");
      }
    }
  };
  
  

 

  return (
    <form
      onSubmit={handleSubmit}
      className="max-full  mx-auto       bg-richblack-700 shadow-md rounded-lg p-6 space-y-4"
    >
      <div>
        <label className="block text-gray-700 text-richblack-300 font-medium">Title</label>
        <input
       
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md shadow-md text-richblack-200 bg-richblack-800 p-2 mt-1 focus:outline-none focus:ring-2  focus:ring-richblack-5"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 text-richblack-300 font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-gray-300  text-richblack-200 rounded-md bg-richblack-800 p-2 mt-1 focus:ring-richblack-5"
        />
      </div>
      <div>
        <label className="block text-gray-700  text-richblack-300 font-medium">Car Type</label>
        <input
          type="text"
          name="tags.carType"
          value={formData.tags.carType}
          onChange={handleChange}
          className="w-full border border-gray-300 bg-richblack-800 text-richblack-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-richblack-5"
        />
      </div>
      <div>
        <label className="block text-gray-700 text-richblack-300 font-medium">Company</label>
        <input
          type="text"
          name="tags.company"
          value={formData.tags.company}
          onChange={handleChange}
          className="w-full border border-gray-300 bg-richblack-800 text-richblack-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-richblack-5"
        />
      </div>
      <div>
        <label className="block text-gray-700 text-richblack-300 font-medium">Dealer</label>
        <input
          type="text"
          name="tags.dealer"
          value={formData.tags.dealer}
          onChange={handleChange}
          className="w-full border border-gray-300 text-richblack-300 bg-richblack-800 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-richblack-5"
        />
      </div>
      <div>
        <label className="block text-gray-700  text-richblack-300 font-medium">Images (max 10)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border border-gray-300 text-richblack-300 bg-richblack-800 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-richblack-5"
        />
        <div className="mt-2 space-y-1">
          {imageFiles.map((file, idx) => (
            <p key={idx} className="text-gray-600 text-sm">
              {file.name}
            </p>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-yellow-100  text-richblack-75     font-bold py-2 px-4 rounded-md hover:bg-yellow-200 focus:outline-none focus:ring-2   focus:bg-yellow-300 focus:ring-offset-2"
      >
        Submit
      </button>
    </form>
  );
};



export default CarAdd;
