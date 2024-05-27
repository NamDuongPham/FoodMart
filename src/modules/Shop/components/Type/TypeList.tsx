import { useEffect, useState } from "react";
import TypeItem from "./TypeItem";
import { get, ref } from "firebase/database";
import { db } from "@/firebase";
import { useLocation, useParams } from "react-router-dom";
interface DataType {
  key: React.Key;
  foodName: string;
  foodDescription: string;
  foodImage: string;
  foodIngredient: string;
  foodPrice: string;
  discount: number;
  categoryId: string;
  typeOfDishId: string;
  bestSeller: boolean;
  trending: boolean;
  inStock: boolean;
}
function TypeList() {
  const [product, setProduct] = useState<DataType[]>([]);
  const location = useLocation();

  // Function to parse the query string
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const query = useQuery();
  const category = query.get("category");
  const type = query.get("type") ?? "SUGAR LOAF";
  useEffect(() => {
    const fetchFood = async () => {
      try {
        const dbRef = ref(db, "menu");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const filteredProducts = Object.entries(data)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
            .filter(([key, value]: [string, any]) => {
              if (category) {
                return (
                  value.typeOfDishId === category && value.categoryId === type
                );
              }
              return value.categoryId === type;
            })
            .map(([key, value]) => ({
              key,
              ...value,
            }));
          console.log("product", filteredProducts);
          setProduct(filteredProducts);
        } else throw new Error("No foods found!");
      } catch (error) {
        console.error("Error fetching foods: ", error);
      }
    };
    fetchFood();
  }, [category, type]);
  const productChunks = product.reduce<DataType[][]>(
    (resultArray, item, index) => {
      const chunkIndex = Math.floor(index / 4);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // Start a new chunk
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    },
    []
  );

  return (
    <>
      {productChunks.map((chunk, index) => (
        <div key={index} className="grid grid-cols-4 gap-10 mb-10">
          {chunk.map((item) => (
            <TypeItem key={item.key} product={item} />
          ))}
        </div>
      ))}
    </>
  );
}

export default TypeList;
