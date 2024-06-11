import { auth, db } from "@/firebase";
import { Tabs, notification } from "antd";
import { get, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import Info from "../Info/Info";
import Order from "../Order/Order";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { resetUser } from "@/stores/slices/UserSlice";
import { useNavigate } from "react-router-dom";
import { SITE_MAP } from "@/constants/site-map";
interface Customer {
  addressCustomer: string;
  emailCustomer: string;
  nameCustomer: string;
  phoneNumberCustomer: string;
}
function Account() {
  const [customerData, setCustomerData] = useState<Customer>({
    addressCustomer: "",
    emailCustomer: "",
    nameCustomer: "",
    phoneNumberCustomer: ""
  });
  const fetchCustomerData = async () => {
    const currentUser = auth.currentUser;
    try {
      const customerRef = ref(db, `customer/${currentUser?.uid}`);
      const snapshot = await get(customerRef);
      if (snapshot.exists()) {
        setCustomerData(snapshot.val());
      } else {
        throw new Error("No customer data found!");
      }
    } catch (error) {
      console.error("Error fetching customer data: ", error);
    }
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Người dùng đã đăng nhập
        user.getIdToken(true).catch((error) => {
          // Xử lý lỗi xác thực khi người dùng đổi mật khẩu
          console.error("User session expired:", error);
          dispatch(resetUser()); // Đăng xuất người dùng
          notification.info({
            message: "Login session expired",
          });
          navigate(SITE_MAP.HOME.url);
        });
      } else {
        // Người dùng đã đăng xuất
      }
    });

    return unsubscribe;
  }, [dispatch]);
  useEffect(() => {
    fetchCustomerData();
  }, []);
  // console.log(customerData);

  const handleUpdateValue = async (field: string, newValue: string) => {
    const currentUser = auth.currentUser;
    try {
      const userRef = ref(db, `customer/${currentUser?.uid}/${field}`);
      await set(userRef, newValue);
      // Cập nhật state hoặc thực hiện các hành động khác sau khi cập nhật thành công
      fetchCustomerData();
    } catch (error) {
      console.error("Error updating customer: ", error);
      notification.error({
        message: "update erro!",
      });
    }
  };
  return (
    <div className="mx-auto container mt-10 ">
      <Tabs
        className="text-[20px]"
        tabPosition="left"
        items={[
          {
            label: "Info",
            key: "1",
            children: (
              <>
                <Info
                  label="Full name"
                  value={customerData?.nameCustomer}
                  updateValue={(newValue: string) =>
                    handleUpdateValue("nameCustomer", newValue)
                  }
                />

                <Info
                  label="Email"
                  value={customerData?.emailCustomer}
                  updateValue={(newValue: string) =>
                    handleUpdateValue("emailCustomer", newValue)
                  }
                />
                <Info
                  label="Phone"
                  value={customerData?.phoneNumberCustomer}
                  updateValue={(newValue: string) =>
                    handleUpdateValue("phoneNumberCustomer", newValue)
                  }
                />
                <Info
                  label="Address"
                  value={customerData?.addressCustomer}
                  updateValue={(newValue: string) =>
                    handleUpdateValue("addressCustomer", newValue)
                  }
                />
              </>
            ),
          },
          {
            label: "Order",
            key: "2",
            children: <Order />,
          },
          // {
          //   label: "Change Password",
          //   key: "3",
          //   children: <ChangePW />,
          // },
        ]}
      />
    </div>
  );
}

export default Account;
