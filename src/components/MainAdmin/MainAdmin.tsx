import { db } from "@/firebase";
import { Card } from "antd";
import { format } from "date-fns";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { FaEllipsisV, FaRegCalendarMinus } from "react-icons/fa";
import { ImSpinner11 } from "react-icons/im";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PieComponent from "../PieComponent/PieComponent";
import PieCategory from "../PieComponent/PieCategory";

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
function MainAdmin() {
  const [loading, setLoading] = useState(true);
  const [earningsData, setEarningsData] = useState({
    total: "0",
    yearly: "0",
    monthly: "0",
    daily: "0",
  });
  const [order, setOrder] = useState<DataType[]>([]);
  const fetchOrder = async () => {
    setLoading(true);
    try {
      const dbRef = ref(db, "OrderDetails");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const orders = Object.keys(data).map((key) => {
          return Object.assign({ key: key }, data[key]) as DataType;
        });

        setOrder(orders);
      } else throw new Error("No customer found!");
    } catch (error) {
      console.error("Error fetching customer: ", error);
    } finally {
      setLoading(false); // Kết thúc tải dữ liệu, đặt isLoading thành false
    }
  };
  useEffect(() => {
    fetchOrder();
  }, []);

  useEffect(() => {
    if (order.length > 0) {
      let total = 0;
      let yearly = 0;
      let monthly = 0;
      let daily = 0;

      order.forEach((item) => {
        total += Number(item?.totalPrice);

        // Tính toán theo năm
        const orderDate = new Date(item.currentTime);
        const currentYear = orderDate.getFullYear();
        yearly +=
          currentYear === new Date().getFullYear()
            ? Number(item.totalPrice)
            : 0;

        // Tính toán theo tháng
        const currentMonth = orderDate.getMonth() + 1;
        monthly +=
          currentMonth === new Date().getMonth() + 1
            ? Number(item.totalPrice)
            : 0;

        // Tính toán theo ngày
        const currentDay = orderDate.getDate();
        daily +=
          currentDay === new Date().getDate() ? Number(item.totalPrice) : 0;
      });

      setEarningsData({
        total: total.toLocaleString(),
        yearly: yearly.toLocaleString(),
        monthly: monthly.toLocaleString(),
        daily: daily.toLocaleString(),
      });
    }
  }, [order]);
  // console.log(order);

  const [displayMode, setDisplayMode] = useState("monthly");
  const generateData = () => {
    if (displayMode === "monthly") {
      return generateMonthlyData();
    } else {
      return generateWeeklyData();
    }
  };
  const generateMonthlyData = () => {
    const monthlyData = Array.from({ length: 12 }, (_, index) => {
      const monthIndex = index + 1;
      const monthlyOrders = order.filter(
        (item) => new Date(item.currentTime).getMonth() + 1 === monthIndex
      );
      const totalPrice = monthlyOrders.reduce(
        (acc, item) => acc + Number(item.totalPrice),
        0
      );
      return { name: `${monthIndex}`, totalPrice };
    });
    return monthlyData;
  };
  const generateWeeklyData = () => {
    const weekdays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const weeklyData = weekdays.map((weekday, index) => {
      const dayIndex = index + 1;
      const weeklyOrders = order.filter(
        (item) => new Date(item.currentTime).getDay() + 1 === dayIndex
      );
      const totalPrice = weeklyOrders.reduce(
        (acc, item) => acc + Number(item.totalPrice),
        0
      );
      return { name: weekday, totalPrice };
    });
    return weeklyData;
  };
  // console.log(order);

  return (
    <div className="px-[25px] pt-[25px] bg-[#F8F9FC] pb-[40px]">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] leading-[34px] font-normal text-[#5a5c69] cursor-pointer">
          Dashboard
        </h1>
        <div className="flex gap-2">
          <button
            className="group hidden w-fit xl:flex items-center gap-2 font-heading font-semibold
                  text-header text-sm"
            onClick={() => fetchOrder()}
          >
            Data Refresh
            <ImSpinner11 />
          </button>
          <div
            className="h-11 bg-[#f9f9f9] flex items-center justify-center rounded-md px-9 font-heading font-bold
              text-header text-sm border-solid border-[1px] lg:w-[310px]"
          >
            {format(new Date(), "MMMM d, yyyy hh:mm:ss")}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-[30px] mt-[25px] pb-[15px]">
        <Card
          className=" h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#4E73DF] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out"
          loading={loading}
        >
          <div>
            <h2 className="text-[#B589DF] text-[11px] leading-[17px] font-bold">
              EARNINGS (MONTHLY)
            </h2>
            <h1 className="text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]">
              {earningsData.monthly} đ
            </h1>
          </div>
          <FaRegCalendarMinus fontSize={28} color="" />
        </Card>
        <Card
          className=" h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#1CC88A] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out"
          loading={loading}
        >
          <div>
            <h2 className="text-[#1cc88a] text-[11px] leading-[17px] font-bold">
              EARNINGS (ANNUAL)
            </h2>
            <h1 className="text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]">
              {earningsData.yearly} đ
            </h1>
          </div>
          <FaRegCalendarMinus fontSize={28} />
        </Card>
        <Card
          className=" h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#36B9CC] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out"
          loading={loading}
        >
          <div>
            <h2 className="text-[#1cc88a] text-[11px] leading-[17px] font-bold">
              EARNINGS (DAILY)
            </h2>
            <h1 className="text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]">
              {earningsData.daily} đ
            </h1>
          </div>
          <FaRegCalendarMinus fontSize={28} />
        </Card>
        <Card
          className=" h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#F6C23E] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out"
          loading={loading}
        >
          <div>
            <h2 className="text-[#1cc88a] text-[11px] leading-[17px] font-bold">
              TOTAL
            </h2>
            <h1 className="text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]">
              {earningsData.total} đ
            </h1>
          </div>
          <FaRegCalendarMinus fontSize={28} />
        </Card>
      </div>
      <div className="flex mt-[22px] w-full gap-[30px]">
        <div className=" border bg-white shadow-md cursor-pointer rounded-[4px]">
          <div className="bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED] mb-[20px]">
            <h2 className="text-[#4e73df] text-[16px] leading-[19px] font-bold">
              Earnings Overview
            </h2>
            <FaEllipsisV color="gray" className="cursor-pointer" />
          </div>
          <div>
            <label className="mr-2">
              <input
                type="radio"
                name="displayMode"
                value="monthly"
                checked={displayMode === "monthly"}
                onChange={() => setDisplayMode("monthly")}
              />
              Theo tháng
            </label>
            <label>
              <input
                type="radio"
                name="displayMode"
                value="weekly"
                checked={displayMode === "weekly"}
                onChange={() => setDisplayMode("weekly")}
              />
              Theo tuần
            </label>
          </div>
          <div className="w-full">
            {/* <canvas id="myAreaChart"></canvas> */}
            {/* <Line options={options} data={data} /> */}
            <LineChart
              width={1620}
              height={500}
              data={generateData()}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                name="Total Price"
                dataKey="totalPrice"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </div>
        </div>
      </div>
      <div className="border bg-white shadow-md cursor-pointer rounded-[4px] py-5">
        <div className="bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED]">
          <h2 className="text-[#4e73df] text-[16px] leading-[19px] font-bold">
            Revenue Resources
          </h2>
          <FaEllipsisV color="gray" className="cursor-pointer" />
        </div>
        {order.length > 0 ? (
          <div className="pl-[35px]">
            <PieComponent order={order} />
            <PieCategory order={order} />
          </div>
        ) : null}
      </div>
      {/* <div className="flex mt-[22px] w-full gap-[30px]">
        <div className="basis-[55%] border bg-white shadow-md cursor-pointer rounded-[4px]">
          <div className="bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED]">
            <h2 className="text-[#4e73df] text-[16px] leading-[19px] font-bold">
              Projects Overview
            </h2>
            <FaEllipsisV color="gray" className="cursor-pointer" />
          </div>
          <div className="px-[25px] space-y-[15px] py-[15px]">
            <div>
              <h2>Server Migration</h2>
              <Progress percent={30} strokeColor="#E74A3B" />
            </div>
            <div>
              <h2>Sales Tracking</h2>
              <Progress percent={50} status="active" strokeColor="#F6C23E" />
            </div>
            <div>
              <h2>Customer Database</h2>
              <Progress percent={70} status="active" strokeColor="#4E73DF" />
            </div>
            <div>
              <h2>Payout Details</h2>
              <Progress percent={100} strokeColor="#36B9CC" />
            </div>
            <div>
              <h2>Account Setup</h2>
              <Progress percent={50} status="exception" strokeColor="#1CC88A" />
            </div>
          </div>
        </div>
        <div className="basis-[45%] border bg-white shadow-md cursor-pointer rounded-[4px]">
          <div className="bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED]">
            <h2 className="text-[#4e73df] text-[16px] leading-[19px] font-bold">
              {" "}
              Resources
            </h2>
            <FaEllipsisV color="gray" className="cursor-pointer" />
          </div>
          <div className="pl-[35px] flex items-center justify-center h-[100%]">
            <div>
              <img
                src="images/error.png"
                alt=""
                className="transform scale-[135%]"
              />
              <p className="mt-[15px] text-semibold text-gray-500">
                No data available
              </p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default MainAdmin;
