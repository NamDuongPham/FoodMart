import { db } from "@/firebase";
import { RootStatesType } from "@/stores";
import { Button, Form, Modal, Result, Select, notification } from "antd";
import { get, push, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { SITE_MAP } from "../../constants/site-map";
import { useTitle } from "../../hooks/useTitle";
import createMomoPayment from "./momo";
interface DataType {
  key: React.Key;
  foodName: string;
  foodDescription: string;
  foodImage: string;
  foodIngredient: string;
  foodPrice: string;
  category: string;
  typeOfDish: string;
  foodDiscount: string;
  foodQuantity?: number;
}
interface Customer {
  addressCustomer: string;
  emailCustomer: string;
  nameCustomer: string;
  phoneNumberCustomer: string;
}
function Checkout() {
  useTitle(SITE_MAP.CHECKOUT.title);
  const navigate = useNavigate();
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cartItems, setCartItems] = useState<DataType[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userStore = useSelector((state: RootStatesType) => state.user);
  const fetchCartData = async () => {
    if (userStore.token) {
      const cartRef = ref(db, `customer/${userStore?.uid}/CartItems`);
      const snapshot = await get(cartRef);
      if (snapshot.exists()) {
        const cartData = snapshot.val();
        const cartArray = Object.keys(cartData).map((key) => {
          return Object.assign({ key: key }, cartData[key]) as DataType;
        });

        setCartItems(cartArray);
        // Tính tổng giá trị của tất cả các sản phẩm
        const total = cartArray.reduce((acc, item) => {
          const discountedPrice =
            (Number(item.foodPrice) * (100 - Number(item.foodDiscount))) / 100;
          return acc + discountedPrice;
        }, 0);
        setTotalPrice(total);
      }
    } else {
      notification.info({
        message: "Người dùng chưa đăng nhập, không thể thêm vào giỏ hàng.",
      });
    }
  };
  const [customerData, setCustomerData] = useState<Customer>({
    addressCustomer: "",
    emailCustomer: "",
    nameCustomer: "",
    phoneNumberCustomer: "",
  });
  const fetchCustomerData = async () => {
    try {
      const customerRef = ref(db, `customer/${userStore?.uid}`);
      const snapshot = await get(customerRef);
      if (snapshot.exists()) {
        setCustomerData(snapshot.val());
        // console.log(customerData);
      } else {
        throw new Error("No customer data found!");
      }
    } catch (error) {
      console.error("Error fetching customer data: ", error);
    }
  };
  useEffect(() => {
    fetchCartData();
    fetchCustomerData();
  }, [userStore.token]);

  const handlePayment = async () => {
    try {
      if (paymentMethod === "COD") {
        const newOrderRef = await push(ref(db, "OrderDetails"));
        const itemPushKey = newOrderRef.key;
        const data = {
          address: customerData?.addressCustomer,
          currentTime: Date.now(),
          customerId: userStore?.uid,
          customerName: customerData?.nameCustomer,
          deliveryStatus: "Pending",
          foodImage: cartItems.map((item) => item.foodImage),
          foodNames: cartItems.map((item) => item.foodName),
          foodPrices: cartItems.map((item) => item.foodPrice),
          foodQuantities: cartItems.map((item) => item.foodQuantity),
          itemPushKey: itemPushKey,
          note: note,
          orderAccepted: false,
          paymentReceived: false,
          paymentStatus: "COD",
          phoneNumber: customerData?.phoneNumberCustomer,
          totalPrice: totalPrice,
        };
        await set(newOrderRef, data);
        // Xóa các sản phẩm đã thanh toán khỏi CartItems
        const cartItemsRef = ref(db, `customer/${userStore?.uid}/CartItems`);
        const cartSnapshot = await get(cartItemsRef);
        if (cartSnapshot.exists()) {
          const cartData = cartSnapshot.val();
          const cartKeys = Object.keys(cartData);
          for (const key of cartKeys) {
            await remove(
              ref(db, `customer/${userStore?.uid}/CartItems/${key}`)
            );
          }
        }
        // Kiểm tra xem BuyHistory đã tồn tại hay chưa
        // Lưu dữ liệu vào BuyHistory
        const buyHistoryRef = ref(
          db,
          `customer/${userStore?.uid}/BuyHistory/${itemPushKey}`
        );
        await set(buyHistoryRef, data);
        setShowModal(true); // Hiển thị modal sau khi đặt hàng thành công
        setIsModalOpen(true);
      } else {
        const newOrderRef = await push(ref(db, "OrderDetails"));
        const itemPushKey = newOrderRef.key;
        const amount = totalPrice; // Số tiền thanh toán (VND)
        const orderInfo = "Thanh toán đơn hàng Foodmart"; // Thông tin đơn hàng
        const returnUrl = "http://localhost:3000/";
        const notifyUrl = "http://localhost:3000/";
        try {
          const paymentResponse = await createMomoPayment(
            amount,
            orderInfo,
            returnUrl,
            notifyUrl
          );
          if (paymentResponse && paymentResponse.payUrl) {
            window.location.href = paymentResponse.payUrl;
            const data = {
              address: customerData?.addressCustomer,
              currentTime: Date.now(),
              customerId: userStore?.uid,
              customerName: customerData?.nameCustomer,
              deliveryStatus: "Pending",
              foodImage: cartItems.map((item) => item.foodImage),
              foodNames: cartItems.map((item) => item.foodName),
              foodPrices: cartItems.map((item) => item.foodPrice),
              foodQuantities: cartItems.map((item) => item.foodQuantity),
              itemPushKey: itemPushKey,
              note: note,
              orderAccepted: false,
              paymentReceived: false,
              paymentStatus: "MOMO",
              phoneNumber: customerData?.phoneNumberCustomer,
              totalPrice: totalPrice,
            };
            await set(newOrderRef, data);
            // Xóa các sản phẩm đã thanh toán khỏi CartItems
            const cartItemsRef = ref(
              db,
              `customer/${userStore?.uid}/CartItems`
            );
            const cartSnapshot = await get(cartItemsRef);
            if (cartSnapshot.exists()) {
              const cartData = cartSnapshot.val();
              const cartKeys = Object.keys(cartData);
              for (const key of cartKeys) {
                await remove(
                  ref(db, `customer/${userStore?.uid}/CartItems/${key}`)
                );
              }
            }
            // Kiểm tra xem BuyHistory đã tồn tại hay chưa
            // Lưu dữ liệu vào BuyHistory
            const buyHistoryRef = ref(
              db,
              `customer/${userStore?.uid}/BuyHistory/${itemPushKey}`
            );
            await set(buyHistoryRef, data);
          } else {
            console.error("Payment creation failed:", paymentResponse);
          }
        } catch (error) {
          console.error("Payment error:", error);
        }
      }
    } catch (error) {
      console.error("Error placing order: ", error);
    }
  };

  return (
    <div className="container mx-auto mt-10 h-[1000px]">
      <div className="ml-[183.5px]">
        <h1 className="text-[30px] text-[#E85353] font-semibold">CHECKOUT</h1>
        <p
          className="text-[20px] text-[#007bff] hover:text-red-500 hover:cursor-pointer"
          onClick={() => {
            navigate(SITE_MAP.SHOP.url);
          }}
        >
          Back to shop
        </p>
        <div className="flex justify-between">
          <div className="basis-2/3 ">
            <div>
              <input
                type="email"
                name=""
                id=""
                defaultValue={customerData?.emailCustomer}
                placeholder="Email"
                className="text-[#000000] rounded-[5px] px-2 mt-[14px] w-[80%] h-[42px] border border-[#d9d9d9]
              transition ease-in-out duration-500 focus:border-blue-500 focus:scale-105"
              />
            </div>
            <div>
              <input
                type="text"
                name=""
                id=""
                value={customerData?.nameCustomer}
                placeholder="Full name"
                className="text-[#000000] rounded-[5px] px-2 mt-[14px] w-[80%] h-[42px] border border-[#d9d9d9] transition ease-in-out duration-500 focus:border-blue-500 focus:scale-105"
              />
            </div>
            <div>
              <input
                type="text"
                name=""
                id=""
                value={customerData?.phoneNumberCustomer}
                placeholder="Phone number"
                className="text-[#000000] rounded-[5px] px-2 mt-[14px] w-[80%] h-[42px] border border-[#d9d9d9] transition ease-in-out duration-500 focus:border-blue-500 focus:scale-105"
              />
            </div>
            <div>
              <input
                type="text"
                name=""
                id=""
                value={customerData?.addressCustomer}
                placeholder="Address"
                className="text-[#000000] rounded-[5px] px-2 mt-[14px] w-[80%] h-[42px] border border-[#d9d9d9] transition ease-in-out duration-500 focus:border-blue-500 focus:scale-105"
              />
            </div>

            <div>
              <input
                type="text"
                name=""
                id=""
                placeholder="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="text-[#000000] rounded-[5px] px-2 mt-[14px] w-[80%] h-[42px] border border-[#d9d9d9] transition ease-in-out duration-500 focus:border-blue-500 focus:scale-105"
              />
            </div>

            <div>
              <h2 className="text-[30px]">Choose payment method</h2>
            </div>
            <div className="w-[80%]">
              <div
                className="flex flex-row items-center justify-between text-lg mt-4 p-3"
                style={{ border: "1px solid black", borderRadius: "12px" }}
              >
                <div className="my-5">
                  <p className="font-semibold">Pay later in cash (COD)</p>
                  <p className="mt-4">
                    Pay the full amount after completing the trip and it's done.
                  </p>
                </div>
                <div className="w-[40px] h-[30px]">
                  <input
                    className="bg-white w-full h-full"
                    style={{ borderWidth: "7px", borderColor: "black" }}
                    type="radio"
                    onChange={() => setPaymentMethod("COD")} // Khi chọn "Tiền mặt"
                    checked={paymentMethod === "COD"}
                  />
                </div>
              </div>
              <div
                className="flex flex-row items-center justify-between text-lg mt-4 p-3"
                style={{ border: "1px solid black", borderRadius: "12px" }}
              >
                <div className="my-5">
                  <p className="font-semibold">Pay later by bank card</p>
                  <p className="mt-4">Pay the full amount by bank card.</p>
                </div>
                <div className="w-[40px] h-[30px]">
                  <input
                    className="bg-white w-full h-full"
                    style={{ borderWidth: "7px", borderColor: "black" }}
                    type="radio"
                    onChange={() => setPaymentMethod("bank")} // Khi chọn "Thẻ ngân hàng"
                    checked={paymentMethod === "bank"}
                  />
                </div>
              </div>
            </div>
            {paymentMethod === "bank" && (
              <div className="mt-4 w-[80%]">
                <h2 className="mb-4">Choose bank or visa card</h2>
                <Form.Item>
                  <Select placeholder="MOMO or ZALOPAY">
                    <Select.Option value="TPBANK">MOMO</Select.Option>
                    <Select.Option value="PAYPAL">ZALOPAY</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            )}

            <div className="flex justify-between items-center  mt-3">
              <button
                className="h-[42px] w-[80%] bg-[#E85353] text-white text-[20px] "
                onClick={() => handlePayment()}
              >
                PAY NOW
              </button>
            </div>
          </div>
          {/* ---- */}
          <div className="basis-1/3 sticky top-5 rounded-[24px]  min-h-[300px] bg-[#fff] border-solid border-[1px] border-[#cfcfcf] flex flex-col gap-5">
            {cartItems.map((item) => (
              <div>
                <div className="flex flex-row items-center justify-between px-[10px]">
                  <img
                    src={item.foodImage}
                    alt="hình sản phẩm"
                    className="w-[120px]  rounded-[10px]"
                  />

                  <div className="flex flex-col items-center justify-center gap-3">
                    <p className="relative top-0 right-[120px] bg-[#666] px-3 py-2 text-white rounded-full w-[33px]">
                      {item.foodQuantity}
                    </p>
                    <p className="text-[18px] w-[200px] text-[#123829] relative bottom-3 font-medium">
                      {item.foodName}
                    </p>
                    <p className="text-[15px] text-[#123829] relative bottom-3 font-light">
                      {item.category}
                    </p>
                  </div>

                  <p className="text-[20px] ml-5 text-[#123829] font-light">
                    {(Number(item.foodPrice) *
                      (100 - Number(item.foodDiscount))) /
                      100}
                    đ
                  </p>
                </div>
              </div>
            ))}

            <div className="flex justify-center">
              <div className="h-[1px] w-[80%] my-3 bg-[#c3bdbd]"></div>
            </div>
            <div className="flex justify-between px-[10px]">
              <input
                type="text"
                placeholder="Apply promotion code"
                className="w-[285px] h-[42px] px-2 text-[20px] rounded-[5px] border border-stone-400"
              />
              <button className="h-[42px] w-[122px]   bg-[#357edb] flex justify-center items-center text-white  text-[18px] ">
                APPLY
              </button>
            </div>
            <div className="flex justify-between mt-5 px-[10px]">
              <p className="text-[23px]">Total</p>
              <p className="text-[25px] text-[#123829] font-semibold">
                {totalPrice} đ
              </p>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal open={isModalOpen} footer={null}>
          <Result
            status="success"
            title="Order Success"
            subTitle="You can check your order in account page"
            extra={[
              <Button
                className="bg-[#E85353] hover:border-none"
                type="primary"
                key="console"
              >
                <Link
                  className="text-white outline-none"
                  to={SITE_MAP.HOME.url}
                >
                  Go Home
                </Link>
              </Button>,
            ]}
          />
        </Modal>
      )}
    </div>
  );
}

export default Checkout;
