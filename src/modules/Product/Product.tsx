import { db } from "@/firebase";
import type { TabsProps } from "antd";
import { Tabs } from "antd";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import "./Product.css";
import ProductList from "./components/ProductList";
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
function Product() {
  const [product, setProduct] = useState<DataType[]>([]);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const dbRef = ref(db, "menu");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const products = Object.keys(data).map((key) => {
            return Object.assign({ key: key }, data[key]) as DataType;
          });
          setProduct(products);
        } else throw new Error("No foods found!");
      } catch (error) {
        console.error("Error fetching foods: ", error);
      }
    };
    fetchFood();
  }, []);
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "ALL",
      children: <ProductList product={product.slice(0, 10)} />,
    },
    {
      key: "2",
      label: "TRENDING",
      children: (
        <ProductList product={product.filter((item) => item.trending)} />
      ),
    },

    {
      key: "3",
      label: "BEST SELLER",
      children: (
        <ProductList product={product.filter((item) => item.bestSeller)} />
      ),
    },
  ];
  
  return (
    <div className="container mx-auto mt-[100px]">
      <div className="flex justify-start items-center gap-10">
        <h1 className="text-[36px] text-[#222] font-bold">Products</h1>
        
      </div>

      <div className="">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
}

export default Product;
