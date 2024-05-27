import { useTitle } from "../../hooks/useTitle";
import Comment from "./components/Comment/Comment";
import Newletter from "./components/Newletter/Newletter";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import Rating from "./components/Rating/Rating";
import RecentlyView from "./components/RecentlyView/RecentlyView";

function Detail() {
  useTitle("Detail product");
  return (
    <>
      <div className="bg-[#fff1d8] p-[50px] mt-10">
        <ProductDetail />
      </div>
      <div>
        <RecentlyView/>
      </div>
      <div>
        <Rating/>
      </div>
      <div>
        <Comment/>
      </div>
      <div>
        <Newletter/>
      </div>
    </>
  );
}

export default Detail;
