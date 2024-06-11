import { SITE_MAP } from "@/constants/site-map";
import { auth, db } from "@/firebase";
import { RootStatesType } from "@/stores";
import { get, onValue, ref, remove, update } from "firebase/database";
import { useEffect, useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
  foodDiscount: string;
  inStock: boolean;
  foodQuantity?: number;
  createAt?: "";
  startAt?: "";
  endAt?: "";
}
function ShowCart() {
  const [cartItems, setCartItems] = useState<DataType[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const userStore = useSelector((state: RootStatesType) => state.user);
  const increaseQuantity = async (key: string) => {
    const cartItemsRef = ref(db, `customer/${userStore.uid}/CartItems`);
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
  };

  const decreaseQuantity = async (key: string) => {
    const cartItemsRef = ref(db, `customer/${userStore.uid}/CartItems`);
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
  };
  const fetchCartData = async () => {
    const cartItemsRef = ref(db, `customer/${userStore.uid}/CartItems`);
    const unsubscribe = onValue(cartItemsRef, (snapshot) => {
      const cartItemTemp: DataType[] = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        cartItemTemp.push(data);
      });
      setCartItems(cartItemTemp);
      //total item

      // Tính tổng giá trị của tất cả các sản phẩm
      const total = cartItemTemp.reduce((acc, item) => {
        const discountedPrice =
          (Number(item.foodPrice) * (100 - (Number(item.foodDiscount) || 0))) / 100;
        return acc + discountedPrice;
      }, 0);
      setTotalPrice(total);
    });
    return () => unsubscribe();
  };
  useEffect(() => {
    fetchCartData();
  }, [db]);
  const slicedCartItems = cartItems.slice(0, 3);
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
    <div>
      <div>
        <div>
          <div className="bg-[#123829] p-5 flex justify-between">
            <h2 className="font-bold text-white">MY CART</h2>
            <p className="font-bold text-white">{cartItems.length} ITEM</p>
          </div>
          <div className="bg-[#fff] min-h-[848px] w-[100%]  border-solid border-t-[1px] border-[#cfcfcf] flex flex-col gap-5">
            {slicedCartItems.map((item, i) => (
              <div
                key={i}
                className="flex flex-row items-center justify-between p-[10px] m-[15px]  border-solid border-[1px] border-[#cfcfcf]"
              >
                <img
                  src={item.foodImage}
                  alt="hình sản phẩm"
                  className="w-[140px]  rounded-[10px]"
                />

                <div className="flex flex-col gap-1 items-center">
                  <p className="text-[18px] text-[#123829] font-medium">
                    {item.foodName}
                  </p>
                  <div className="w-[70px] flex justify-center items-center border-solid border-[1px] border-[#cfcfcf]">
                    <div
                      className=" w-[26px] h-[28px]  flex justify-center items-center hover:bg-red-500 hover:text-white hover:cursor-pointer "
                      onClick={() => decreaseQuantity(item.key.toString())}
                    >
                      -
                    </div>
                    <div className="px-2 ">{item?.foodQuantity}</div>
                    <div
                      className=" w-[26px] h-[28px]  flex justify-center items-center hover:bg-red-500 hover:text-white hover:cursor-pointer  "
                      onClick={() => increaseQuantity(item.key.toString())}
                    >
                      +
                    </div>
                  </div>
                  <p className="text-[20px] text-[#123829] font-light">
                    {(Number(item.foodPrice) *
                      (100 - (Number(item.foodDiscount) || 0))) /
                      100}
                    đ
                  </p>
                </div>
                <div className="flex flex-col justify-end cursor-pointer hover:text-red-500">
                  <IoTrashOutline
                    size={20}
                    onClick={() => removeCartItem(item.key.toString())}
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-center">
              <div className="h-[1px] w-[80%]  bg-[#c3bdbd]"></div>
            </div>
            <div className="flex items-center gap-3">
              <svg
                version="1.1"
                id="svg1047"
                width="30"
                viewBox="0 0 682.66669 682.66669"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-3"
              >
                <defs id="defs1051">
                  <clipPath clipPathUnits="userSpaceOnUse" id="clipPath1061">
                    <path d="M 0,512 H 512 V 0 H 0 Z" id="path1059" />
                  </clipPath>
                </defs>
                <g
                  id="g1053"
                  transform="matrix(1.3333333,0,0,-1.3333333,0,682.66667)"
                >
                  <g id="g1055">
                    <g id="g1057" clipPath="url(#clipPath1061)">
                      <g id="g1063" transform="translate(467,391)">
                        <path
                          d="M 0,0 C 16.568,0 30,-13.431 30,-30 V -90 H 15 c -24.853,0 -45,-20.147 -45,-45 0,-24.853 20.147,-45 45,-45 h 15 c 0,0 -33.137,0 0,0 v -60 c 0,-16.568 -13.432,-30 -30,-30 h -422 c -16.568,0 -30,13.432 -30,30 v 60 c 33.137,0 0,0 0,0 h 15 c 24.853,0 45,20.147 45,45 0,24.853 -20.147,45 -45,45 h -15 v 60 c 0,16.569 13.432,30 30,30 z"
                          style={{
                            fill: "none",
                            stroke: "#000000",
                            strokeWidth: 30,
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeMiterlimit: 10,
                            strokeDasharray: "none",
                            strokeOpacity: 1,
                          }}
                          id="path1065"
                        />
                      </g>
                      <g id="g1067" transform="translate(286,211)">
                        <path
                          d="M 0,0 C 0,-16.569 13.432,-30 30,-30 46.568,-30 60,-16.569 60,0 60,16.569 46.568,30 30,30 13.432,30 0,16.569 0,0 Z"
                          style={{
                            fill: "none",
                            stroke: "#000000",
                            strokeWidth: 30,
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeMiterlimit: 10,
                            strokeDasharray: "none",
                            strokeOpacity: 1,
                          }}
                          id="path1069"
                        />
                      </g>
                      <g id="g1071" transform="translate(166,301)">
                        <path
                          d="M 0,0 C 0,-16.569 13.432,-30 30,-30 46.568,-30 60,-16.569 60,0 60,16.569 46.568,30 30,30 13.432,30 0,16.569 0,0 Z"
                          style={{
                            fill: "none",
                            stroke: "#000000",
                            strokeWidth: 30,
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeMiterlimit: 10,
                            strokeDasharray: "none",
                            strokeOpacity: 1,
                          }}
                          id="path1073"
                        />
                      </g>
                      <g id="g1075" transform="translate(316,331)">
                        <path
                          d="M 0,0 -120,-150"
                          style={{
                            fill: "none",
                            stroke: "#000000",
                            strokeWidth: 30,
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeMiterlimit: 10,
                            strokeDasharray: "none",
                            strokeOpacity: 1,
                          }}
                          id="path1077"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <p className="font-semibold">Add discount code</p>
            </div>
            <div className="flex justify-between px-[10px]">
              <input
                type="text"
                placeholder="Apply promotion code"
                className="w-[285px] h-[42px] px-2 text-[20px]  border border-stone-400"
              />
              <button className="h-[42px] w-[122px]  rounded-none bg-[#123829] hover:bg-[#E85353] flex justify-center items-center text-white  text-[18px] ">
                APPLY
              </button>
            </div>

            {/* Hiển thị khi apply không đúng code */}
            <div className="text-xl text-red-500 font-bold px-[10px] hidden">
              Code not avaiable
            </div>
            {/*  */}
            <div className="flex justify-center">
              <div className="h-[1px] w-[80%] my-3 bg-[#c3bdbd]"></div>
            </div>
            <div className="flex justify-between font-bold text-[#123829] px-[10px]">
              <p className="text-[25px] ">Total</p>
              <p className="text-[25px] ">{totalPrice} đ</p>
            </div>
            <button className="bg-[#123829] mx-[10px] rounded-[30px] hover:bg-[#E85353]  hover:border-[#E85353]">
              <Link
                to={SITE_MAP.CHECKOUT.url}
                className="text-[#fff1d8] font-semibold hover:text-white"
              >
                Proceed to Checkout
              </Link>
            </button>
            <Link to={SITE_MAP.CART.url} className="flex gap-2 justify-center">
              View Cart <FaLongArrowAltRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowCart;
