import { Input, Spin, Table, TableColumnsType, notification } from "antd";
import { format } from "date-fns";
import { get, push, ref, remove, set } from "firebase/database";
import { db } from "../../../firebase";
import { useEffect, useState } from "react";
import { ImSpinner11 } from "react-icons/im";
import { MdOutlineDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

interface DataType {
  key: React.Key;
  name: string;
}
function TypeAdmin() {
  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "category_name",
      render: (text: string) => <p className="text-center text-xl ">{text}</p>,
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (_, record) => (
        <div className="flex justify-center gap-5 items-center  cursor-pointer">
          <MdOutlineDelete
            color="#E85353 "
            className="w-[20px] h-[20px]"
            onClick={() => handleDelete(record.key.toString())}
          />
          <FaEdit
            color="#04785b "
            className="w-[20px] h-[20px]"
            onClick={() => {
              handleEdit(record);
            }}
          />
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectionType, setSelectionType] = useState<"checkbox">("checkbox");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState<DataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DataType | null>(null);
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const dbRef = ref(db, "categories");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const type = Object.keys(data).map((key) => {
          return Object.assign({ key: key }, data[key]) as DataType;
        });
        setCategories(type);
      } else throw new Error("No types found!");
    } catch (error) {
      console.error("Error fetching types: ", error);
    } finally {
      setIsLoading(false); // Kết thúc tải dữ liệu, đặt isLoading thành false
    }
  };
  // console.log(categories);

  useEffect(() => {
    fetchCategories();
  }, []);
  const handleAddCategory = async () => {
    try {
      const newDocRef = push(ref(db, "categories"));
      await set(newDocRef, {
        category_name: newCategoryName,
      });
      notification.success({
        message: "add success!",
      });
      fetchCategories();
    } catch (error) {
      console.error("Error adding category: ", error);
      notification.error({
        message: "add fail!",
      });
    }
  };

  const handleDelete = async (key: string) => {
    try {
      await remove(ref(db, `categories/${key}`));
      fetchCategories(); // Gọi lại hàm fetchCustomer để cập nhật danh sách
      notification.success({
        message: "Delete success!",
      });
    } catch (error) {
      console.error("Error deleting customer: ", error);
    }
  };
  const handleEdit = (record: DataType) => {
    // console.log(record);
    setIsEditing(true);
    setEditingCategory(record);
    setNewCategoryName(record.name);
  };

  const handleUpdate = async () => {
    try {
      const categoryRef = ref(db, `categories/${editingCategory?.key}`);
      await set(categoryRef, {
        category_name: newCategoryName,
      });
      notification.success({
        message: "Update success!",
      });
      setIsEditing(false);
      setEditingCategory(null);
      setNewCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error("Error updating category: ", error);
      notification.error({
        message: "Update fail!",
      });
    }
  };
  return (
    <div>
      <div
        className="card no-hover flex flex-col gap-5 !p-5 md:!p-[26px] lg:!py-5 lg:flex-row
           lg:items-center lg:gap-4 bg-white m-3 rounded-lg"
      >
        <h1 className="flex-1 text-center lg:text-left">Type Admin</h1>
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
            placeholder="Name type"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </div>
        <button
          className="bg-[#02a189] text-white rounded-[30px] px-10 font-bold shadow-lg shadow-[#02caab59]"
          onClick={isEditing ? handleUpdate : handleAddCategory}
          // disabled={!newCategoryName.trim()}
        >
          {isEditing ? "Update" : "Add new type"}
        </button>
      </div>

      {/*  */}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spin tip="Loading..." /> {/* Hiển thị component Spin của antd */}
        </div>
      ) : (
        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={categories}
        />
      )}
    </div>
  );
}

export default TypeAdmin;
