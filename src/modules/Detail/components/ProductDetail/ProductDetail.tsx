import Loading from "@/components/Loading/Loading";
import { auth, db } from "@/firebase";
import { Product } from "@/types/Product";
import { Image } from "antd";
import { get, onValue, ref, update } from "firebase/database";
import moment from "moment";
import { useEffect, useState } from "react";
import { BsArrowLeftCircle, BsStarFill } from "react-icons/bs";
import { MdCategory } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { SITE_MAP } from "../../../../constants/site-map";
import { IComment } from "@/types/Comment";
function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [foodQuantity, setFoodQuantity] = useState(1);
  const [comments, setComments] = useState<IComment[]>([]);
  const [averageRating, setAverageRating] = useState(0);

  const handleDecrease = () => {
    if (foodQuantity > 1) {
      setFoodQuantity(foodQuantity - 1);
    }
  };

  const handleIncrease = () => {
    setFoodQuantity(foodQuantity + 1);
  };

  const ingredients = product?.foodIngredient.split(", ");
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const visibleIngredients = showAllIngredients
    ? ingredients
    : ingredients?.slice(0, 5);
  const hiddenIngredients = ingredients?.slice(5);
  const handleShowMoreIngredients = () => {
    setShowAllIngredients(!showAllIngredients);
  };
  useEffect(() => {
    const commentsRef = ref(db, "comments");
    onValue(commentsRef, (snapshot) => {
      const commentsData = snapshot.val();
      if (commentsData) {
        const commentsList = Object.entries(commentsData).map(
          ([key, value]) => ({
            key,
            ...value,
          })
        );
        const comment = commentsList.filter((cmt) => cmt.productID === id);
        setComments(comment);

        // console.log(comment);
        const totalRating = comment.reduce(
          (acc, comment) => acc + comment.star,
          0
        );
        const totalComments = comment.length;
        const averageRating = (Number(totalRating) / totalComments).toFixed(0);
        setAverageRating(Number(averageRating));
      } else {
        setComments([]);
      }
    });
  }, []);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const productRef = ref(db, `menu/${id}`);
          const snapshot = await get(productRef);
          if (snapshot.exists()) {
            const product = snapshot.val();
            setProduct(product as Product);
          } else {
            console.log("No such product!");
          }
        }
      } catch (error) {
        console.error("Error fetching product: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // console.log(product);
  const handleAddToCart = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const cartItemsRef = ref(db, `customer/${currentUser.uid}/CartItems`);
      const cartItemsSnapshot = await get(cartItemsRef);
      const currentCartItems = cartItemsSnapshot.val() || {};
      const cartItem = {
        ...product,
        foodQuantity,
      };
      const existingCartItem = currentCartItems[product?.key];
      if (existingCartItem) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng foodQuantity
        const updatedCartItem = {
          ...existingCartItem,
          foodQuantity: existingCartItem.foodQuantity + foodQuantity,
        };
        const updatedCartItems = {
          ...currentCartItems,
          [product?.key]: updatedCartItem,
        };
        await update(cartItemsRef, updatedCartItems);
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        const updatedCartItems = {
          ...currentCartItems,
          [product?.key]: cartItem,
        };
        await update(cartItemsRef, updatedCartItems);
      }
    }
  };
  const handleClickToShop = () => {
    navigate(SITE_MAP.SHOP.url);
  };
  const rating = averageRating;

  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(<BsStarFill color="#123829" key={i} />);
    } else {
      stars.push(<BsStarFill color="#c4c4c4" key={i} />);
    }
  }

  const calculateDiscountDetails = (
    endAt: number,
    discount: number,
    foodPrice: number
  ) => {
    const now = moment().unix(); // Lấy thời điểm hiện tại (Unix timestamp)
    const endTime = moment.unix(endAt).unix(); // Chuyển đổi endAt thành Unix timestamp

    let remainingTime = endTime - now; // Tính toán thời gian còn lại của khuyến mãi (giây)
    if (remainingTime < 0) {
      remainingTime = 0; // Nếu khuyến mãi đã hết hạn, gán remainingTime bằng 0
      discount = 0;
    }

    const discountedPrice = ((100 - discount) / 100) * Number(foodPrice); // Tính giá sản phẩm khi có giảm giá

    return { remainingTime, discountedPrice };
  };
  const { remainingTime, discountedPrice } = calculateDiscountDetails(
    // Number(product?.startAt),
    Number(product?.endAt),
    Number(product?.discount),
    Number(product?.foodPrice)
  );
  const formattedRemainingTime = moment
    .unix(remainingTime)
    .format("DD [days] HH [hours] mm [minutes]");
  const isDiscounted = remainingTime > 0 && product.discount > 0;

  return (
    <div className="container mx-auto">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div>
            <a
              className="flex gap-2 text-[22px] cursor-pointer mb-10 text-[#e85353]"
              onClick={handleClickToShop}
            >
              <span>
                <BsArrowLeftCircle />
              </span>
              Back to Shop
            </a>
          </div>
          <div className="flex gap-10 mt-10">
            {/* left */}
            <div className="w-[40%]">
              <div className="flex flex-col gap-5">
                <div className="flex gap-10 ">
                  <span className="text-[#123829] font-semibold">Rating</span>
                  <div className="flex gap-5">
                    <div className="flex gap-1">{stars}</div>
                  </div>
                  {isDiscounted && (
                    <>
                      <div className="flex justify-center bg-gradient-to-br from-[#E85353] to-[#BE1515] w-[320px] h-[38px] text-[#222] px-4 py-2 rounded-md  items-center">
                        <span className="mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            color="#fff"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>

                        <span className="text-white">
                          {formattedRemainingTime}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                {/* tilte */}
                <div>
                  <h1 className="text-[#123829] font-semibold">
                    {product?.foodName}
                  </h1>
                </div>
                {/* category */}
                <div className="flex gap-2 text-[18px] items-center text-[#123829]">
                  <MdCategory /> {product?.categoryId}
                </div>
                {/* Description */}
                <div>
                  <p className="text-[#123829] text-xl font-medium leading-7">
                    {product?.foodDescription}
                  </p>
                </div>
                {/* Quantity adn price */}
                <div className="">
                  <div>
                    <p className="text-[#123829]">Quantity</p>
                  </div>
                  <div className="flex gap-28 items-end">
                    <div className="w-[60%] text-[20px] rounded-[20px] mt-1 p-2 max-w-[80px] border-solid border-[1px] border-[#123829 flex justify-between">
                      <p className="cursor-pointer" onClick={handleDecrease}>
                        -
                      </p>
                      <p>{foodQuantity}</p>
                      <p className="cursor-pointer" onClick={handleIncrease}>
                        +
                      </p>
                    </div>
                    <div className="text-[#123829] text-[25px] font-semibold">
                      {discountedPrice} đ
                    </div>
                  </div>
                </div>
                {/* button */}
                <div className="flex gap-10">
                  <div
                    className="bg-gradient-to-br from-[#E85353] to-[#BE1515] cursor-pointer hover:ease-in-out duration-300 hover:translate-y-[-10px] hover: text-[#fff1d8] px-5 py-3 rounded-[20px]"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </div>
                  <div className="border-solid border-[1px] border-[#BE1515] text-[#BE1515] cursor-pointer hover:ease-in-out duration-300 hover:translate-y-[-10px] hover:  px-5 py-3 rounded-[20px]">
                    Buy it now
                  </div>
                </div>
              </div>
            </div>
            {/* right */}
            <div>
              <div className="flex gap-2 text-[#BE1515] text-[30px] relative bottom-10 left-[90%]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="23"
                  viewBox="0 0 24 23"
                  fill="none"
                >
                  <path
                    d="M5.0275 16.7286C4.72268 15.8153 4.5594 15.0445 4.20548 14.3746C4.00576 13.9969 3.45693 13.5125 3.12693 13.5542C2.39435 13.6471 2.40438 14.3402 2.58701 14.9164C3.20648 16.8732 3.81827 18.8343 4.51705 20.7639C4.85469 21.6972 5.64095 21.8978 6.43863 21.2438C8.02661 19.9444 9.56882 18.5856 11.0687 17.1855C11.3047 16.9654 11.2205 16.4024 11.2843 15.9981C10.8719 15.9696 10.339 15.7635 10.0701 15.9462C9.03802 16.6474 8.09097 17.4733 6.87908 18.4384C7.00228 17.8346 7.01857 17.4637 7.15284 17.142C8.5573 13.7757 11.0927 11.4689 14.2006 9.72196C16.2515 8.58497 18.4919 7.83024 20.8128 7.49456C22.3604 7.25704 22.8093 6.93909 22.6379 6.24225C22.4805 5.60103 21.9185 5.38722 20.5793 5.6248C13.935 6.80318 8.58367 9.85535 5.48514 16.1355C5.34672 16.3437 5.19379 16.5419 5.0275 16.7286Z"
                    fill="#BE1515"
                  ></path>
                </svg>
                Today baked
              </div>
              <Image
                loading="lazy"
                width="500px"
                height="333px"
                src={product?.foodImage}
              />
            </div>
            {/*  */}
            <div>
              <div className="p-4">
                <h2 className="ml-4 text-2xl font-bold">INGREDIENTS</h2>
                <table className="w-full">
                  <tbody>
                    {visibleIngredients.map((ingre, index) => (
                      <tr key={index} className="">
                        <td className="py-2 px-4 border-solid border-b border-t border-r border-red-400">
                          <span className="text-[#123829] dark:text-zinc-200 text-lg">
                            {ingre}
                          </span>
                        </td>
                        <td className="py-2 px-6 border-solid border-b border-t border-red-400"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {hiddenIngredients.length > 0 && (
                  <button
                    onClick={handleShowMoreIngredients}
                    className="mt-4 bg-gradient-to-br from-[#E85353] to-[#BE1515] cursor-pointer text-white"
                  >
                    {!showAllIngredients ? "More" : "Close"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProductDetail;
