import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function BackDrop() {
  const location = useLocation();
  const categoryImages = {
    bread: "/images/breadBD.png",
    cake: "/images/cakeThumb.png",
    pastry: "/images/pastryThumb.png",
    sandwiches: "/images/breadBD.png",
  };

  // Function to parse the query string
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };

  const query = useQuery();
  const [category, setCategory] = useState(query.get("category") || "");
  // console.log(category);

  useEffect(() => {
    const newCategory = query.get("category") || "";

    setCategory(newCategory);
  }, [location.search]);

  const imageSrc =
    categoryImages[category.toLowerCase() as keyof typeof categoryImages] ||
    categoryImages.bread;

  return (
    <div className="mt-10 relative">
      <img
        src={imageSrc}
        className="w-full h-[700px] object-cover"
        alt="back drop"
      />
      <h1 className="font-serif absolute top-[45%] left-[40%] text-[100px] uppercase text-[#eddecd]">
        {category ? `${category}` : "SHOP"}
      </h1>
    </div>
  );
}

export default BackDrop;
