import { auth, db } from "@/firebase";
import { Product } from "@/types/Product";
import { get, ref, set, update } from "firebase/database";
import { BsCartFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import "./Type.css";
import { notification } from "antd";
interface IProduct {
  product: Product;
}
function TypeItem(props: IProduct) {
  const { product } = props;

  const navigate = useNavigate();

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
  const handleAddToCart = async (product: Product) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const cartItemsRef = ref(db, `customer/${currentUser.uid}/CartItems`);
        const cartItemsSnapshot = await get(cartItemsRef);
        const cartItem = {
          ...product,
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
              message: "Add succes please check cart!",
            });
          } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
            const updatedCartItems = {
              ...currentCartItems,
              [product?.key]: cartItem,
            };
            await update(cartItemsRef, updatedCartItems);
            notification.success({
              message: "Add succes please check cart!",
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
        className=" mt-10 cursor-pointer hover:translate-y-[-25px] transition duration-500 ease-in-out hover:scale-100 hover:rotate-0"
        onClick={() => {
          handleProductClick(product.key.toString());
        }}
      >
        <div className="border-solid border-[1px] border-[#e6e6e6] rounded-[8px] max-w-[350px]">
          <img
            src={product.foodImage}
            alt={product.foodName}
            className="rounded-[8px] object-cover h-[250px] w-[100%]"
          />
          <h3 className="text-center text-[#345529] font-semibold text-[22px] my-2">
            {product.foodName}
          </h3>
          <div className="flex items-center text-[22px] text-white rounded-tr-[8px] rounded-bl-[8px]">
            <div>
              <p className="bg-[#345529] px-[10px] rounded-bl-[8px]">
                {product.foodPrice}đ
              </p>
            </div>
            <div
              className="px-[10px] py-[6px] bg-[#c0c906] rounded-tr-[8px]"
              onClick={() => {
                handleAddToCart(product);
              }}
            >
              <BsCartFill />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TypeItem;
