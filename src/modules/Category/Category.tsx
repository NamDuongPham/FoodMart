import { db } from "@/firebase";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import CategoryItem from "./components/CategoryItem";
interface TypeOfDish {
  typeOfDishName: string;
  image: string;
}
function Category() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [type, setType] = useState<TypeOfDish[]>([]);
  useEffect(() => {
    const fetchType = async () => {
      try {
        const dbRef = ref(db, "TypeOfDish");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          setType(Object.values(snapshot.val()));
        } else throw new Error("No categories found!");
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };
    fetchType();
  }, []);
  //console.log(categories);
  
  const visibleCategories = type.slice(
    scrollPosition / 400,
    scrollPosition / 400 + 5
  );
  const handlePrevClick = () => {
    setScrollPosition(Math.max(scrollPosition - 600, 0));
  };

  const handleNextClick = () => {
    setScrollPosition(Math.min(scrollPosition + 300, 300));
  };
  return (
    <div className="container mx-auto mt-[100px] overflow-hidden">
      <h1 className="text-[36px] text-red-500 font-bold">Category</h1>
      <div className="flex flex-row justify-end items-center gap-2">
        <button
          className="text-[#222] font-semibold text-[11px] bg-[#f1f1f1]"
          onClick={handlePrevClick}
          disabled={scrollPosition === 0}
        >
          <AiOutlineArrowLeft />
        </button>
        <button
          className=" font-semibold text-[11px] text-white bg-[#BE1515]"
          onClick={handleNextClick}
          disabled={scrollPosition >= 400}
        >
          <AiOutlineArrowRight />
        </button>
      </div>
      <div
        className="mt-[50px] flex flex-row justify-between items-center"
        style={{
          transform: `translateX(-${scrollPosition}px)`,
          transition: "transform 0.5s ease-in-out",
        }}
      >
        {visibleCategories.map((category,i) => (
          <CategoryItem key={i} name={category.typeOfDishName} image={category.image} />
        ))}
      </div>
    </div>
  );
}

export default Category;
