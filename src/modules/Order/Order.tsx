import { Tabs } from "antd";
import { BsFillBoxFill } from "react-icons/bs";
import { FaShippingFast } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import InfoCancel from "./components/InfoCancel";
import InfoOrder from "./components/InfoOrder";
import InfoShipping from "./components/InfoShipping";
import { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { auth, db } from "@/firebase";
import InfoPending from "./components/InfoPending";
interface DataType {
  key: React.Key;
  customerId: string;
  customerName: string;
  address: string;
  foodImage: [];
  foodNames: [];
  foodPrices: [];
  foodQuantities: [];
  note: string;
  totalPrice: number;
  phoneNumber: number;
  paymentStatus: string;
  deliveryStatus: string;
  currentTime: number;
}
function Order() {
  const [orders, setOrders] = useState<DataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const customerId = auth?.currentUser?.uid
      try {
        const dbRef = ref(db, "OrderDetails");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const orders = Object.keys(data).map((key) => {
            return Object.assign({ key: key }, data[key]) as DataType;
          });
          const ordered = orders.filter((order)=>order.customerId === customerId)
          setOrders(ordered);
        } else {
          throw new Error("No orders found!");
        }
      } catch (error) {
        console.error("Error fetching orders: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);
  // console.log(orders);
  
  const getOrdersByStatus = (status: string) => {
    return orders.filter((order) => order.deliveryStatus === status);
  };

  const getOrderedOrders = () => getOrdersByStatus("Done");

  const getDeliveringOrders = () => getOrdersByStatus("Delivering");
  const getCancelledOrders = () => getOrdersByStatus("Cancel");
  const getPendingOrders = () => getOrdersByStatus("Pending");

  return (
    <div className="w-full">
      <Tabs defaultActiveKey="2" className="text-[25px] w-full">
        <Tabs.TabPane
          tab={
            <span className="text-[20px] flex flex-row gap-3 items-center ">
              Pending
            </span>
          }
          key="4"
        >
          <InfoPending orders={getPendingOrders()} isLoading={isLoading} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span className="text-[20px] flex flex-row gap-3 items-center ">
              <BsFillBoxFill />
              Ordered
            </span>
          }
          key="1"
        >
          <InfoOrder orders={getOrderedOrders()} isLoading={isLoading} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span className="text-[20px] flex flex-row gap-3 items-center ">
              <FaShippingFast />
              Delivering
            </span>
          }
          key="2"
        >
          <InfoShipping orders={getDeliveringOrders()} isLoading={isLoading} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span className="text-[20px] flex flex-row gap-3 items-center ">
              <FcCancel />
              Order canceled
            </span>
          }
          key="3"
        >
          <InfoCancel orders={getCancelledOrders()} isLoading={isLoading} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default Order;
