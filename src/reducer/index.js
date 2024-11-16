import {combineReducers} from "@reduxjs/toolkit";
import authReducer from "../Slices/authSlices"
import profileReducer from "../Slices/profileSlice";
import productSlice from "../Slices/profileSlice"
const rootReducer  = combineReducers({
    auth: authReducer,
    profile:profileReducer,
    product:productSlice

    
})

export default rootReducer;