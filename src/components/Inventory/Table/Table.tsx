/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TableProps } from "antd";
import { Table, Tag } from "antd";
import { format } from "date-fns";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { GrFormView } from "react-icons/gr";
import { MdOutlineDelete } from "react-icons/md";
import "../../../App.css";

import ModalEdit from "./ModalEdit";

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
  createAt?: "";
  startAt?: "";
  endAt?: "";
  tags: string[];
}

interface TableProductProps {
  product: DataType[];
}

function TableProduct({ product }: TableProductProps) {
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Name",
      dataIndex: "foodName",
      key: "",
      render: (text) => (
        <p className="text-center text-[15px] font-semibold">{text}</p>
      ),
    },
    {
      title: "Image",
      dataIndex: "foodImage",
      key: "",
      render: (img) => (
        <div className="flex justify-center items-center">
          <img
            src={img}
            alt="Product"
            className="w-[70px] relative top-7 h-[70px]"
          />
        </div>
      ),
    },
    {
      title: "In Stock",
      dataIndex: "inStock",
      key: "",
      render: (stock) => {
        let color;

        if (stock === "true") {
          color = "green";
        } else {
          color = "red";
        }

        return (
          <p
            className="text-center font-semibold text-[15px]"
            style={{ color }}
          >
            {stock}
          </p>
        );
      },
    },
    {
      title: "Price",
      dataIndex: "foodPrice",
      key: "",
      render: (text) => (
        <p className="text-center font-semibold text-[15px]">{text}</p>
      ),
    },
    {
      title: "Categoty",
      dataIndex: "categoryId",
      key: "",
      render: (text) => (
        <p className="text-blue-500 text-center font-semibold text-[15px]">
          {text}
        </p>
      ),
    },
    {
      title: "Type",
      dataIndex: "typeOfDishId",
      key: "",
      render: (text) => (
        <p className="text-center font-semibold text-[15px]">{text}</p>
      ),
    },
    {
      title: "Tags",
      key: "",
      dataIndex: "",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = "";
            if (tag === "Trending") {
              color = "volcano";
            } else if (tag === "Best Seller") {
              color = "green";
            }
            return (
              <div className="flex flex-col justify-center gap-3 relative bottom-4 py-1">
                <Tag color={color} key={tag} className="text-center">
                  {tag.toUpperCase()}
                </Tag>
              </div>
            );
          })}
        </>
      ),
    },

    // {
    //   title: "Date",
    //   dataIndex: "createAt",
    //   key: "",
    //   // render: (date) => (
    //   //   <div className="text-center font-semibold text-[15px]">
    //   //     <span className="text-center font-medium text-[15px]">
    //   //       CreateAt:
    //   //     </span>
    //   //     <br />
    //   //     {format(new Date(date), "yyyy-MM-dd HH:mm:ss")}
    //   //   </div>
    //   // ),
    //   render: (createAt) => {
    //     if (createAt === undefined || createAt === "") {
    //       return <span>Loading...</span>;
    //     }
    //     return (
    //       <span>
    //         {/* {format(new Date(createAt), "dd-MM-yyyy HH:mm:ss")} */}
    //         {format(new Date(v), "MM/dd/yyyy")}
    //       </span>
    //     );
    //   },
    // },
    {
      title: "Action",
      dataIndex: "",
      key: "",
      render: (_, record) => (
        <div className="flex justify-between items-center  cursor-pointer">
          <FaEdit
            color="#04785b "
            className="w-[20px] h-[20px]"
            onClick={() => {
              setIsOpenEdit(true);
              handleEditProduct(record.key);
            }}
          />
          <GrFormView
            color="#15d6d6 "
            className="w-[25px] h-[25px]"
            onClick={() => {
              setIsViewMode(true);
              setIsOpenEdit(true);
              handleViewProduct(record.key);
            }}
          />
          <MdOutlineDelete color="#E85353 " className="w-[20px] h-[20px]" />
        </div>
      ),
    },
  ];

  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DataType | undefined>(
    undefined
  );
  const handleEditProduct = (productKey: React.Key) => {
    const selectedProduct = product.find((p: DataType) => p.key === productKey);

    if (product) {
      setIsOpenEdit(true);
      setIsViewMode(false);
      setSelectedProduct(selectedProduct);
    }
  };

  const handleViewProduct = (productKey: React.Key) => {
    const selectedProduct = product.find((p: DataType) => p.key === productKey);
    if (product) {
      setIsViewMode(true);
      setIsOpenEdit(true);
      setSelectedProduct(selectedProduct);
    }
  };
  return (
    <div className="md:!p-[26px]">
      <Table
        expandable={{
          expandedRowRender: (record: DataType) => (
            <>
              <p style={{ margin: 0 }} className="flex gap-2 text-lg">
                <span className="text-red-500 font-semibold">Description:</span>
                {record.foodDescription}
              </p>
            </>
          ),
        }}
        columns={columns}
        dataSource={product}
      />
      <ModalEdit
        isOpenEdit={isOpenEdit}
        setIsOpenEdit={setIsOpenEdit}
        isViewMode={isViewMode}
        product={selectedProduct}
      />
    </div>
  );
}

export default TableProduct;
