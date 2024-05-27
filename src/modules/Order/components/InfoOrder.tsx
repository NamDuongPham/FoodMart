import { format } from "date-fns";

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
interface InfoOrderProps {
  orders: DataType[];
  isLoading: boolean;
}
function InfoOrder({ orders, isLoading }: InfoOrderProps) {
  console.log(orders);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <div>
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-md p-5 mt-5 border-solid border-b-[1px] border-[#e0dddd]"
            >
              <div className="border-solid border-[1px] border-[#e0dddd] rounded-md">
                <div className="p-5 flex flex-col gap-5 divide-y divide-solid divide-[#e0dddd]">
                  {order.foodNames.map((foodName, idx) => (
                    <div key={idx} className="flex justify-between py-4">
                      <div className="flex gap-10">
                        <img
                          src={order.foodImage[idx]}
                          alt={`product-order-${idx}`}
                          className="w-[100px] h-[70px] rounded-md"
                        />
                        <div className="flex flex-col items-start justify-center gap-3">
                          <p className="font-bold text-xl">{foodName}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-start justify-center gap-3">
                        <p className="font-bold text-xl">
                          {order.foodPrices[idx]}đ
                        </p>
                        <p className="text-xl">
                          Quantity: {order.foodQuantities[idx]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* INFO MONEY */}
              <div className="mt-5 flex items-start justify-between">
                <div className="text-red-500 text-lg">
                  Date: {format(new Date(order.currentTime), "dd/MM/yyyy HH:mm:ss")}
                </div>
                <div className="flex justify-between gap-2">
                  <p className="text-lg font-bold">Total: </p>
                  <p className="text-lg font-bold"> {order.totalPrice}đ</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InfoOrder;
