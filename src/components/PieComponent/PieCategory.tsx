/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/firebase";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart } from "recharts";
interface RenderCustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}
interface DataType {
  key: React.Key;
  id: string;
  customer: string;
  totalPrice: string;
  currentTime: number;
  orderAccepted: boolean;
  paymentStatus: string;
  deliveryStatus: string;
  foodNames: [];
}
interface Menu {
  key: React.Key;
  foodName: string;
  foodDescription: string;
  foodImage: string;
  foodIngredient: string;
  foodPrice: string;
  categoryId: string;
  typeOfDishId: string;
  bestSeller: boolean;
  trending: boolean;
  discount: number;
  inStock: boolean;
  createAt?: "";
  startAt?: "";
  endAt?: "";
  tags: string[];
}
interface Category {
  key: React.Key;
  category_name: string;
}

interface PieCategoryProps {
  order: DataType[];
}

const COLORS = ["#0088FE", "#0de0ba"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: RenderCustomizedLabelProps) => {
  const radius: number = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x: number = cx + radius * Math.cos(-midAngle * RADIAN);
  const y: number = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const PieCategory = ({ order }: PieCategoryProps) => {
  const [product, setProduct] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchFood = async () => {
    const foodNamesFromOrder: string[] = order
      .slice(0, order.length)
      .flatMap((food) => food.foodNames);
    try {
      const dbRef = ref(db, "menu");
      const snapshot = await get(dbRef);
      const data = snapshot.val();
      const products = Object.keys(data).map((key) => {
        return Object.assign({ key: key }, data[key]) as Menu;
      });

      // So sánh danh sách món ăn từ order với danh sách món ăn từ menu
      const matchedProducts = products.filter((f) =>
        foodNamesFromOrder.includes(f.foodName)
      );
      setProduct(matchedProducts);
    } catch (error) {
      console.error("Error fetching foods: ", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const dbRef = ref(db, "categories");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        setCategories(Object.values(snapshot.val()));
      } else throw new Error("No categories found!");
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };
  const countProductsByCategory = (order: DataType[]) => {
    const categoryCount: { [key: string]: number } = {};
    order.forEach((item) => {
      item.foodNames.forEach((foodName) => {
        const matchedProduct = product.find((p) => p.foodName === foodName);
        if (matchedProduct) {
          const categoryId = matchedProduct.categoryId;
          categoryCount[categoryId] = (categoryCount[categoryId] || 0) + 1;
        }
      });
    });
    return categoryCount;
  };

  const calculateCategoryPercentages = (categoryCount: {
    [key: string]: number;
  }) => {
    const totalProducts = Object.values(categoryCount).reduce(
      (sum, count) => sum + count,
      0
    );
    const categoryPercentages: { [key: string]: number } = {};

    // Sắp xếp các loại món ăn từ cao đến thấp
    const sortedcategoryCount = Object.entries(categoryCount).sort(
      ([, countA], [, countB]) => countB - countA
    );
    // console.log(sortedcategoryCount);

    sortedcategoryCount.forEach(([typeId, count], index) => {
      categoryPercentages[typeId] = (count / totalProducts) * 100;
    });
    // console.log(sortedcategoryCount);

    return categoryPercentages;
  };
  const categoryCount = countProductsByCategory(order);
  // console.log(categoryCount);

  const categoryPercentages = calculateCategoryPercentages(categoryCount);
  //   console.log(categoryPercentages);

  useEffect(() => {
    // fetchType();
    fetchFood();
    fetchCategories();
  }, []);
  return (
    <div>
      <PieChart width={400} height={400}>
        <Pie
          data={Object.entries(categoryPercentages).map(
            ([typeId, percent]) => ({
              name: typeId,
              value: percent,
            })
          )}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {Object.keys(categoryPercentages).map((typeId, index) => (
            <Cell key={typeId} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
      <div className="grid grid-cols-4">
        {Object.entries(categoryPercentages)
          .filter(([, percent]) => percent > 0)
          .map(([typeId], index) => (
            <p key={`type-${index}`} className="cursor-pointer font-bold">
              {
                categories.find((t) => t.category_name === typeId)
                  ?.category_name
              }
            </p>
          ))}
      </div>
      <div className="grid grid-cols-4 mt-[15px]">
        {Object.entries(categoryPercentages)
          .filter(([, percent]) => percent > 0)
          .map(([typeId], index) => (
            <div
              key={typeId}
              className="h-[30px] w-[30px] "
              style={{ backgroundColor: COLORS[index] }}
            ></div>
          ))}
      </div>
    </div>
  );
};

export default PieCategory;
