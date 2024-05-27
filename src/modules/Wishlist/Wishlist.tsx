import type { TableColumnsType } from "antd";
import { Table } from "antd";
import "./Wishlist.css";
import { MdOutlineDelete } from "react-icons/md";
interface DataType {
  key: React.Key;
  product: string;
  category: string;
  name: string;
  price: number;
}
function Wishlist() {
  const columns: TableColumnsType<DataType> = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (image) => (
        <div className="flex justify-center items-center">
          <img src={image} alt="Product" className="w-[300px] " />
        </div>
      ),
    },
    {
      title: "Detail",
      dataIndex: "",
      key: "",
      render: (detail) => (
        <div className="flex justify-center items-center">
          <div className="text-[20px] text-center flex flex-col  gap-2 text-[#123829] relative bottom-36">
            <p className="font-light">{detail.category}</p>
            <p className="font-semibold">{detail.name}</p>
            <p className="font-light">{detail.price}$</p>
          </div>
        </div>
      ),
    },
    {
      title: "Cart button",
      dataIndex: "",
      key: "+",
      render: () => (
        <div className="flex justify-center items-center relative bottom-20 cursor-pointer">
          <button className="bg-[#123829] text-white font-semibold   ">
            Add to cart
          </button>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: () => (
        <div className="flex justify-center items-center relative bottom-[70px] cursor-pointer">
          <MdOutlineDelete color="#E85353 " className="w-[30px] h-[30px]" />
        </div>
      ),
    },
  ];

  const data: DataType[] = [
    {
      key: 1,
      product: "images/cake.png",
      category: "cake",
      name: "Chocolate Cake",
      price: 2022,
    },
  ];
  //   const db = firebase.firestore();
  //   db.collection("wishlist")
  //     .get()
  //     .then((querySnapshot) => {
  //       const newData: DataType[] = [];
  //       querySnapshot.forEach((doc) => {
  //         const { image, category, name, price } = doc.data();
  //         newData.push({
  //           key: doc.id,
  //           image,
  //           category,
  //           name,
  //           price,
  //         });
  //       });
  //       setData(newData);
  //     })
  //     .catch((error) => {
  //       console.error("Error getting documents: ", error);
  //     });
  // }, []);
  return (
    <div className="container mx-auto md:mx-auto mt-10">
      <Table columns={columns} dataSource={data}></Table>
    </div>
  );
}

export default Wishlist;
