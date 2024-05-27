import { Outlet } from "react-router-dom";
import Dashboard from "../../pages/Dashboard/Dashboard";

function PageContent() {
  return (
    <div className="w-full">
      <Dashboard />
      <div>
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default PageContent;
