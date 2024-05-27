import { useTitle } from "../../hooks/useTitle";
import Shop from "../../modules/Shop/Shop";

function ShopPage() {
  useTitle("Shop");
  return (
    <div>
      <Shop />
    </div>
  );
}

export default ShopPage;
