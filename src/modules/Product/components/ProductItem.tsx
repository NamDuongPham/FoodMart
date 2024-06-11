import { auth, db } from "@/firebase";
import { RootStatesType } from "@/stores";
import { Product } from "@/types/Product";
import { notification } from "antd";
import "aos/dist/aos.css";
import { get, ref, set, update } from "firebase/database";
import { FaShareAlt, FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FacebookShareButton } from "react-share";

interface IProduct {
  product: Product;
}

function ProductItem(props: IProduct) {
  const navigate = useNavigate();
  const { product } = props;

  const discount = Math.round(
    ((100 - product.discount) / 100) * Number(product.foodPrice)
  );
  const discountPrice = discount.toLocaleString("vi-VN") + "đ";
  const handleProductClick = async (productId: string) => {
    try {
      const currentTimestamp = Date.now();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const customerRef = ref(db, `customer/${currentUser.uid}`);
        const customerSnapshot = await get(customerRef);

        if (customerSnapshot.exists()) {
          const currentViews = customerSnapshot.val().viewAt || {};
          const existingView = currentViews[productId];

          if (existingView) {
            // Cập nhật timestamp của lượt xem hiện có
            currentViews[productId].time = currentTimestamp;
            await update(customerRef, { viewAt: currentViews });
          } else {
            // Thêm lượt xem mới
            await update(customerRef, {
              viewAt: {
                ...currentViews,
                [productId]: {
                  foodId: productId,
                  time: currentTimestamp,
                },
              },
            });
          }
        } else {
          // Thêm lượt xem mới
          await update(customerRef, {
            viewAt: {
              [productId]: {
                foodId: productId,
                time: currentTimestamp,
              },
            },
          });
        }

        // Chuyển hướng đến trang chi tiết sản phẩm
        navigate(`/product/${productId}`);
      } else {
        // Người dùng chưa đăng nhập, vẫn cho phép chuyển hướng đến trang chi tiết sản phẩm
        navigate(`/product/${productId}`);
        return;
      }
    } catch (error) {
      console.error("Error updating viewAt:", error);
    }
  };
  const userStore = useSelector((state: RootStatesType) => state.user);

  const handleAddToCart = async (product: Product) => {
    try {
      const currentUser = auth.currentUser;
      if (userStore.token) {
        const cartItemsRef = ref(db, `customer/${currentUser?.uid}/CartItems`);
        const cartItemsSnapshot = await get(cartItemsRef);
        const cartItem = {
          foodName: product.foodName,
          foodImage: product.foodImage,
          foodPrice: product.foodPrice,
          foodDiscount: product.discount,
          category: product.categoryId,
          typeOfDish: product.typeOfDishId,
          foodDescription: product.foodDescription,
          foodIngredient: product.foodIngredient,
          foodQuantity: 1,
        };
        if (!cartItemsSnapshot.exists()) {
          // Tạo mới giỏ hàng nếu chưa có
          await set(cartItemsRef, {
            [product?.key]: cartItem,
          });
        } else {
          // Cập nhật giỏ hàng nếu đã có
          const currentCartItems = cartItemsSnapshot.val();
          const existingCartItem = currentCartItems[product?.key];
          // const updatedCartItems = {
          //   ...currentCartItems,
          //   [product?.key]: product,
          // };
          if (existingCartItem) {
            // Nếu sản phẩm đã có trong giỏ hàng, tăng quantity
            const updatedCartItem = {
              ...existingCartItem,
              foodQuantity: existingCartItem.foodQuantity + 1,
            };
            const updatedCartItems = {
              ...currentCartItems,
              [product?.key]: updatedCartItem,
            };
            await update(cartItemsRef, updatedCartItems);
            notification.success({
              message: "Add success, please check cart!",
            });
          } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
            const updatedCartItems = {
              ...currentCartItems,
              [product?.key]: cartItem,
            };
            await update(cartItemsRef, updatedCartItems);
            notification.success({
              message: "Add success, please check cart!",
            });
          }
        }
      } else {
        // dispatch(addToCart(product));
        // Người dùng chưa đăng nhập, không thể thêm vào giỏ hàng
        notification.info({
          message: "Người dùng chưa đăng nhập, không thể thêm vào giỏ hàng.",
        });
        console.error(
          "Người dùng chưa đăng nhập, không thể thêm vào giỏ hàng."
        );
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    }
  };
  return (
    <>
      <div
        data-aos="flip-left"
        className="hover:translate-y-[-25px] transition duration-500 ease-in-out hover:scale-100 hover:rotate-0 cursor-pointer product-item p-[16px] bg-[#fff] border border-[#fbfbfb] rounded-[12px] shadow-[0_5px_22px_0_rgba(0,0,0,0.08)]"
      >
        <div className="bg-[#f9f9f9] rounded-[12px] flex justify-center relative">
          <div className="cursor-pointer absolute top-[5px] right-[5px] bg-[#fff] border border-[#eaeaea] rounded-full flex justify-center p-[5px]">
            <FacebookShareButton
              url={`https://3537-2405-4802-9074-9d0-e09b-2b4-1e7e-80b0.ngrok-free.app//product/${product.key}`}
            >
              <FaShareAlt color="#EF2525" />
            </FacebookShareButton>
          </div>
          <div className="absolute rounded-[4px] flex justify-center items-center h-[20px] w-[44px] text-[12px] top-[5px] left-[5px] bg-[#a3bf4c] p-[4px] text-white">
            {product.discount}%
          </div>
          <img src={product.foodImage} className="w-[235px] h-[220px]" />
        </div>
        <div
          className="product-info" 
          onClick={() => {
            handleProductClick(product.key.toString());
          }}
        >
          <h3 className="product-name text-[#ffa801] text-[18px] font-semibold">
            {product.foodName}
          </h3>
          {/* rate */}
          <div className="flex flex-row gap-5">
            <p className="text-[#9d9d9d] text-[13px]">1 item</p>
          </div>
          {/* price */}
          <div className="flex flex-row gap-5 items-end ">
            <p className="product-price font-semibold text-[#a8a8a8] text-[16px] line-through">
              {product.foodPrice}đ
            </p>
            <p className="product-price font-semibold text-[#222] text-[20px]">
              {discountPrice}
            </p>
          </div>
        </div>
        {/* button */}
        <div className="flex flex-row gap-3 items-center">
          <div
            className="text-[#787878] text-[15px] flex items-center gap-2 cursor-pointer hover:text-red-500"
            onClick={() => {
              handleAddToCart(product);
            }}
          >
            ADD TO CART
            <FaShoppingCart />
          </div>
        </div>
      </div>
    </>
  );
}
export default ProductItem;
