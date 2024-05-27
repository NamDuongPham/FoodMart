import { useSearchParams } from "react-router-dom";

import CategoryItem from "./CategoryItem";
import { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { db } from "@/firebase";
interface TypeOfDish {
  typeOfDishName: string;
  image: string;
}
function Category() {
  const [params] = useSearchParams();
  const category = params.get("category");
  const [typeOfDish, setTypeOfDish] = useState<TypeOfDish[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const dbRef = ref(db, "TypeOfDish");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          setTypeOfDish(Object.values(snapshot.val()));
        } else throw new Error("No categories found!");
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };
    fetchCategories();
  }, []);
  return (
    <div className="bg-[#f1dab2]">
      <div className="container mx-auto">
        <div className="flex flex-row items-center justify-between overflow-x-auto">
          {typeOfDish.map((item) => (
            <CategoryItem
              key={item.typeOfDishName}
              label={item.typeOfDishName}
              icon={item.image}
              selected={category === item.typeOfDishName}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Category;
