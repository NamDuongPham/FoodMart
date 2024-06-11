import { db } from "@/firebase";
import { RootStatesType } from "@/stores";
import { resetUser } from "@/stores/slices/UserSlice";
import { Drawer, notification } from "antd";
import { onValue, ref } from "firebase/database";
import { useCallback, useEffect, useState } from "react";
import { BsFillCartFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SITE_MAP } from "../../../../constants/site-map";
import ShowCart from "../../../Cart/ShowCart";
import ModalLogin from "../ModalLogin/ModalLogin";
import ModalRegister from "../ModalRegister/ModalRegister";
import UserItem from "./UserItem";
import logo from "@/assets/images/placeholder.jpg";
import logoUser from "@/assets/images/user.png";
import { resetSearch } from "@/stores/slices/SearchSlice";
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
function Usermenu() {
  const navigate = useNavigate();
  const userStore = useSelector((state: RootStatesType) => state.user);
  const [isOpenRegister, setIsOpenRegister] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenCart, setIsOpenCart] = useState(false);
  const toggleOpen = useCallback(() => {
    setIsOpenMenu((value) => !value);
  }, []);
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(resetUser());
    dispatch(resetSearch());
    notification.success({
      message: "log out success!",
    });
  };
  const handleAccount = () => {
    navigate(SITE_MAP.ACCOUNT.url);
  };
  const [cartItemsCount, setCartItemsCount] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cartItem, setCartItem] = useState<DataType[]>([]);
  // const [isAuth, setIsAuth] = useState<boolean>(false);
  // const currentUser = auth.currentUser;
  // console.log(auth);
  // console.log(cartItem);
  
  useEffect(() => {
    const cartItemsRef = ref(db, `customer/${userStore.uid}/CartItems`);
    const unsubscribe = onValue(cartItemsRef, (snapshot) => {
      const cartItemTemp: DataType[] = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        cartItemTemp.push(data);
      });
      setCartItem(cartItemTemp);
      // as Record<string, DataType>;
      //     setCartItem(Object.values(cartItems));
      const totalQuantity: number = Object.values(cartItemTemp).reduce(
        (total, item) => (total as number) + (item?.foodQuantity as number),
        0
      );
      setCartItemsCount(totalQuantity);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="flex flex-row justify-between items-center gap-[70px]">
        {/* Forsupport */}
        <div>
          <p className="text-[#898989] text-[15px]">For support?</p>
          <a
            className="text-[#222222] font-semibold text-[18px] no-underline"
            href="tel:0707766109"
          >
            +84 070 776 6109
          </a>
        </div>
        {/* Button */}
        <div className="flex flex-row justify-between items-center gap-[23px] cursor-pointer relative">
          <div
            className="bg-[#f1f1f1] rounded-full w-[36px] h-[36px] flex items-center justify-center hover:bg-gray-300 "
            onClick={toggleOpen}
          >
            {userStore.token ? (
              <img
                src={logoUser}
                alt=""
                className="rounded-full"
                height="30"
                width="30"
              />
            ) : (
              <img
                src={logo}
                alt=""
                className="rounded-full"
                height="30"
                width="30"
              />
            )}

            {isOpenMenu && (
              <div className="absolute right-[90px] top-[40px] flex flex-col cursor-pointer">
                <UserItem
                  onClick={() => {
                    if (userStore.token) {
                      logOut();
                    } else {
                      setIsOpen(true);
                      setIsOpenMenu(false);
                    }
                  }}
                  label={userStore.token ? "logout" : "login"}
                />

                <UserItem
                  onClick={() => {
                    if (userStore.token) {
                      handleAccount();
                    } else {
                      setIsOpenRegister(true);
                      setIsOpenMenu(false);
                    }
                  }}
                  label={userStore.token ? "account" : "register"}
                />
              </div>
            )}
            <ModalLogin isOpen={isOpen} setIsOpen={setIsOpen} />
            <ModalRegister
              isOpenRegister={isOpenRegister}
              setIsOpenRegister={setIsOpenRegister}
            />
          </div>

          <div className="relative">
            <div className="bg-[#f1f1f1] rounded-full w-[36px] h-[36px] flex items-center justify-center hover:bg-gray-300">
              <BsFillCartFill
                width={12}
                height={12}
                className="text-[#222222] hover:text-[#DE3151]"
                onClick={() => setIsOpenCart(true)}
              />
            </div>
            <Drawer
              size="large"
              open={isOpenCart}
              onClose={() => setIsOpenCart(false)}
            >
              <ShowCart />
            </Drawer>

            <div className="absolute rounded-full p-3 w-[15px] h-[15px] right-[-0px] top-[-10px] bg-gradient-to-br from-[#E85353] to-[#BE1515] flex justify-center items-center">
              <p className="text-[12px] text-white font-semibold">
                {cartItemsCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Usermenu;
