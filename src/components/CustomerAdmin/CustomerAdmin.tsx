import { db } from "@/firebase";
import { Spin, Table, TableColumnsType } from "antd";
import { format } from "date-fns";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { ImSpinner11 } from "react-icons/im";

interface Customer {
  key: React.Key;
  nameCustomer: string;
  emailCustomer: string;
  addressCustomer: string;
  phoneCustomer: string;
  
}
function CustomerAdmin() {
  const columns: TableColumnsType<Customer> = [
    {
      title: "Name",
      dataIndex: "nameCustomer",
      key: "name",
      render: (text) => (
        <p className="text-center text-[15px] font-semibold">{text}</p>
      ),
    },
    {
      title: "Email",
      dataIndex: "emailCustomer",
      key: "email",
      render: (email) => (
        <a
          className="flex justify-center text-[15px]"
          onClick={() => {
            window.open(`mailto:${email}`, "_blank");
          }}
        >
          {email}
        </a>
      ),
    },
    {
      title: "Address",
      dataIndex: "addressCustomer",
      key: "address",
      render: (text) => (
        <p className="text-center text-[15px] font-semibold">{text}</p>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneCustommer",
      key: "phone",
      render: (text) => (
        <p className="text-center text-[15px] font-semibold">{text}</p>
      ),
    },
    // {
    //   title: "Action",
    //   dataIndex: "",
    //   key: "x",
    //   render: (_, record) => (
    //     <div className="flex justify-center items-center  cursor-pointer">
    //       <MdOutlineDelete
    //         color="#E85353 "
    //         className="w-[20px] h-[20px]"
    //         onClick={() => handleDelete(record.key)}
    //       />
    //     </div>
    //   ),
    // },
  ];
  const [customer, setcustomer] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchCustomer = async () => {
    setIsLoading(true);
    try {
      const dbRef = ref(db, "customer");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const customerData = snapshot.val();
        const customerArray = Object.keys(customerData).map((key) => {
          return Object.assign({ key: key }, customerData[key]) as Customer;
        });
        console.log(customerArray);
        
        setcustomer(customerArray);
      } else throw new Error("No customer found!");
    } catch (error) {
      console.error("Error fetching customer: ", error);
    } finally {
      setIsLoading(false); // Kết thúc tải dữ liệu, đặt isLoading thành false
    }
  };
  useEffect(() => {
    fetchCustomer();
  }, []);
//   const handleDelete = async (key: string) => {
//     try {
//       await remove(ref(db, `customer/${key}`));
//       fetchCustomer(); // Gọi lại hàm fetchCustomer để cập nhật danh sách
//     } catch (error) {
//       console.error("Error deleting customer: ", error);
//     }
//   };
  return (
    <>
      <div
        className="card no-hover flex flex-col gap-5 !p-5 md:!p-[26px] lg:!py-5 lg:flex-row
           lg:items-center lg:gap-4 bg-white m-3 rounded-lg"
      >
        <h1 className="flex-1 text-center lg:text-left">Customer Management</h1>
        <button
          className="group hidden w-fit xl:flex items-center gap-2 font-heading font-semibold
                  text-header text-sm"
                  onClick={()=>{fetchCustomer()}}
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
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spin tip="Loading..." /> 
        </div>
      ) : (
        <Table columns={columns} dataSource={customer} />
      )}
    </>
  );
}

export default CustomerAdmin;
