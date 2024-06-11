import { auth, db } from "@/firebase";
import Info from "@/modules/Info/Info";
import { resetAdmin } from "@/stores/slices/AdminSlice";
import { Card, notification } from "antd";
import { format } from "date-fns";
import { get, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { CiPhone } from "react-icons/ci";
import { ImSpinner11 } from "react-icons/im";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { SITE_MAP } from "../../constants/site-map";
import { useTitle } from "../../hooks/useTitle";
import { RootStatesType } from "@/stores";
import imageLogo  from "@/assets/images/profile.png"
interface Admin {
  id: React.Key;
  name: string;
  email: string;
  nameOfRestaurant: string;
}
function Profile() {
  const [admin, setAdmin] = useState<Admin[]>([]);
  const adminStore = useSelector((state: RootStatesType) => state.admin);
  const fetchAdmin = async () => {
    try {
      const dbRef = ref(db, "user");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const adminData = snapshot.val();
        const adminArray = Object.entries(adminData).map(([key, value]) => ({
          key,
          ...value,
        }));
        // Tìm người dùng có uid trùng với adminStore.uid
        const foundUser = adminArray.find((user) => user.key === adminStore.id);

        setAdmin(foundUser || null);
      } else throw new Error("No customer found!");
    } catch (error) {
      console.error("Error fetching customer: ", error);
    }
  };
  useEffect(() => {
    fetchAdmin();
  }, []);
  const dispatch = useDispatch();
  const logOut = () => {
    dispatch(resetAdmin());
  };
  useTitle(SITE_MAP.PROFILE.title);

  const handleUpdateValue = async (field: string, newValue: string) => {
    const currentUser = auth.currentUser;
    try {
      if (currentUser) {
        const userRef = ref(db, `user/${currentUser?.uid}/${field}`);
        await set(userRef, newValue);
        // Cập nhật state hoặc thực hiện các hành động khác sau khi cập nhật thành công
        fetchAdmin();
      } else {
        console.error("No user is currently signed in");
      }
    } catch (error) {
      console.error("Error updating customer: ", error);
      notification.error({
        message: "update erro!",
      });
    }
  };
  return (
    <div className="md:!p-[26px]">
      <div
        className="card no-hover flex flex-col gap-5 !p-5 md:!p-[26px] lg:!py-5 lg:flex-row
           lg:items-center lg:gap-4 bg-white  rounded-lg mb-3"
      >
        <h1 className="flex-1 text-center lg:text-left">Profile</h1>
        <button
          className="group hidden w-fit xl:flex items-center gap-2 font-heading font-semibold
                  text-header text-sm"
          onClick={fetchAdmin}
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
      {/*  */}
      <div className="flex justify-between">
        {/* left */}
        <div className="basis-1/3">
          <Card style={{ width: 350 }}>
            <div className="flex flex-col  items-center">
              <img className="w-[110px]" src={imageLogo} alt="" />
              <h2 className="text-[25px] font-bold">{admin?.name}</h2>
              <p className="bg-[#ff5470] px-3 text-white font-bold rounded-md">
                Admin
              </p>
              <button
                className="mt-5 bg-[#035ecf] shadow-lg px-10 rounded-lg text-white font-bold shadow-[#035ecf80]"
                onClick={() => {
                  logOut();
                }}
              >
                Log out
              </button>
            </div>
          </Card>
          <Card style={{ width: 350 }} className="mt-10">
            <a
              className="flex items-center gap-5 text-[20px]"
              onClick={() => {
                window.open("mailto:phamnamduong@gmail.com");
              }}
            >
              <MdOutlineEmail />{" "}
              <span className="text-red-500">{admin?.email}</span>
            </a>
            <a
              className="flex items-center gap-5 text-[20px]"
              onClick={() => {
                window.location.href = `tel:0707766019`;
              }}
            >
              <CiPhone />
              <span className="text-red-500">+84 70766109</span>
            </a>
            <p className="flex items-center gap-5 text-[20px]">
              <IoLocationOutline color="#9ea3ff" />
              <span className="text-red-500">Hutech khu E</span>
            </p>
          </Card>
        </div>
        {/* right */}
        <div className="basis-2/3 flex flex-col gap-7">
          <Info
            label="Full name"
            value={admin?.name}
            updateValue={(newValue: string) =>
              handleUpdateValue("name", newValue)
            }
          />
          {/* <Info label="Mật khẩu" value="0123456" /> */}
          <Info
            label="Email"
            value={admin?.email}
            updateValue={(newValue: string) =>
              handleUpdateValue("email", newValue)
            }
          />
          {/* <Info label="Phone" value="01312312312" />
          <Info label="Address" value="31234901231" /> */}
        </div>
      </div>
    </div>
  );
}

export default Profile;
