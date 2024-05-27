import { useSelector } from "react-redux";
import { RootStatesType } from "@/stores";
import { Navigate } from "react-router-dom";
import { notification } from "antd";
import { SITE_MAP } from "@/constants/site-map";
interface IProps {
  children: React.ReactNode;
}
function PrivateLayout({ children }: IProps) {
  const userStore = useSelector((state: RootStatesType) => state.user);
  if (userStore.token) return <>{children}</>;
  else {
    notification.info({
      message: "vui lòng đăng nhập!",
    });
    return <Navigate to={SITE_MAP.HOME.url} />;
  }
}

export default PrivateLayout;
