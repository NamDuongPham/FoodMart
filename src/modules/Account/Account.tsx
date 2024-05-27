import { auth, db } from "@/firebase";
import { Tabs, notification } from "antd";
import { get, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import Info from "../Info/Info";
import Order from "../Order/Order";
interface Customer {
  addressCustomer: string;
  emailCustomer: string;
  nameCustomer: string;
  phoneCustomer: string;
}
function Account() {
  const [customerData, setCustomerData] = useState<Customer[]>([]);
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
                  value={customerData?.phoneCustomer}
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
