import AdminLogin from "@/components/AdminLogin/AdminLogin";
import { RootStatesType } from "@/stores";
import { notification } from "antd";
import { useSelector } from "react-redux";
interface IProps {
  children: React.ReactNode;
}

function PrivateAdminLayout({ children }: IProps) {
  const adminStore = useSelector((state: RootStatesType) => state.admin);
  if (adminStore.token) return <>{children}</>;
  else {
    notification.info({
      message: "vui lòng đăng nhập!",
    });
    // return <Navigate to={SITE_MAP.ADMIN_LOGIN.url} />;
    return <AdminLogin/>
  }
}

export default PrivateAdminLayout;
