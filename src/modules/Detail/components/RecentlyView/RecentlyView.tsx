import { auth, db } from "@/firebase";
import { Product } from "@/types/Product";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RecentlyView() {
  const [currentUserViewedProducts, setCurrentUserViewedProducts] = useState<
    Product[]
  >([]);

  useEffect(() => {
    const fetchCurrentUserViewedProducts = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const customerRef = ref(db, `customer/${currentUser.uid}/viewAt`);
          const customerSnapshot = await get(customerRef);
          if (customerSnapshot.exists()) {
            const viewedProductIds = Object.keys(customerSnapshot.val());
            const dbRef = ref(db, "menu");
            const menuSnapshot = await get(dbRef);
            if (menuSnapshot.exists()) {
              const menuData = menuSnapshot.val();
              const viewedProducts = viewedProductIds
                .map((productId) => ({
                  key: productId,
                  ...menuData[productId],
                }))
                .sort((a, b) => {
                  const aTime = customerSnapshot.val()[a.key].time;
                  const bTime = customerSnapshot.val()[b.key].time;
                  return bTime - aTime;
                })
                .slice(0, 5);
              setCurrentUserViewedProducts(viewedProducts);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching current user viewed products: ", error);
      }
    };

    fetchCurrentUserViewedProducts();
  }, []);
  const navigate = useNavigate();

  const handleProductClick = (productId:string) => {
    navigate(`/product/${productId}`);
  };
  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-[#123829] font-bold">Recently Viewed Products</h1>

      <div className="mt-[50px] flex flex-row justify-start gap-3 items-center">
        {currentUserViewedProducts.map((product) => (
          <>
            <div className="border-solid border-[1px] border-[#e6e6e6] rounded-[8px] max-w-[350px] hover:translate-y-[-25px] transition duration-500 ease-in-out hover:scale-100 hover:rotate-0 hover:cursor-pointer"
            onClick={() => handleProductClick(product.key.toString())}
            >
              <img
                src={product.foodImage}
                alt={product.foodName}
                className="rounded-[8px] object-cover h-[250px] w-[100%]"
              />
              <h3 className="text-center text-[#345529] font-semibold text-[22px] my-2">
                {product.foodName}
              </h3>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

export default RecentlyView;
