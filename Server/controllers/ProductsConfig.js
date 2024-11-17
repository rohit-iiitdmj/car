const Product = require("../models/Product");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const {uploadImageToCloudinary }= require("../Utils/uploadImage"); 

exports.addCar = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id;

    // Get all required fields from request body
    const { title, description, tags: _tags } = req.body;
    console.log(title,description, tags);
    
   
    // Get images from request files
    const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

    // Convert tags from stringified array to array
    const tags = JSON.parse(_tags || "[]");
    console.log(tags);

    // Validate required fields
    if (!title || !description ) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory: title, description, tags, and images.",
      });
    }

    // Limit images to 10
    if (images.length > 10) {
      return res.status(400).json({
        success: false,
        message: "You can upload a maximum of 10 images.",
      });
    }

    // Upload each image to Cloudinary and gather URLs
    const imageUrls = [];
    for (let i = 0; i < images.length; i++) {
      const uploadedImage = await uploadImageToCloudinary(images[i], process.env.FOLDER_NAME);
      imageUrls.push(uploadedImage.secure_url);
    }

    // Check if user exists
    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Create a new car (product)
    const newCar = await Product.create({
      userId: userDetails._id,
      title,
      description,
      tags,
      images: imageUrls, // Use URLs from Cloudinary
    });

    // Add the new car to the user's products
    await User.findByIdAndUpdate(
      userDetails._id,
      { $push: { products: newCar._id } },
      { new: true }
    );

    // Log the action in the audit log
    await AuditLog.create({
      userId: userDetails._id,
      action: "CREATE",
      carId: newCar._id,
      details: `Created car with title: ${title}`,
    });

    // Respond with the new car
    res.status(200).json({
      success: true,
      data: newCar,
      message: "Car added successfully",
    });
  } catch (error) {
    // Handle errors during car creation
    console.error("Error adding car:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add car",
      error: error.message,
    });
  }
  
};







exports.updateCar = async (req, res) => {
  try {
    // Get car ID from request params
    const { id } = req.body;

    // Get updated fields from request body
    const { title, description, tags: _tags } = req.body;

    // Parse tags if provided
    const tags = _tags ? JSON.parse(_tags) : undefined;

    // Get images from request files (if any)
    const images = req.files?.images;

    // Check if car exists
    const car = await Product.findOne({ _id: id, userId: req.user.id });
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found or you do not have permission to update this car.",
      });
    }

    // If images are provided, upload to Cloudinary and replace existing ones
    let updatedImages = car.images; // Use existing images by default
    if (images) {
      if (images.length > 10) {
        return res.status(400).json({
          success: false,
          message: "You can upload a maximum of 10 images.",
        });
      }

      // Upload new images to Cloudinary
      updatedImages = [];
      for (let i = 0; i < images.length; i++) {
        const uploadedImage = await uploadImageToCloudinary(images[i], process.env.FOLDER_NAME);
        updatedImages.push(uploadedImage.secure_url);
      }
    }

    // Update the car details
    const updatedCar = await Product.findByIdAndUpdate(
      id,
      {
        title: title || car.title,
        description: description || car.description,
        tags: tags || car.tags,
        images: updatedImages,
        updatedAt: Date.now(),
      },
      { new: true } // Return the updated document
    );

    // Log the update in the AuditLog
    await AuditLog.create({
      userId: req.user.id,
      action: "UPDATE",
      carId: id,
      details: `Updated car with title: ${updatedCar.title}`,
    });

    // Respond with the updated car
    res.status(200).json({
      success: true,
      data: updatedCar,
      message: "Car updated successfully.",
    });
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update car.",
      error: error.message,
    });
  }
};



exports.getAllCarsPublic = async (req, res) => {
  try {
    // Fetch all cars without user filtering
    const allCars = await Product.find(
      {}, 
      {
        title: true,
        description: true,
        tags: true,
        images: true,
        createdAt: true,
        updatedAt: true,
      }
    )
      .sort({ createdAt: -1 }) // Sort by most recent
      .populate("userId", "Name LastName email") // Populate user info (optional)
      .exec();

    return res.status(200).json({
      success: true,
      data: allCars,
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch car details.",
      error: error.message,
    });
  }
};



exports.deleteCar = async (req, res) => {
  try {
    // Get the car ID from request parameters
    const { courseId} = req.body;
    console.log( courseId);

    // Find the car by ID and ensure it belongs to the authenticated user
    const car = await Product.findOne({ _id: courseId});
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found or you do not have permission to delete this car.",
      });
    }

    // Remove the car from the Product collection
    await Product.findByIdAndDelete({_id: courseId});

    // Remove the car reference from the user's products list
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { products: {_id: courseId}} }, // Pull the car ID from the products array
      { new: true }
    );

    // Log the deletion in the AuditLog
    await AuditLog.create({
      userId: req.user.id,
      action: "DELETE",
      carId: {_id: courseId},
      details: `Deleted car with title: ${car.title}`,
    });

    // Respond with success message
    res.status(200).json({
      success: true,
      message: `Car titled '${car.title}' has been deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete car.",
      error: error.message,
    });
  }
};



exports.getUserProducts = async (req, res) => {
  try {
    // Find all products created by the authenticated user
    const products = await Product.find({ userId: req.user.id }).sort({ createdAt: -1 });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this user.",
      });
    }

    // Respond with the list of products
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching user's products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user's products.",
      error: error.message,
    });
  }
};





