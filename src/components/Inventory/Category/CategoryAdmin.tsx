import {
  Form,
  Input,
  Table,
  TableColumnsType,
  Upload,
  notification,
} from "antd";
import { format } from "date-fns";
import { get, push, ref, set } from "firebase/database";
import { db } from "../../../firebase";
import { useEffect, useState } from "react";
import { ImSpinner11 } from "react-icons/im";
import { MdOutlineDelete } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

interface DataType {
  image: string;
  name: string;
}
function CategoryAdmin() {
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "typeOfDishName",
      render: (text: string) => <p className="text-center text-xl ">{text}</p>,
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (img: string) => (
        <div className="flex justify-center">
          <img src={img} />
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: () => (
        <div className="flex justify-center items-center  cursor-pointer">
          <MdOutlineDelete color="#E85353 " className="w-[20px] h-[20px]" />
        </div>
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };
  const storage = getStorage(); // Khởi tạo Firebase Storage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uploadImage = async (file: any) => {
    const storageRefs = storageRef(storage, `images typeOfDish/${file.name}`);
    await uploadBytes(storageRefs, file);
    const downloadURL = await getDownloadURL(storageRefs);
    return downloadURL;
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectionType, setSelectionType] = useState<"checkbox">("checkbox");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState<DataType[]>([]);
  const [foodImage, setFoodImage] = useState("");
  const fetchCategories = async () => {
    try {
      const dbRef = ref(db, "TypeOfDish");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        setCategories(Object.values(snapshot.val()));
      } else throw new Error("No categories found!");
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  const handleAddCategory = async () => {
    const imageURL = await uploadImage(foodImage);
    try {
      const newDocRef = push(ref(db, "TypeOfDish"));
      await set(newDocRef, {
        typeOfDishName: newCategoryName,
        image: imageURL,
      });
      notification.success({
        message: "add success!",
      });
      setNewCategoryName("");
      setFoodImage("");
      //   window.location.reload();
    } catch (error) {
      console.error("Error adding category: ", error);
      notification.error({
        message: "add fail!",
      });
    }
  };
  return (
    <div>
      <div
        className="card no-hover flex flex-col gap-5 !p-5 md:!p-[26px] lg:!py-5 lg:flex-row
           lg:items-center lg:gap-4 bg-white m-3 rounded-lg"
      >
        <h1 className="flex-1 text-center lg:text-left">Category Admin</h1>
        <button
          className="group hidden w-fit xl:flex items-center gap-2 font-heading font-semibold
                  text-header text-sm"
          onClick={() => {
            fetchCategories();
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
      {/*  */}
      <div className="md:!p-[26px] flex  gap-5 items-center">
        <div>
          <Input
            className="w-[300px] h-[40px]"
            placeholder="Name category"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Form>
            <Form.Item
              label="Upload"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                action="/upload.do"
                listType="picture-card"
                maxCount={1} // Giới hạn chỉ được upload 1 tấm ảnh
                // onChange={(info) => {
                //   if (info.file.status === "done") {
                //     setFoodImage(info.file.response.url);
                //   }
                // }}
                beforeUpload={(file) => {
                  setFoodImage(file);
                  return false; // Trả về false để không tải lên server
                }}
              >
                <button
                  className="flex flex-col justify-center items-center"
                  style={{ border: 0, background: "none" }}
                  type="button"
                >
                  <FiPlus />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
              </Upload>
            </Form.Item>
          </Form>
        </div>
        <button
          className="bg-[#02a189] text-white rounded-[30px] px-10 font-bold shadow-lg shadow-[#02caab59]"
          onClick={handleAddCategory}
          disabled={!newCategoryName.trim()}
        >
          Add new category
        </button>
      </div>

      {/*  */}
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={categories}
      />
    </div>
  );
}

export default CategoryAdmin;
