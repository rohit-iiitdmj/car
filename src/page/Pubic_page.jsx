import SimpleImageSlider from "react-simple-image-slider";
import Slider from "@madzadev/image-slider";
import "@madzadev/image-slider/dist/index.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {getAllCarsPublic}  from '../services/AuthL'
// const products = [
//   {
//     id: 1,
//     name: "Basic Tee",
//     href: "#",
//     images : [
//       { url: "https://picsum.photos/seed/a/1600/900" },
//       { url: "https://picsum.photos/seed/b/1920/1080" },
//       { url: "https://picsum.photos/seed/c/1366/768" },
//     ],
//     imageAlt: "Front of men's Basic Tee in black.",
//     price: "$35",
//     color: "Black",
//   },
//   // More products...
// ];

export default function Pubic_page() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  // Fetch product details directly
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await getAllCarsPublic(); 
        // Replace with your API
        // console.log(result)
        if (result) {
          setProducts(result);
          const processedProducts = result.map((product) => ({
            ...product,
            images: product.images.map((img) => ({ url: img })), // Transform `images` array
          }));
          setProducts(processedProducts);
          console.log(products[1].images)
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
      setLoading(false);
    };


    fetchProducts(); // Call the function
  }, []); // Empty dependency array means it runs only once on mount

  // Conditional rendering
  if (loading || products.length==0) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!loading && products.success) {
    return <div>Error</div>;
  }


 

 

  return (
    <div className="   bg-richblack-900  ">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight  text-richblack-5">
          Customers Car List
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-16 gap-y-10 sm:gri d-cols-2 lg:grid-cols-4 xl:gap-x-36">
          {products.map((product) => (
            <div
              key={product.id}
              className="group   bg-richblack-800 w-80  rounded-lg   px-4 py-4 shadow-2xl "
            >
              <div className="aspect-square  w-full rounded-sm bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80">
              <Slider imageList={product.images}
               width={1000} height={300}
                loop={true}
               autoPlay={true}
               showDotControls={false}
               showArrowControls={false}
               autoPlayInterval={2000}
              />
              </div>
              {/* <SimpleImageSlider
                width={350}
                height={320}
                images={product.imageSrc}
                showBullets={true}
                showNavs={true}
                navSize={30}
                loop={true}
                className="aspect-square  w-full rounded-full bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
              /> */}
              {/* <img
                alt={product.imageAlt}
                src={product.imageSrc}
                className="aspect-square  w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
              /> */}
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-richblack-5">
                    <a href={product.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                  
                                    {product.userId.Name+" " + product.userId.LastName}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-richblack-5">
                    {product.title}
                  </p>
                </div>
                <p className="text-sm font-medium text-richblack-5">
                Created:{new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
