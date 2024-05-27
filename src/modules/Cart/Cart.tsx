import { useEffect, useState } from "react";
import { useTitle } from "../../hooks/useTitle";
import { MdOutlineDelete } from "react-icons/md";
import { auth, db } from "@/firebase";
import { get, ref, remove, update } from "firebase/database";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootStatesType } from "@/stores";
import { notification } from "antd";
interface DataType {
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
  foodQuantity?: number;
  createAt?: "";
  startAt?: "";
  endAt?: "";
}
function Cart() {
  useTitle("Giỏ hàng");
  const [cartItems, setCartItems] = useState<DataType[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const increaseQuantity = async (key: string) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const cartItemsRef = ref(db, `customer/${currentUser.uid}/CartItems`);
      const cartItemsSnapshot = await get(cartItemsRef);
      const currentCartItems = cartItemsSnapshot.val();
      const existingCartItem = currentCartItems[key];
      if (existingCartItem) {
        const updatedCartItem = {
          ...existingCartItem,
          foodQuantity: existingCartItem.foodQuantity + 1,
        };
        const updatedCartItems = {
          ...currentCartItems,
          [key]: updatedCartItem,
        };
        await update(cartItemsRef, updatedCartItems);
        // Cập nhật lại cartItems sau khi cập nhật Firebase
        const updatedCartArray = Object.keys(updatedCartItems).map((key) => {
          return Object.assign({ key: key }, updatedCartItems[key]) as DataType;
        });
        setCartItems(updatedCartArray);
      }
    }
  };

  const decreaseQuantity = async (key: string) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const cartItemsRef = ref(db, `customer/${currentUser.uid}/CartItems`);
      const cartItemsSnapshot = await get(cartItemsRef);
      const currentCartItems = cartItemsSnapshot.val();
      const existingCartItem = currentCartItems[key];
      if (existingCartItem) {
        const updatedQuantity = Math.max(existingCartItem.foodQuantity - 1, 1);
        const updatedCartItem = {
          ...existingCartItem,
          foodQuantity: updatedQuantity,
        };
        const updatedCartItems = {
          ...currentCartItems,
          [key]: updatedCartItem,
        };
        await update(cartItemsRef, updatedCartItems);
        // Cập nhật lại cartItems sau khi cập nhật Firebase
        const updatedCartArray = Object.keys(updatedCartItems).map((key) => {
          return Object.assign({ key: key }, updatedCartItems[key]) as DataType;
        });
        setCartItems(updatedCartArray);
      }
    }
  };
  const userStore = useSelector((state: RootStatesType) => state.user);
  const fetchCartData = async () => {
    const currentUser = auth.currentUser;
    if (userStore.token) {
      const cartRef = ref(db, `customer/${currentUser?.uid}/CartItems`);
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
            (Number(item.foodPrice) * (100 - item.discount)) / 100;
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
  useEffect(() => {
    fetchCartData();
  }, [userStore.token]);

  const removeCartItem = async (key: string) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const cartItemRef = ref(
        db,
        `customer/${currentUser.uid}/CartItems/${key}`
      );
      try {
        await remove(cartItemRef);
        // Cập nhật lại cartItems sau khi xóa trên Firebase
        const cartItemsRef = ref(db, `customer/${currentUser.uid}/CartItems`);
        const cartItemsSnapshot = await get(cartItemsRef);
        const updatedCartItems = cartItemsSnapshot.val() || {};
        const updatedCartArray = Object.keys(updatedCartItems).map((key) => {
          return Object.assign({ key: key }, updatedCartItems[key]) as DataType;
        });
        setCartItems(updatedCartArray);
      } catch (error) {
        console.error("Error removing cart item:", error);
      }
    }
  };
  return (
    <div className="container mx-auto">
      <div>
        <h1 className="text-[35px] mt-[68px] ml-[10px] text-[#E85353] font-semibold">
          Your cart
        </h1>
      </div>
      <div className="mt-5">
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden flex justify-between gap-10">
                <div className="w-[100%]">
                  <table className="w-[100%] text-left text-sm font-light text-surface dark:text-white">
                    <thead className="border-solid border-b-[1px] border-[#cfcfcf]  dark:border-white/10 text-[#E85353] font-bold">
                      <tr>
                        <th scope="col" className="px-6 py-4">
                          IMAGE
                        </th>
                        <th scope="col" className="px-6 py-4">
                          NAME
                        </th>
                        <th scope="col" className="px-6 py-4">
                          PRICE
                        </th>
                        <th scope="col" className="px-6 py-4">
                          QUANTITY
                        </th>
                        <th scope="col" className="px-6 py-4">
                          TOTAL
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr className="border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-600 font-medium border-solid">
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            <img
                              src={item.foodImage}
                              className="w-[100px]"
                              alt="image"
                            />
                          </td>
                          <Link to={`/product/${item?.key}`}>
                            <td className="whitespace-nowrap px-6 ">
                              <div className="relative bottom-8 ">
                                <p>{item.foodName}</p>
                              </div>
                            </td>
                          </Link>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold">
                            <p className="relative bottom-8 ">
                              {(Number(item.foodPrice) *
                                (100 - item.discount)) /
                                100}{" "}
                              đ
                            </p>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 flex items-center">
                            <div
                              className="bg-[#d9d9d9] w-[26px] h-[28px]  flex justify-center items-center hover:bg-red-500 hover:text-white hover:cursor-pointer relative bottom-8"
                              onClick={() =>
                                decreaseQuantity(item.key.toString())
                              }
                            >
                              -
                            </div>
                            <div className="px-2 relative bottom-8">
                              {item.foodQuantity}
                            </div>
                            <div
                              className="bg-[#d9d9d9] w-[26px] h-[28px]  flex justify-center items-center hover:bg-red-500 hover:text-white hover:cursor-pointer  relative bottom-8"
                              onClick={() =>
                                increaseQuantity(item.key.toString())
                              }
                            >
                              +
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center relative bottom-8">
                              <div className="font-bold">
                                {item &&
                                  item.foodQuantity &&
                                  item.foodQuantity *
                                    ((Number(item.foodPrice) *
                                      (100 - item.discount)) /
                                      100)}
                              </div>
                              <MdOutlineDelete
                                color="#E85353 "
                                className="w-[30px] h-[30px] cursor-pointer"
                                onClick={() =>
                                  removeCartItem(item.key.toString())
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col justify-center items-center text-center gap-3 p-3 border border-[1px]-[#123829] border-solid">
                  <p className="text-2xl text-[#123829] font-semibold">Total</p>
                  <p className="text-2xl text-[#123829] font-semibold">
                    {totalPrice} đ
                  </p>
                  <p className="text-[#123829]">
                    Taxes and shipping calculated at checkout
                  </p>
                  <button className="bg-[#123829] text-[#fff1d8] font-semibold rounded-[30px] hover:bg-[#E85353] hover:text-white hover:border-[#E85353]">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
