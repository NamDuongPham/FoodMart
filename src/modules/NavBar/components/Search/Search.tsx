import { db } from "@/firebase";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
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
          const products = Object.entries(data).map(([key, value]) => ({
            key,
            ...value,
          }));
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
  const handleDetail =(productId: string)=>{
    navigate(`/product/${productId}`);
  }
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    const filteredProducts = product.filter((product) =>
      product.foodName.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSearchResults(filteredProducts);
    setSearchTerm(searchValue);
  };
  const handleSearch = () => {
    if (searchResults.length > 0) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };
  return (
    <>
      <div className="w-[552px] h-[49px] bg-[#f9f9f9]   border boderr-[#f8f8f8] rounded-[4px]">
        <div className="flex justify-between items-center">
          <input
            className="w-[552px] h-[49px] text-[20px] py-[13px] pl-[25px] bg-[#f9f9f9] outline-none"
            type="text"
            placeholder="Search for more than 20,000 products"
            onChange={handleSearchChange}
            value={searchTerm}
          ></input>
          <BiSearch
            color="#222222"
            className="mr-[18px] w-[20px] h-[20px] cursor-pointer"
            onClick={handleSearch}
          />
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
        </div>
      </div>
    </>
  );
}

export default Search;
