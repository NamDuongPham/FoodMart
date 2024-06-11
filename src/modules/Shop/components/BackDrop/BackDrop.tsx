import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import breadBD from "@/assets/images/breadBD.png";
import cakeThumb from "@/assets/images/cakeThumb.png";
import pastryThumb from "@/assets/images/pastryThumb.png";
type CategoryImages = {
  breadBD?: string;
  cakeThumb?: string;
  pastryThumb?: string;
};
function BackDrop() {
  const location = useLocation();
  const categoryImages = {
    bread: { breadBD },
    cake: { cakeThumb },
    pastry: { pastryThumb },
    sandwiches: { breadBD },
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

  const imageSrc: CategoryImages =
    categoryImages[category.toLowerCase() as keyof typeof categoryImages] ||
    categoryImages.bread;

  return (
    <div className="mt-10 relative">
      <img
        src={imageSrc?.breadBD ?? imageSrc?.cakeThumb ?? imageSrc?.pastryThumb}
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
