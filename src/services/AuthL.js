import { toast } from "react-hot-toast"
import axios from 'axios';
import { setLoading, setToken } from "../Slices/authSlices"
// import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../Slices/profileSlice"
import { apiConnector } from "./apiconnect"
// import { endpoints } from "../apis"


import { createAsyncThunk } from '@reduxjs/toolkit';



export function signUp(
    
    Name,
    LastName,
    email,
    password,
    confirmPassword,
   
    navigate
  ) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      dispatch(setLoading(true))
      try {
        console.log("hii1")
        const response = await apiConnector("POST", "http://localhost:4000/api/v1/auth/signup",  {
        
          Name,
          LastName,
          email,
          password,
          confirmPassword,
          
        });
        console.log(response.data);
  
  
        // const response = await apiConnector("POST", SIGNUP_API, {
        //   accountType,
        //   firstName,
        //   lastName,
        //   email,
        //   password,
        //   confirmPassword,
        //   otp,
        // })
        console.log("hii2")
  
        console.log("SIGNUP API RESPONSE............", response)
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        toast.success("Signup Successful")
        navigate("/login")
      } catch (error) {
        console.log("SIGNUP API ERROR............", error)
        toast.error("Signup Failed")
        navigate("/signup")
      }
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }



  export function login(email, password, navigate) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      dispatch(setLoading(true))
      try {
        const response = await apiConnector("POST", "http://localhost:4000/api/v1/auth/login", {
          email,
          password,
        })
  
        console.log("LOGIN API RESPONSE............", response)
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
  
        toast.success("Login Successful")
        dispatch(setToken(response.data.token))
        const userImage = response.data?.user?.image
          ? response.data.user.image
          : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
        dispatch(setUser({ ...response.data.user, image: userImage }))
        localStorage.setItem("token", JSON.stringify(response.data.token))
        localStorage.setItem("user", JSON.stringify(response.data.user))
        navigate("/dashboard/my-profile")
      } catch (error) {
        console.log("LOGIN API ERROR............", error)
        toast.error("Login Failed")
      }
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }


  export function logout(navigate) {
    return (dispatch) => {
      dispatch(setToken(null))
      dispatch(setUser(null))
      
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      toast.success("Logged Out")
      navigate("/")
    }
  }



  export const fetchInstructorCourses = async (token) => {
    let result = []
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector(
        "GET",
        "http://localhost:4000/api/v1/auth/getUserProducts",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      )
      console.log("INSTRUCTOR COURSES API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Fetch Instructor Courses")
      }
      result = response?.data?.data
    } catch (error) {
      console.log("INSTRUCTOR COURSES API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  }



  export const deleteCourse = async (data, token) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("DELETE", `http://localhost:4000/api/v1/auth/deleteCar`, data, {
        Authorization: `Bearer ${token}`,
      })
      console.log(data);
      console.log("DELETE COURSE API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Delete Course")
      }
      toast.success("Course Deleted")
    } catch (error) {
      console.log("DELETE COURSE API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
  }
  




 

export const addProductDetails = createAsyncThunk(
  'products/addProduct',

  async ({ data, token }, { rejectWithValue }) => {
    try {
     
      const response = await apiConnector('POST', 'http://localhost:4000/api/v1/auth/addCar', data, {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      });

      if (!response?.data?.success) {
        throw new Error('Could Not Add Product Details');
      }

      return response?.data?.data;
      toast.success(" Deleted")
    } catch (error) {
      return rejectWithValue(error.message);
    }
  
  }
);


export const editProductDetails = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", "", data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    console.log("EDIT COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details")
    }
    toast.success("Course Details Updated Successfully")
    result = response?.data?.data
  } catch (error) {
    console.log("EDIT COURSE API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}
