import ModalCustom from "@/components/ModalCustom/ModalCustom";
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
import { get, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import styled from "styled-components";
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
  updateAt: number;
  startAt?: number;
  endAt?: number;
  tags: string[];
}
interface IProps {
  isOpenEdit: boolean;
  setIsOpenEdit: (_is: boolean) => void;
  isViewMode: boolean;
  product: DataType;
}
interface Category {
  key: React.Key;
  category_name: string;
}
interface TypeOfDish {
  key: React.Key;
  typeOfDishName: string;
  image: string;
}
function ModalEdit({ isOpenEdit, setIsOpenEdit, isViewMode, product }: IProps) {
  const title = isViewMode ? "View Detail" : "Edit Product";
  const { RangePicker } = DatePicker;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
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

  const [form] = Form.useForm();
  const [selectedProduct, setSelectedProduct] = useState<DataType | null>(null);
  useEffect(() => {
    fetchType();
    fetchCategories();
    if (product) {
      setSelectedProduct(product);
      form.setFieldsValue({
        foodName: product.foodName,
        foodPrice: product.foodPrice,
        discount: product.discount,
        foodDescription: product.foodDescription,
        foodIngredient: product.foodIngredient,
        categoryId: product.categoryId,
        typeOfDishId: product.typeOfDishId,
        startAt: dayjs.unix(product.startAt ?? 0).toString(),
        endAt: dayjs.unix(product.endAt ?? 0).toString(),
        trending: product.tags.includes("Trending"),
        bestseller: product.tags.includes("Best Seller"),
        inStock: product.inStock,
      });
    } else {
      setSelectedProduct(null);
    }
  }, [form, product]);

  const selectedCategory = categories.find(
    (category) => category.category_name === product?.categoryId
  );
  const selectedType = type.find(
    (typeItem) => typeItem.typeOfDishName === product?.typeOfDishId
  );
  // console.log(selectedType?.typeOfDishName, selectedCategory?.category_name);
  const handleSaveProduct = () => {
    const updatedProduct = {
      foodName: form.getFieldValue("foodName"),
      foodPrice: form.getFieldValue("foodPrice"),
      discount: form.getFieldValue("discount"),
      foodDescription: form.getFieldValue("foodDescription"),
      foodIngredient: form.getFieldValue("foodIngredient"),
      categoryId: form.getFieldValue("categoryId"),
      typeOfDishId: form.getFieldValue("typeOfDishId"),
      startAt: form.getFieldValue("startAt").unix(),
      endAt: form.getFieldValue("endAt").unix(),
      trending: form.getFieldValue("trending"),
      bestSeller: form.getFieldValue("bestSeller"),
      inStock: form.getFieldValue("inStock"),
    };
    console.log(updatedProduct);

    const productRef = ref(db, `menu/${product.key}`);
    update(productRef, updatedProduct)
      .then(() => {
        notification.success({
          message: "update success!",
        });
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        notification.error({
          message: "update fail!",
        });
      });
  }; // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCheckboxChange = (name: string, checked: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSelectedProduct((prevProduct: any) => ({
      ...prevProduct,
      [name]: checked,
      tags:
        name === "trending"
          ? checked
            ? [...prevProduct.tags, "Trending"]
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
              prevProduct.tags.filter((tag: any) => tag !== "Trending")
          : name === "bestSeller"
          ? checked
            ? [...prevProduct.tags, "Best Seller"]
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
              prevProduct.tags.filter((tag: any) => tag !== "Best Seller")
          : prevProduct.tags,
      inStock: name === "inStock" ? checked : prevProduct.inStock,
    }));
    form.setFieldsValue({ [name]: checked });
  };
  // console.log(selectedProduct?.inStock);

  return (
    <ModalCustom
      title={title}
      isOpen={isOpenEdit}
      setIsOpen={setIsOpenEdit}
      footer={<></>}
    >
      <>
        <div className="mx-3 flex gap-10">
          <FormCustom
            form={form}
            disabled={isViewMode}
            className="basis-1/2"
            {...formItemLayout}
            variant="filled"
            style={{ maxWidth: 600 }}
          >
            <Form.Item
              label="Name"
              name="foodName"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Price"
              name="foodPrice"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Value discount"
              name="discount"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Description"
              name="foodDescription"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Input.TextArea style={{ height: "150px" }} />
            </Form.Item>
            <Form.Item
              label="Ingredient"
              name="foodIngredient"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Input.TextArea style={{ height: "150px" }} />
            </Form.Item>
          </FormCustom>
          <Form {...formItemLayout} disabled={isViewMode}>
            <Form.Item
              label="Category"
              name="typeOfDishId"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Select
                placeholder={selectedType?.typeOfDishName}
                value={
                  selectedType?.typeOfDishName ||
                  form.getFieldValue("typeOfDishId")
                }
                onChange={(value) =>
                  form.setFieldsValue({ typeOfDishId: value })
                }
                options={type.map((typeItem) => ({
                  value: typeItem.typeOfDishName,
                  label: typeItem.typeOfDishName,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Type"
              name="categoryId"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Select
                placeholder={selectedCategory?.category_name}
                value={
                  selectedCategory?.category_name ||
                  form.getFieldValue("categoryId")
                }
                onChange={(value) => form.setFieldsValue({ categoryId: value })}
                options={categories.map((category) => ({
                  value: category.category_name,
                  label: category.category_name,
                }))}
              />
            </Form.Item>
            <Form.Item
              label="Range Discount"
              name="RangePicker"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <RangePicker
                format="YYYY/MM/DD"
                value={
                  product
                    ? [
                        dayjs.unix(product.startAt ?? 0),
                        dayjs.unix(product.endAt ?? 0),
                      ]
                    : undefined
                }
              />
              <label className="w-[0px] h-[0px]" />
            </Form.Item>
            <Form.Item
              label="Check box"
              name="tags"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Checkbox
                name="trending"
                value="Trending"
                // checked={form.getFieldValue("trending")}
                // onChange={(e) =>
                //   form.setFieldsValue({ trending: e.target.checked })
                // }
                checked={selectedProduct?.tags.includes("Trending")}
                onChange={(e) =>
                  handleCheckboxChange("trending", e.target.checked)
                }
              >
                TRENDING
              </Checkbox>
              <Checkbox
                value="Best Seller"
                name="bestSeller"
                // checked={form.getFieldValue("bestSeller")}
                // onChange={(e) =>
                //   form.setFieldsValue({ bestSeller: e.target.checked })
                // }
                checked={selectedProduct?.tags.includes("Best Seller")}
                onChange={(e) =>
                  handleCheckboxChange("bestSeller", e.target.checked)
                }
              >
                BEST SELLER
              </Checkbox>
              <Checkbox
                name="inStock"
                value="inStock"
                // checked={form.getFieldValue("inStock")}
                // onChange={(e) =>
                //   form.setFieldsValue({ inStock: e.target.checked })
                // }
                checked={selectedProduct?.inStock}
                onChange={(e) =>
                  handleCheckboxChange("inStock", e.target.checked)
                }
              >
                IN STOCK
              </Checkbox>
            </Form.Item>
          </Form>
          <Form disabled={isViewMode}>
            <Form.Item
              label="Upload"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                action="/upload.do"
                listType="picture-card"
                fileList={
                  product?.foodImage
                    ? [
                        {
                          uid: "-1",
                          name: "image.png",
                          status: "done",
                          url: product.foodImage,
                        },
                      ]
                    : []
                }
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
        <Form className="flex justify-end" disabled={isViewMode}>
          <Form.Item>
            <Button
              className="bg-blue-500 mt-4 "
              type="primary"
              htmlType="submit"
              onClick={!isViewMode ? handleSaveProduct : undefined}
            >
              SAVE
            </Button>
          </Form.Item>
        </Form>
      </>
    </ModalCustom>
  );
}

export default ModalEdit;
const FormCustom = styled(Form)`
  :where(
      .css-dev-only-do-not-override-1ae8k9u
    ).ant-input-filled.ant-input-disabled,
  :where(.css-dev-only-do-not-override-1ae8k9u).ant-input-filled[disabled] {
    color: #000;
  }
  :where(.css-dev-only-do-not-override-1ae8k9u).ant-input-number-disabled
    .ant-input-number-input,
  :where(.css-dev-only-do-not-override-1ae8k9u).ant-input-number-readonly
    .ant-input-number-input {
    color: #000;
  }
  :where(.css-dev-only-do-not-override-1ae8k9u).ant-checkbox-wrapper {
    color: #000;
  }
  :where(.css-dev-only-do-not-override-1ae8k9u).ant-checkbox-disabled + span {
    color: #000;
  }
  :where(.css-dev-only-do-not-override-1ae8k9u).ant-picker
    .ant-picker-input
    > input[disabled] {
    color: #000;
  }
`;
