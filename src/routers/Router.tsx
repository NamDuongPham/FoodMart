import { Route, Routes } from "react-router-dom";
import MainAdmin from "../components/MainAdmin/MainAdmin";
import { SITE_MAP } from "../constants/site-map";
import AdminLayout from "../layouts/admin.layout";
import DefaultLayout from "../layouts/default.layout";
import ShowCart from "../modules/Cart/ShowCart";
import AboutPage from "../pages/About/AboutPage";
import AccountPage from "../pages/Account/AccountPage";
import CartPage from "../pages/Cart/CartPage";
import CheckoutPage from "../pages/Checkout/CheckoutPage";
import ContactPage from "../pages/Contact/ContactPage";
import DetailPage from "../pages/Detail/DetailPage";
import HomePage from "../pages/Home/HomePage";
import NotFound from "../pages/NotFound/NotFound";
import SearchPage from "../pages/Search/SearchPage";
import ShopPage from "../pages/Shop/ShopPage";
import WishlistPage from "../pages/Wishlist/WishlistPage";
import Inventory from "../components/Inventory/Inventory";
import OrderAdmin from "../components/OrderAdmin/OrderAdmin";
import ReviewsAdmin from "../components/ReviewsAdmin/ReviewsAdmin";
import OrderDetailAdmin from "../components/OrderAdmin/OrderDetailAdmin";
import Profile from "../components/Profile/Profile";
import PrivateLayout from "@/layouts/private.layout";
import CustomerAdmin from "@/components/CustomerAdmin/CustomerAdmin";
import ContactAdmin from "@/components/CustomerAdmin/ContactAdmin";
import AddProduct from "@/components/AddProduct/AddProduct";
import TypeAdmin from "../components/Inventory/Type/TypeAdmin";
import CategoryAdmin from "@/components/Inventory/Category/CategoryAdmin";
import PrivateAdminLayout from "@/layouts/privateAdmin.layout";
import AdminLogin from "@/components/AdminLogin/AdminLogin";

export const Router = () => {
  return (
    <Routes>
      <Route path={SITE_MAP.HOME.url} element={<DefaultLayout />}>
        <Route path={SITE_MAP.HOME.url} element={<HomePage />} />
        <Route path={SITE_MAP.SHOP.url} element={<ShopPage />} />
        <Route path={SITE_MAP.ABOUT.url} element={<AboutPage />} />
        <Route path={SITE_MAP.CONTACT.url} element={<ContactPage />} />
        <Route path={SITE_MAP.PRODUCT.url} element={<DetailPage />} />
        <Route path={SITE_MAP.SHOWCART.url} element={<ShowCart />} />
        <Route path={SITE_MAP.SEARCH.url} element={<SearchPage />} />
      </Route>

      <Route
        path={SITE_MAP.HOME.url}
        element={<PrivateLayout children={<DefaultLayout />} />}
      >
        <Route path={SITE_MAP.WISHLIST.url} element={<WishlistPage />} />
        <Route path={SITE_MAP.CART.url} element={<CartPage />} />
        <Route path={SITE_MAP.CHECKOUT.url} element={<CheckoutPage />} />
        <Route path={SITE_MAP.ACCOUNT.url} element={<AccountPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />

      {/* <-------------layout admin--------------------> */}
      <Route
        path={SITE_MAP.ADMIN.url}
        element={<PrivateAdminLayout children={<AdminLayout />} />}
      >
        <Route path={SITE_MAP.ADMIN_LOGIN.url} element={<AdminLogin />} />
        <Route path={SITE_MAP.ADMIN.url} element={<MainAdmin />} />
        <Route path={SITE_MAP.INVENTORY.url} element={<Inventory />} />
        <Route path={SITE_MAP.ADD.url} element={<AddProduct />} />
        <Route path={SITE_MAP.TYPE.url} element={<TypeAdmin />} />
        <Route path={SITE_MAP.CATEGORY.url} element={<CategoryAdmin />} />
        <Route path={SITE_MAP.ORDER.url} element={<OrderAdmin />} />
        <Route path={SITE_MAP.ORDERDETAIL.url} element={<OrderDetailAdmin />} />
        <Route path={SITE_MAP.REVIEW.url} element={<ReviewsAdmin />} />
        <Route path={SITE_MAP.PROFILE.url} element={<Profile />} />
        <Route path={SITE_MAP.CUSTOMER.url} element={<CustomerAdmin />} />
        <Route path={SITE_MAP.CONTACTCUSTOMER.url} element={<ContactAdmin />} />
      </Route>
    </Routes>
  );
};
