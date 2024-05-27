import { db } from "@/firebase";
import { Collapse, Descriptions } from "antd";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
}
function OrderDetailAdmin() {
  const { id } = useParams();

  const [order, setOrder] = useState<DataType[]>([]);
  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      // setIsLoading(true);
      try {
        const dbRef = ref(db, `OrderDetails/${id}`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          setOrder(snapshot.val());
        } else throw new Error("No customer found!");
      } catch (error) {
        console.error("Error fetching customer: ", error);
      } finally {
        // setIsLoading(false); // Kết thúc tải dữ liệu, đặt isLoading thành false
      }
    };
    fetchOrder();
  }, [id]);
  console.log(order);

  return (
    <div className="container mx-auto">
      <div>
        <h1 className="text-[30px]">Order id #{id}</h1>
      </div>

      <>
        <div className="bg-white rounded-md p-5 mt-5">
          <div className="border-solid border-[1px] border-[#e0dddd] rounded-md ">
            <div className=" p-5 flex flex-col gap-5 divide-y divide-solid divide-[#e0dddd]">
              {order?.foodNames?.map((foodName, index) => (
                <div key={index} className="flex justify-between py-4">
                  <div className="flex gap-10">
                    <img
                      src={order.foodImage[index]}
                      alt={`product-order-${index}`}
                      className="w-[100px] h-[70px] rounded-md"
                    />
                    <div className="flex flex-col items-start justify-center gap-3">
                      <p className="font-bold text-xl">{foodName}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-center gap-3">
                    <p className="font-bold text-xl">
                     {order.foodPrices[index]} đ
                    </p>
                    <p className="text-xl">
                      Quantity: {order.foodQuantities[index]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* INFO MONEY */}
          <div className="mt-5 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <p className="font-bold text-lg">Order Note</p>
              <p className="text-lg">{order?.note}</p>
            </div>
            {/*  */}
            <div>
             
              <div className=""></div>
              <div className="flex justify-between gap-3">
                <p className="text-lg font-bold">Total:</p>
                <p className="text-lg font-bold">{order?.totalPrice} đ</p>
              </div>
            </div>
          </div>
        </div>
        {/* INFO USER */}
        <div className="mt-10">
          <Collapse defaultActiveKey={["1"]}>
            <Collapse.Panel
              header="Customer Details"
              key="1"
              className="bg-white text-lg font-semibold"
            >
              <Descriptions
                bordered
                column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
              >
                <Descriptions.Item label="Name" span={3}>
                  {order?.customerName}
                </Descriptions.Item>
                <Descriptions.Item label="Id">
                  {order?.customerId}
                </Descriptions.Item>
                <Descriptions.Item label="Mobile">
                  {order?.phoneNumber}
                </Descriptions.Item>

                <Descriptions.Item label="Address" span={2}>
                  {order?.address}
                </Descriptions.Item>
              </Descriptions>
            </Collapse.Panel>
          </Collapse>
        </div>
      </>
    </div>
  );
}

export default OrderDetailAdmin;
