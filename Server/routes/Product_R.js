const express = require("express")
const router = express.Router()

const { auth } = require("../middlewares/Auth_m")

const {
    addCar,
  
    getAllCarsPublic,
    deleteCar,
    updateCar,
    getUserProducts,
  } = require("../controllers/ProductsConfig");

  
  router.post("/addCar",auth, addCar);
  router.get("/getAllCarsPublic", getAllCarsPublic);

  
  router.put("/updateCar", auth, updateCar);
  router.delete("/deleteCar", auth, deleteCar);
  router.get("/getUserProducts", auth,  getUserProducts);

  module.exports = router;