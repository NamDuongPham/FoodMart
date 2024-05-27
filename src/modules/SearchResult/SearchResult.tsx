import { BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SITE_MAP } from "../../constants/site-map";
import { useTitle } from "../../hooks/useTitle";
import ProductList from "../Product/components/ProductList";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading/Loading";
import { get, ref } from "firebase/database";
import { db } from "@/firebase";
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
function SearchResult() {
  const [product, setProduct] = useState<DataType[]>([]);
  useEffect(() => {
    // Fetch data from Firebase Realtime Database
    const fetchFood = async () => {
      try {
        const dbRef = ref(db, "menu");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
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
  //useTitle(SITE_MAP.SEARCH.title);
  const navigate = useNavigate();
  const handleClickToHome = () => {
    navigate(SITE_MAP.HOME.url);
  };
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") || "";
  useTitle(searchTerm ? `Search: ${searchTerm}` : SITE_MAP.SEARCH.title);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <section className="bg-[#fff1d8] mt-10 py-[70px] text-[#123829]">
            <div className="container mx-auto">
              <div>
                <div>
                  <a
                    className="flex gap-2 text-[22px] cursor-pointer mb-10 text-[#e85353]"
                    onClick={handleClickToHome}
                  >
                    <span>
                      <BsArrowLeftCircle />
                    </span>
                    Back to Home
                  </a>
                  <div className="text-[40px] font-bold mb-[12px]">
                    <h2>Search Results</h2>
                  </div>
                  <p>
                    Welcome to our Search Page, where you can explore a vast
                    array of information, products, and resources with just a
                    few clicks.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <div className="container mx-auto">
            <p className="text-center text-[20px] text-[#123829] mt-3">
              2 results found for “{searchTerm}”
            </p>
            <div className="mt-10">
              <ProductList
                product={product.filter((product) =>
                  product.foodName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchResult;
