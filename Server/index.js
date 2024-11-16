const express = require('express');

const dotenv = require('dotenv');
const userRoutes=require("./routes/User_R");
const productsRoutes = require("./routes/Product_R");
const cookieParser = require("cookie-parser");
const database = require("./config/database");
const cors = require("cors");
const bodyparser = require('body-parser');
const fileUpload = require("express-fileupload");
const multer = require("multer");

const {cloudinaryConnect } = require("./config/cloudinary");
dotenv.config();
const app = express();



const PORT = process.env.PORT || 5000;
database.connect();
//middlewares
app.use(express.json());

app.use(cookieParser());
app.use(cors());
app.options("*", cors());
app.use(
	fileUpload({
	  useTempFiles: true, // Enables temporary file storage
	  tempFileDir: "/tmp/", // Path for temporary files
	  limits: { fileSize: 10 * 1024 * 1024 }, // Maximum file size (10 MB)
	})
  );
//cloudinary connection
cloudinaryConnect();




app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/auth", productsRoutes);





app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})
