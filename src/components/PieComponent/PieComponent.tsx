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

interface TypeOfDish {
  typeOfDishName: string;
  image: string;
}
interface PieComponentProps {
  order: DataType[];
}

const COLORS = ["#0088FE", "#0de0ba", "#FFBB28", "#FF8042"];

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
const PieComponent = ({ order }: PieComponentProps) => {
  const [product, setProduct] = useState<Menu[]>([]);
  const [type, setType] = useState<TypeOfDish[]>([]);

  const fetchFood = async () => {
    const foodNamesFromOrder : string[] = order
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
      const matchedProducts = products.filter(f => 
        foodNamesFromOrder.includes(f.foodName)
      );
      setProduct(matchedProducts);
    } catch (error) {
      console.error("Error fetching foods: ", error);
    }
  };

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


  const countProductsByType = () => {
    const typeOfDishCount: { [key: string]: number } = {};
    order.forEach((item) => {
      item.foodNames.forEach((foodName) => {
        const matchedProduct = product.find((p) => p.foodName === foodName);
        if (matchedProduct) {
          const typeOfDishId = matchedProduct.typeOfDishId;
          typeOfDishCount[typeOfDishId] =
            (typeOfDishCount[typeOfDishId] || 0) + 1;
        }
      });
    });
   
    
    return typeOfDishCount;
  };

  const calculateTypePercentages = (typeOfDishCount: {
    [key: string]: number;
  }) => {
    const totalProducts = Object.values(typeOfDishCount).reduce(
      (sum, count) => sum + count,
      0
    );

    const typePercentages: { [key: string]: number } = {};

    // Sắp xếp các loại món ăn từ cao đến thấp
    const sortedTypeOfDishCount = Object.entries(typeOfDishCount).sort(
      ([, countA], [, countB]) => countB - countA
    );
     console.log(sortedTypeOfDishCount);

    sortedTypeOfDishCount.forEach(([typeId, count], index) => {
      typePercentages[typeId] = (count / totalProducts) * 100;
    });
  
    return typePercentages;
  };
  const typeOfDishCount = countProductsByType();
  // console.log(typeOfDishCount);

  const typePercentages = calculateTypePercentages(typeOfDishCount);

  useEffect(() => {
    fetchType();
    fetchFood();
  }, [db]);
console.log(typePercentages);

// {a: '1', b:'2', c: '3'}
// result : [{a : '1'}]

  return (
    <div>
      <PieChart width={400} height={400}>
        <Pie
          data={Object.entries(typePercentages).map(([typeId, percent]) => ({
            name: typeId,
            value: percent,
          }))}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {Object.keys(typePercentages).map((typeId, index) => (
            <Cell key={typeId} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
      <div className="grid grid-cols-4">
        {Object.entries(typePercentages)
          .filter(([, percent]) => percent > 0)
          .map(([typeId], index) => (
            <p key={`type-${index}`} className="cursor-pointer font-bold">
              {type.find((t) => t.typeOfDishName === typeId)?.typeOfDishName}
            </p>
          ))}
      </div>
      <div className="grid grid-cols-4 mt-[15px]">
        {Object.entries(typePercentages)
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

export default PieComponent;
