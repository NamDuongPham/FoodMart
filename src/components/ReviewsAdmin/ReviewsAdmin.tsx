import { format } from "date-fns";
import { ImSpinner11 } from "react-icons/im";
import CardReport from "./CardReport";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { child, get, onValue, ref } from "firebase/database";
import { db } from "@/firebase";
import moment from "moment";
interface DataType {
  key: React.Key;
  title: string;
  productName: string; // Tên sản phẩm từ bảng Product
  comment: string;
  email: string; // Email của khách hàng từ bảng Customer
  name: string; // Email của khách hàng từ bảng Customer
  phone: string; // Email của khách hàng từ bảng Customer
  star: string;
  createAt: number;
}

function ReviewsAdmin() {

  const columns: TableColumnsType<DataType> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <p className="text-center text-[15px] font-semibold">{text}</p>
      ),
    },
    {
      title: "Product",
      dataIndex: "productName",
      key: "productName",
      render: (text) => (
        <p className="text-center text-[15px] font-semibold">{text}</p>
      ),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      render: (text) => (
        <p className="text-center text-[15px] font-semibold">{text}</p>
      ),
    },
    {
      title: "Rate",
      dataIndex: "star",
      key: "star",
      render: (rate: string) => {
        const rateNum = parseInt(rate);
        return (
          <div className="flex justify-center gap-3">
            {[...Array(rateNum)].map((_, index) => (
              <FaStar key={index} color="#f8d518" />
            ))}
          </div>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "createAt",
      key: "createAt",
      render: (timestamp) => (
        <p className="text-center text-[15px] font-semibold">
          <span> Create At:</span>
          <br />
          {/* {format(new Date(timestamp), "dd/MM/yyyy")} */}
          {moment(timestamp).format("MMM Do YY")}
        </p>
      ),
    },
  ];
  const [data, setData] = useState<DataType[]>([]);
  useEffect(() => {
    const commentsRef = ref(db, "comments");
    const productsRef = ref(db, "menu");
    const customersRef = ref(db, "customer");

    onValue(commentsRef, (commentsSnapshot) => {
      const commentsData = commentsSnapshot.val();
      if (commentsData) {
        const commentsList = Object.entries(commentsData).map(
          ([key, value]) => ({
            key,
            ...value,
          })
        );
        // console.log(commentsList);

        const productPromises = commentsList.map(async (comment) => {
          const productSnapshot = await get(
            child(productsRef, `/${comment.productID}`)
          );
          const productData = productSnapshot.val();
          return { ...comment, productName: productData.foodName };
        });

        Promise.all(productPromises).then((commentsWithProducts) => {
          const customerPromises = commentsWithProducts.map(async (comment) => {
            const customerSnapshot = await get(
              child(customersRef, `/${comment.customerID}`)
            );
            const customerData = customerSnapshot.val();
            return {
              ...comment,
              email: customerData.emailCustomer,
              phone: customerData.phoneNumberCustomer,
              name: customerData.nameCustomer,
            };
          });

          Promise.all(customerPromises).then((finalData) => {
            setData(finalData);
          });
        });
      } else {
        setData([]);
      }
    });
  }, []);
 console.log(data);
 
  
  return (
    <div>
      <div
        className="card no-hover flex flex-col gap-5 !p-5 md:!p-[26px] lg:!py-5 lg:flex-row
           lg:items-center lg:gap-4 bg-white m-3 rounded-lg"
      >
        <h1 className="flex-1 text-center lg:text-left">Reviews</h1>
        <button
          className="group hidden w-fit xl:flex items-center gap-2 font-heading font-semibold
                  text-header text-sm"
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
      {/* CARD REPORT */}
      <CardReport />
      {/* TABLE */}
      <Table
        className="mt-5 mx-3"
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <>
              <p style={{ margin: 0 }} className="flex gap-2 text-lg">
                <span className="text-red-500 font-semibold">Name:</span>
                {record.name}
              </p>
              <p style={{ margin: 0 }} className="flex gap-2 text-lg">
                {" "}
                <span className="text-red-500 font-semibold">Email:</span>{" "}
                <a
                  onClick={() => {
                    window.open(`mailto:${record.email}`, "_blank");
                  }}
                >
                  {record.email}
                </a>
              </p>
              <p style={{ margin: 0 }} className="flex gap-2 text-lg">
                {" "}
                <span className="text-red-500 font-semibold">Phone:</span>
                {record.phone}
              </p>
            </>
          ),
        }}
        dataSource={data}
      />
    </div>
  );
}

export default ReviewsAdmin;
