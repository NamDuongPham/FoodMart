import { db } from "@/firebase";
import { Spin, Switch, Table, TableColumnsType, notification } from "antd";
import { format } from "date-fns/format";
import { get, ref, remove, update } from "firebase/database";
import { useEffect, useState } from "react";
import { ImSpinner11 } from "react-icons/im";
import { MdOutlineDelete } from "react-icons/md";

interface Contact {
  key: React.Key;
  fullName: string;
  email: string;
  phoneNumber: string;
  description: string;
  aprrove: boolean;
}
function ContactAdmin() {
  const columns: TableColumnsType<Contact> = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => (
        <p className="text-center text-[15px] font-semibold">{text}</p>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
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
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <p className="text-center text-[15px] font-semibold">{text}</p>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phone",
      render: (text) => (
        <p className="text-center text-[15px] font-semibold">{text}</p>
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (_, record) => (
        <div className="flex gap-5 justify-center items-center  cursor-pointer">
          <MdOutlineDelete
            color="#E85353 "
            className="w-[20px] h-[20px]"
            onClick={() => handleDelete(record.key.toString())}
          />
          <Switch
            className={`${
              record.aprrove ? "bg-green-500" : "bg-red-500"
            } relative inline-flex items-center h-6 rounded-full w-11`}
            defaultChecked={record.aprrove}
            checked={record.aprrove}
            onChange={() => handleApprove(record.key.toString())}
          />
        </div>
      ),
    },
  ];
  const [contact, setContact] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleApprove = async (key: string) => {
    try {
      await update(ref(db, `contacts/${key}`), {
        aprrove: !contact.find((c) => c.key === key)!.aprrove,
      });
      notification.success({
        message: "update success!",
      });
      fetchCcontact(); // Gọi lại hàm fetchCustomer để cập nhật danh sách
    } catch (error) {
      console.error("Error updating customer: ", error);
    }
  };
  const fetchCcontact = async () => {
    setIsLoading(true);
    try {
      const dbRef = ref(db, "contacts");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const contactData = snapshot.val();
        const contactArray = Object.entries(contactData).map(
          ([key, value]) => ({
            key,
            ...value,
            aprrove: value.aprrove || false,
          })
        );

        // console.log(contactArray);

        setContact(contactArray);
      } else throw new Error("No customer found!");
    } catch (error) {
      console.error("Error fetching customer: ", error);
    } finally {
      setIsLoading(false); // Kết thúc tải dữ liệu, đặt isLoading thành false
    }
  };
  useEffect(() => {
    fetchCcontact();
  }, []);
  const handleDelete = async (key: string) => {
    try {
      await remove(ref(db, `contacts/${key}`));
      fetchCcontact(); // Gọi lại hàm fetchCustomer để cập nhật danh sách
    } catch (error) {
      console.error("Error deleting customer: ", error);
    }
  };
  return (
    <>
      <div
        className="card no-hover flex flex-col gap-5 !p-5 md:!p-[26px] lg:!py-5 lg:flex-row
             lg:items-center lg:gap-4 bg-white m-3 rounded-lg"
      >
        <h1 className="flex-1 text-center lg:text-left">Contact Management</h1>
        <button
          className="group hidden w-fit xl:flex items-center gap-2 font-heading font-semibold
                    text-header text-sm"
          onClick={() => {
            fetchCcontact();
          }}
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
        <Table columns={columns} dataSource={contact} />
      )}
    </>
  );
}

export default ContactAdmin;
