import { db } from "@/firebase";
import { Form, Input, Select, Spin } from "antd";
import { format } from "date-fns";
import { get, ref } from "firebase/database";
import { SetStateAction, useEffect, useState } from "react";
import { ImSpinner11 } from "react-icons/im";
import "../../App.css";
import TableProduct from "./Table/Table";
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
interface Category {
  key: React.Key;
  category_name: string;
}
interface TypeOfDish {
  typeOfDishName: string;
  image: string;
}
function Inventory() {
  const [product, setProduct] = useState<DataType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [type, setType] = useState<TypeOfDish[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inventoryFilter, setInventoryFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sellerFilter, setSellerFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<DataType[]>([]);
  const handleSearchChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearchTerm(e.target.value);
    const filteredProducts = product.filter((product) =>
      product.foodName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredProducts);
  };

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
  const fetchFood = async () => {
    setIsLoading(true);
    try {
      const dbRef = ref(db, "menu");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const products = Object.keys(data).map((key) => {
          return Object.assign({ key: key }, data[key]) as DataType;
        });
        setProduct(products);
      } else throw new Error("No foods found!");
    } catch (error) {
      console.error("Error fetching foods: ", error);
    } finally {
      setIsLoading(false); // Kết thúc tải dữ liệu, đặt isLoading thành false
    }
  };

  // console.log(product);
  useEffect(() => {
    fetchType();
    fetchFood();
    fetchCategories();
  }, []);
  const filteredProduct = product.filter((item) => {
    // Lọc theo tìm kiếm tên sản phẩm
    const isNameMatch = item.foodName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Lọc theo inventory
    const isInventoryMatch =
      (inventoryFilter === "1" && item.inStock) ||
      (inventoryFilter === "2" && !item.inStock) ||
      inventoryFilter === "";

    // Lọc theo category
    const isCategoryMatch = categoryFilter
      ? item.categoryId === categoryFilter
      : true;

    // Lọc theo type
    const isTypeMatch = typeFilter ? item.typeOfDishId === typeFilter : true;

    // Lọc theo seller
    const isSellerMatch =
      (sellerFilter === "bestSeller" && item.bestSeller) ||
      (sellerFilter === "trending" && item.trending) ||
      sellerFilter === "";

    return (
      isNameMatch &&
      isInventoryMatch &&
      isCategoryMatch &&
      isTypeMatch &&
      isSellerMatch
    );
  });
  const mappedProduct = filteredProduct.map((item) => ({
    key: item.key, // Hoặc một giá trị duy nhất khác để làm key
    foodName: item.foodName,
    foodImage: item.foodImage,
    inStock: item.inStock ? "In Stock" : "Out of Stock",
    foodPrice: parseFloat(item.foodPrice),
    foodDescription: item.foodDescription,
    foodIngredient: item.foodIngredient,
    categoryId: item.categoryId,
    typeOfDishId: item.typeOfDishId,
    star: 0,
    discount: item.discount,
    createAt: item.createAt,
    startAt: item.startAt,
    endAt: item.endAt,
    tags: [
      item.bestSeller ? "Best Seller" : "",
      item.trending ? "Trending" : "",
    ],
  }));
  // console.log(mappedProduct);

  const clearHandle = () => {
    setInventoryFilter("");
    setCategoryFilter("");
    setSellerFilter("");
    setTypeFilter("");
    fetchFood();
  };
  return (
    <>
      <div
        className="card no-hover flex flex-col gap-5 !p-5 md:!p-[26px] lg:!py-5 lg:flex-row
           lg:items-center lg:gap-4 bg-white m-3 rounded-lg"
      >
        <h1 className="flex-1 text-center lg:text-left">Products Management</h1>
        <button
          className="group hidden w-fit xl:flex items-center gap-2 font-heading font-semibold
                  text-header text-sm"
          onClick={() => {
            fetchFood();
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
      {/* ADD & SEARCH*/}
      <div className="md:!p-[26px] flex justify-between items-center">
        <button className="bg-[#02a189] text-white rounded-[30px] px-10 font-bold shadow-lg shadow-[#02caab59]">
          Add new product
        </button>
        <div>
          <Input
            value={searchTerm}
            className="w-[300px] h-[40px]"
            placeholder="Search product"
            onChange={handleSearchChange}
          />
        </div>
      </div>
      {/* FILTER */}
      <div className="md:mb-[26px] md:!p-[26px] lg:!py-1 flex justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-xl">Inventory</div>
          <Select
            value={inventoryFilter}
            onChange={(value) => setInventoryFilter(value)}
            showSearch
            style={{ width: 200, height: 50, fontSize: "20px" }}
            placeholder={<span>Inventory</span>}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.value ?? "").includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.value ?? "")
                .toLowerCase()
                .localeCompare((optionB?.value ?? "").toLowerCase())
            }
            options={[
              {
                value: "1",
                label: "In Stock",
              },
              {
                value: "2",
                label: "Out of Stock",
              },
            ]}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-xl">Category</div>
          <Select
            value={categoryFilter}
            onChange={(value) => setCategoryFilter(value)}
            showSearch
            style={{ width: 200, height: 50, fontSize: "20px" }}
            placeholder="Product Category"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={categories.map((category) => ({
              value: category.category_name,
              label: category.category_name,
            }))}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-xl">Type</div>
          <Select
            value={typeFilter}
            onChange={(value) => setTypeFilter(value)}
            showSearch
            style={{ width: 200, height: 50, fontSize: "20px" }}
            placeholder="Product Type"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={type.map((t) => ({
              value: t.typeOfDishName,
              label: t.typeOfDishName,
            }))}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-xl">Best seller/ Trending</div>
          <Select
            value={sellerFilter}
            onChange={(value) => setSellerFilter(value)}
            showSearch
            style={{ width: 200, height: 50, fontSize: "20px" }}
            placeholder="Product Selller"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={[
              {
                value: "1",
                label: "Best Seller",
              },
              {
                value: "2",
                label: "Trending",
              },
            ]}
          />
        </div>
        <div className=" flex flex-col justify-center">
          {/* <button className="bg-[#035ecf] text-white rounded-[30px] px-10">
            Apply
          </button> */}
          <button
            className="bg-[#fff] text-[#035ecf] rounded-[30px] px-10"
            onClick={() => {
              clearHandle();
            }}
          >
            Clear
          </button>
        </div>
      </div>
      {/* TABLE */}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spin tip="Loading..." /> {/* Hiển thị component Spin của antd */}
        </div>
      ) : (
        <TableProduct product={mappedProduct} />
      )}
    </>
  );
}

export default Inventory;
