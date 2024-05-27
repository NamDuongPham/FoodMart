import { Outlet } from "react-router-dom";
import SideMenu from "../components/SideMenu/SideMenu";
import Dashboard from "../pages/Dashboard/Dashboard";

function AdminLayout() {
  return (
    <div className="SideMenuAndPageContent">
      <div className="basis-[12%] h-[100vh]">
        <SideMenu></SideMenu>
      </div>
      <div className="basis-[88%] border overflow-scroll h-[100vh]">
        <Dashboard />
        <div>
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
