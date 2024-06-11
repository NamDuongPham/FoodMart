import { useTitle } from "../../hooks/useTitle";
import Banner from "../../modules/Banner/Banner";
import Category from "../../modules/Category/Category";
import Product from "../../modules/Product/Product";
function HomePage() {
  useTitle("Home");

  return (
    <div className="">
      <div className=" mt-[24px]">
        <Banner />
      </div>
      <div>
        <Category />
      </div>
      <div>
        <Product />
      </div>
    </div>
  );
}

export default HomePage;
