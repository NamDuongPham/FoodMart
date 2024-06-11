/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/firebase";
import type { TableProps } from "antd";
import { Card, Spin, Switch, Table, Tag, notification } from "antd";
import { format } from "date-fns";
import dayjs from "dayjs";
import { get, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import { FaRegCalendarMinus } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { GrFormView } from "react-icons/gr";
import { ImSpinner11 } from "react-icons/im";
import { MdDeliveryDining } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
interface DataType {
  key: React.Key;
  id: string;
  customer: string;
  total: number;
  date: number;
  orderAccepted: boolean;
  paymentStatus: string;
  deliveryStatus: string;
}

function OrderAdmin() {
  const navigate = useNavigate();
  const [order, setOrder] = useState<DataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const dbRef = ref(db, "OrderDetails");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const orders = Object.keys(data).map((key) => {
          return Object.assign({ key: key }, data[key]) as DataType;
        });

        // console.log(contactArray);

        setOrder(orders);
      } else throw new Error("No customer found!");
    } catch (error) {
      console.error("Error fetching customer: ", error);
    } finally {
      setIsLoading(false); // Kết thúc tải dữ liệu, đặt isLoading thành false
    }
  };
  useEffect(() => {
    fetchOrder();
  }, []);
  console.log(order);

  // const deliveryStatuses = ["Pending","Done", "Delivering", "Cancel"];
  const deliveryStatusColors: Record<string, string> = {
    Pending: "gray",
    Done: "green",
    Delivering: "blue",
    Cancel: "red",
  };
  const isOrderDone = (record: DataType) => record.deliveryStatus === "Done";

  const handleApprove = async (key: string) => {
    try {
      await update(ref(db, `OrderDetails/${key}`), {
        orderAccepted: !order.find((c) => c.key === key)!.orderAccepted,
      });
      notification.success({
        message: "update success!",
      });
      fetchOrder(); // Gọi lại hàm fetchCustomer để cập nhật danh sách
    } catch (error) {
      console.error("Error updating customer: ", error);
    }
  };
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "ID",
      dataIndex: "key",
      key: "",
      render: (text) => <p className="text-center text-[15px] ">{text}</p>,
    },
    {
      title: "Accept",
      dataIndex: "orderAccepted",
      key: "",
      onFilter: (value, record) => {
        if (value === "true") {
          return record.orderAccepted;
        } else {
          return !record.orderAccepted;
        }
      },
      filterSearch: false,

      render: (_, record) => (
        <Switch
          className={`${
            record.orderAccepted ? "bg-green-500" : "bg-red-500"
          } relative inline-flex items-center h-6 rounded-full w-11`}
          defaultChecked={record.orderAccepted}
          checked={record.orderAccepted}
          onChange={() => handleApprove(record.key.toString())}
          disabled={isOrderDone(record)}
        />
      ),
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "",
      render: (text) => (
        <p className="text-center text-[15px] font-semibold">{text}</p>
      ),
    },

    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "",
      render: (text) => (
        <p className="text-center font-semibold text-[15px]">
          {Number(text).toLocaleString("vi-VN") + "đ"}
        </p>
      ),
    },
    {
      title: "Payment status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",

      render: (paymentStatus) => (
        <div className="flex justify-center">
          <Tag
            color={
              paymentStatus === "MOMO"
                ? "#D82D8B"
                : paymentStatus === "ZALOPAY"
                ? "#0068ff"
                : paymentStatus === "COD"
                ? "#FF7A45"
                : "volcano"
            }
          >
            {paymentStatus}
          </Tag>
        </div>
      ),
    },
    {
      title: "Delivery status",
      key: "deliveryStatus",
      dataIndex: "deliveryStatus",
      render: (deliveryStatus: string) => {
        return (
          <div className="flex justify-center">
            <Tag color={deliveryStatusColors[deliveryStatus]}>
              {deliveryStatus}
            </Tag>
          </div>
        );
      },
    },

    {
      title: "Date",
      dataIndex: "currentTime",
      key: "",
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      render: (date) => (
        <div className="text-center font-semibold text-[15px]">
          <span className="text-center font-medium text-[15px]">
            Last updated:
          </span>{" "}
          <br />
          {format(new Date(date), "yyyy-MM-dd HH:mm:ss")}
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "",
      render: (record) => (
        <div className="flex justify-between items-center  cursor-pointer">
          <GrFormView
            color="#000000 "
            className="w-[30px] h-[30px]"
            onClick={() => navigate(`/admin/order/${record.key}`)}
          />
          <MdDeliveryDining
            color="#04785b "
            className={`w-[30px] h-[30px] ${
              !record.orderAccepted ? "hidden" : ""
            }`}
            onClick={() => handleDeliveryStatusChange(record, "Delivering")}
          />
          <TiTick
            color="#15d6d6 "
            className={`w-[30px] h-[30px] ${
              !record.orderAccepted ? "hidden" : ""
            }`}
            onClick={() => handleDeliveryStatusChange(record, "Done")}
          />
          <FcCancel
            color="#E85353 "
            className={`w-[30px] h-[30px] ${
              !record.orderAccepted ? "hidden" : ""
            }`}
            onClick={() => handleDeliveryStatusChange(record, "Cancel")}
          />
        </div>
      ),
    },
  ];

  const handleDeliveryStatusChange = async (
    record: DataType,
    newStatus: string
  ) => {
    try {
      // Cập nhật dữ liệu trên Realtime Database

      const orderRef = ref(db, `OrderDetails/${record.key}`);
      await update(orderRef, {
        deliveryStatus: newStatus,
      });

      // Cập nhật dữ liệu trong state
      const newData = order.map((item) => {
        if (item.key === record.key) {
          return {
            ...item,
            deliveryStatus: newStatus,
          };
        }
        return item;
      });
      setOrder(newData);
    } catch (error) {
      console.error("Error updating delivery status: ", error);
    }
  };
  const orderAccept = order.filter((item) => item.orderAccepted === false);
  return (
    <div className="md:!p-[26px]">
      <div
        className="card no-hover flex justify-between gap-5 !p-5 md:!p-[26px] lg:!py-5 lg:flex-row
           lg:items-center lg:gap-4 bg-white  rounded-lg mb-3"
      >
        <h1 className=" text-center lg:text-left">Order</h1>
        <Card
          className=" h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#1CC88A] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out"
          loading={isLoading}
        >
          <div>
            <h2 className="text-[#B589DF] text-[11px] leading-[17px] font-bold">
              TOTAL ORDERS
            </h2>
            <h1 className="text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]">
              {order.length} orders
            </h1>
          </div>
          <FaRegCalendarMinus fontSize={28} color="" />
        </Card>
        <Card
          className=" h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#4E73DF] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out"
          loading={isLoading}
        >
          <div>
            <h2 className="text-[#B589DF] text-[11px] leading-[17px] font-bold">
              WAIT FOR ACCEPTED
            </h2>
            <h1 className="text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]">
              {orderAccept.length} orders
            </h1>
          </div>
          <FaRegCalendarMinus fontSize={28} color="" />
        </Card>
        <button
          className="group hidden w-fit xl:flex items-center gap-2 font-heading font-semibold
                  text-header text-sm"
          onClick={() => {
            fetchOrder();
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
        <Table columns={columns} dataSource={order} />
      )}
    </div>
  );
}

export default OrderAdmin;
