interface Route {
  url: string;
  title: string;
  roles?: string[];
}

interface SiteMap {
  [key: string]: Route;
}

export const SITE_MAP: SiteMap = {
  HOME: {
    url: "/",
    title: "Home",
  },
  ABOUT: {
    url: "/about",
    title: "About",
  },
  CART: {
    url: "/cart",
    title: "Cart",
  },
  SHOP: {
    url: "/shop",
    title: "Shop",
  },
  PRODUCT: {
    url: "/product/:id",
    title: "Product",
  },
  WISHLIST: {
    url: "/wishlist",
    title: "Wishlist",
  },
  
  SEARCH: {
    url: "/search",
    title: "Search",
  },
  SHOWCART: {
    url: "/show",
    title: "Show",
  },

  CONTACT: {
    url: "/contact",
    title: "Contact",
  },
  LOGIN: {
    url: "/login",
    title: "Login",
  },
  HISTORY: {
    url: "/history",
    title: "history",
    roles: ["user"],
  },
  ACCOUNT: {
    url: "/account/",
    title: "account",
    roles: ["user"],
  },
  CHECKOUT: {
    url: "/checkout",
    title: "checkout",
    roles: ["user"],
  },
  ADMIN: {
    url: "/admin",
    title: "Admin",
    roles: ["admin"],
  },
  ADMIN_LOGIN: {
    url: "/admin/login",
    title: "Login",
  },
  DASHBOARD: {
    url: "/admin",
    title: "Dashboard",
  },
  INVENTORY: {
    url: "/admin/inventory",
    title: "Inventory",
  },
  ADD: {
    url: "/admin/add",
    title: "Inventory",
  },
  ORDER: {
    url: "/admin/order",
    title: "Order",
  },
  ORDERDETAIL: {
    url: "/admin/order/:id",
    title: "Order Detail",
  },
  REVIEW: {
    url: "/admin/review",
    title: "Revviews",
  },
  TYPE: {
    url: "/admin/type",
    title: "Type",
  },
  CATEGORY: {
    url: "/admin/category",
    title: "Category",
  },
  CUSTOMER: {
    url: "/admin/customer",
    title: "Customer",
  },
  CONTACTCUSTOMER: {
    url: "/admin/contact",
    title: "Contact",
  },
  PROFILE: {
    url: "/admin/profile",
    title: "Profile",
  },
};
