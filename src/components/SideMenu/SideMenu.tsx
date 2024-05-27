import {
  AppstoreOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { FaStarHalfAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "../../App.css";
function SideMenu() {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");
  

 
  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  const navigate = useNavigate();
  return (
    <div className="SideMenu bg-[#4E73DF] px-[15px]">
      
        <div className="px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3]">
          <h1 className="text-white text-[20px] leading-[24px] font-extrabold cursor-pointer">
            Admin panel
          </h1>
        </div>
      
      <Menu
        className="SideMenuVertical bg-[#4E73DF] text-white"
        mode="inline"
        
        onClick={(item) => {
          //item.key
          navigate(item.key);
        }}
        selectedKeys={[selectedKeys]}
        items={[
          {
            label: "Dashboard",
            icon: <AppstoreOutlined />,
            key: "/admin",
          },
          {
            label: "Inventory",
            key: "/inventory",
            icon: <ShopOutlined />,
            children: [
              {
                label: "All Product",
                key: "/admin/inventory",
              },
              {
                label: "Type",
                key: "/admin/type",
              },
              {
                label: "Category",
                key: "/admin/category",
              },
              {
                label: "Add Product",
                key: "/admin/add",
              },
              
            ],
          },
          {
            label: "Orders",
            key: "/admin/order",
            icon: <ShoppingCartOutlined />,
          },
          {
            label: "Reviews",
            key: "/admin/review",
            icon: <FaStarHalfAlt  />,
          },
          {
            label: "Customers",
            key: "/customers",
            icon: <UserOutlined />,
            children: [
              {
                label: "All Customer",
                key: "/admin/customer",
              },
              {
                label: "Contact",
                key: "/admin/contact",
              },
              
            ],
          },
        ]}
      ></Menu>
      
    </div>
  );
}
export default SideMenu;
