import { db } from "@/firebase";

import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  notification,
} from "antd";
import dayjs from "dayjs";
import { get, push, ref, set } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import styled from "styled-components";
interface Category {
  key: React.Key;
  category_name: string;
}
interface TypeOfDish {
  key: React.Key;
  typeOfDishName: string;
  image: string;
}
function AddProduct() {
  const { RangePicker } = DatePicker;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const [categories, setCategories] = useState<Category[]>([]);
  const [type, setType] = useState<TypeOfDish[]>([]);

  const fetchType = async () => {
    try {
      const dbRef = ref(db, "TypeOfDish");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        setType(Object.values(snapshot.val()));
      } else throw new Error("No categories found!");
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };
  const fetchCategories = async () => {
    try {
      const dbRef = ref(db, "categories");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        setCategories(Object.values(snapshot.val()));
      } else throw new Error("No categories found!");
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };
  useEffect(() => {
    fetchType();
    fetchCategories();
  }, []);
  const storage = getStorage(); // Khởi tạo Firebase Storage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uploadImage = async (file: any) => {
    const storageRefs = storageRef(storage, `menu_images/${file.name}`);
    await uploadBytes(storageRefs, file);
    const downloadURL = await getDownloadURL(storageRefs);
    return downloadURL;
  };

  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [foodDescription, setFoodDescription] = useState("");
  const [foodIngredient, setFoodIngredient] = useState("");
  const [foodImage, setFoodImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [typeOfDishId, setTypeOfDishId] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [createAt, setCreateAt] = useState("");
  const [trending, setTrending] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [inStock, setInStock] = useState(false);
  // console.log(foodImage);
  
  const handleAddProduct = async () => {
    const currentTime = new Date().getTime().toString();
    setCreateAt(currentTime);
    const imageURL = await uploadImage(foodImage);
    try {
      const newDocRef = push(ref(db, "menu"));
      await set(ref(db, `menu/${newDocRef.key}`), {
        foodName: foodName,
        foodPrice: foodPrice,
        discount: discount,
        foodDescription: foodDescription,
        foodIngredient: foodIngredient,
        foodImage: imageURL,
        categoryId: categoryId,
        typeOfDishId: typeOfDishId,
        startAt: startAt,
        endAt: endAt,
        createAt: createAt,
        trending: trending,
        bestSeller: bestSeller,
        inStock: inStock,
      });
      notification.success({
        message: "add form success!",
      });
      // Clear form
      setFoodName("");
      setFoodPrice(0);
      setDiscount(0);
      setFoodDescription("");
      setFoodIngredient("");
      setFoodImage("");
      setCategoryId("");
      setTypeOfDishId("");
      setStartAt("");
      setEndAt("");
      setTrending(false);
      setBestSeller(false);
      setInStock(false);
    } catch (error) {
      console.error("Error adding contact: ", error);
      notification.error({
        message: "add form fail!",
      });
    }
  };
  return (
    <div className="mt-5">
      <div className="mx-3 flex gap-10">
        <FormCustom
          className="basis-1/2 "
          {...formItemLayout}
          variant="filled"
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Name"
            name="foodName"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input
              className="text-xl"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Price"
            name="foodPrice"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              value={foodPrice}
              onChange={(value) => setFoodPrice(value ?? 0)}
            />
          </Form.Item>
          <Form.Item
            label="Value discount"
            name="discount"
            rules={[{ required: false, message: "Please input!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              value={discount}
              onChange={(value) => setDiscount(value ?? 0)}
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name="foodDescription"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input.TextArea
              style={{ height: "150px" }}
              value={foodDescription}
              onChange={(e) => setFoodDescription(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Ingredient"
            name="foodIngredient"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input.TextArea
              style={{ height: "150px" }}
              value={foodIngredient}
              onChange={(e) => setFoodIngredient(e.target.value)}
            />
          </Form.Item>
        </FormCustom>
        <FormCustom {...formItemLayout}>
          <Form.Item
            label="Type"
            name="categoryId"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Select
              value={categoryId}
              onChange={(value) => setCategoryId(value)}
              options={categories.map((category) => ({
                value: category.category_name,
                label: category.category_name,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Category"
            name="typeOfDishId"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Select
              value={typeOfDishId}
              onChange={(value) => setTypeOfDishId(value)}
              options={type.map((typeItem) => ({
                value: typeItem.typeOfDishName,
                label: typeItem.typeOfDishName,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Range Discount"
            name="RangePicker"
            rules={[{ required: false, message: "Please input!" }]}
          >
            <RangePicker
              value={[
                startAt ? dayjs(startAt) : null,
                endAt ? dayjs(endAt) : null,
              ]}
              onChange={(dates) => {
                if (dates) {
                  setStartAt(dates[0]?.valueOf().toString() ?? "");
                  setEndAt(dates[1]?.valueOf().toString() ?? "");
                } else {
                  setStartAt("");
                  setEndAt("");
                }
              }}
            />
          </Form.Item>
          <Form.Item
            label="Check box"
            name=""
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Checkbox
              checked={trending}
              onChange={(e) => setTrending(e.target.checked)}
            >
              TRENDING
            </Checkbox>
            <Checkbox
              checked={bestSeller}
              onChange={(e) => setBestSeller(e.target.checked)}
            >
              BEST SELLER
            </Checkbox>
            <Checkbox
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
            >
              IN STOCK
            </Checkbox>
          </Form.Item>
        </FormCustom>
        <FormCustom>
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
        </FormCustom>
      </div>
      <FormCustom className="flex justify-end">
        <Form.Item>
          <Button
            className="bg-blue-500 mt-4 "
            type="primary"
            htmlType="submit"
            onClick={() => {
              handleAddProduct();
            }}
          >
            ADD
          </Button>
        </Form.Item>
      </FormCustom>
    </div>
  );
}

export default AddProduct;
const FormCustom = styled(Form)`
  width: 500px;
  height: 600px;

  :where(.css-dev-only-do-not-override-1ae8k9u).ant-form-item
    .ant-form-item-label
    > label {
    font-size: 22px;
    color: #123829;
    font-weight: 600;
  }
`;
