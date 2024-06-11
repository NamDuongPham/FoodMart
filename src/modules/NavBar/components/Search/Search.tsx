import { db } from "@/firebase";
import { RootStatesType } from "@/stores";
import {
  SearchType,
  deleteSearch,
  updateSearch,
} from "@/stores/slices/SearchSlice";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { IoArrowRedoOutline } from "react-icons/io5";
import { TiDeleteOutline } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
}
function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [product, setProduct] = useState<DataType[]>([]);
  const [searchResults, setSearchResults] = useState<DataType[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from Firebase Realtime Database
    const fetchFood = async () => {
      try {
        const dbRef = ref(db, "menu");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          // const products = Object.entries(data).map(([key, value]) => ({
          //   key,
          //   ...value,
          // }));
          const products = Object.keys(data).map((key) => {
            return Object.assign({ key: key }, data[key]) as DataType;
          });
          setProduct(products);
        } else {
          throw new Error("No foods found!");
        }
      } catch (error) {
        console.error("Error fetching foods: ", error);
      }
    };

    fetchFood();
  }, []);
  const handleDetail = (productId: string) => {
    navigate(`/product/${productId}`);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFocused(false);
    const searchValue = e.target.value;
    const filteredProducts = product.filter((product) =>
      product.foodName.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSearchResults(filteredProducts);
    setSearchTerm(searchValue);
  };

  const searchStore = useSelector((state: RootStatesType) => state.search);

  const handleFocus = () => {
    setIsFocused(!isFocused);
  };
  const handleDeleteSearch = (recentProduct: string) => {
    dispatch(deleteSearch(recentProduct));
  };
  const dispatch = useDispatch();

  const handleSearch = () => {
    if (searchResults.length > 0) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
      dispatch(
        updateSearch({
          name: searchTerm,
          searchAt: new Date().getTime(),
        })
      );
    }
  };
  const handleSearchDraf = (value: string) => {
    navigate(`/search?q=${encodeURIComponent(value)}`);
    setSearchTerm("");
  };
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e);

    if (e.key === "ArrowUp" && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setSearchTerm(searchResults[selectedIndex - 1].foodName);
    } else if (
      e.key === "ArrowDown" &&
      selectedIndex < searchResults.length - 1
    ) {
      setSelectedIndex(selectedIndex + 1);
      setSearchTerm(searchResults[selectedIndex + 1].foodName);
    } else if (e.key === "Enter" && selectedIndex !== -1) {
      handleDetail(searchResults[selectedIndex].key.toString());
    }
  };
  return (
    <>
      <div className="w-[552px] h-[49px] bg-[#f9f9f9] border boderr-[#f8f8f8] rounded-[4px]">
        <div className="flex justify-between items-center">
          <input
            className="w-[552px] h-[49px] text-[20px] py-[13px] pl-[25px] bg-[#f9f9f9] outline-none"
            type="text"
            placeholder={`Search for more than ${product.length} products`}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            value={searchTerm}
          ></input>
          {!isFocused ? (
            <BiSearch
              color="#222222"
              className="mr-[18px] w-[20px] h-[20px] cursor-pointer"
              onClick={handleSearch}
            />
          ) : (
            <IoArrowRedoOutline
              color="#222222"
              className="mr-[18px] w-[20px] h-[20px] cursor-pointer"
              onClick={() => setIsFocused(!isFocused)}
            />
          )}
        </div>
        <div className="">
          {searchResults.length > 0 && searchTerm.trim() !== "" && (
            <ul className="relative w-[552px] bg-white border border-gray-200 rounded-b-lg shadow-md z-20">
              {searchResults.map((product) => (
                <li
                  key={product.key}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    handleDetail(product.key.toString());
                  }}
                >
                  <div className="flex items-center">
                    <img
                      src={product.foodImage}
                      alt={product.foodName}
                      className="w-12 h-12 object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {product.foodName}
                      </h3>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {isFocused && (
            <ul className="relative w-[552px] bg-white border border-gray-200 rounded-b-lg shadow-md z-20">
              {searchStore.searches
                ?.sort(
                  (a: SearchType, b: SearchType) => b.searchAt - a.searchAt
                )
                .map((recentProduct: SearchType, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="flex items-center justify-between w-full">
                        <h3
                          className="text-lg font-semibold"
                          onClick={() => {
                            handleSearchDraf(recentProduct.name);
                          }}
                        >
                          {recentProduct.name}
                        </h3>
                        <span
                          onClick={() => handleDeleteSearch(recentProduct.name)}
                        >
                          <TiDeleteOutline />
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default Search;
