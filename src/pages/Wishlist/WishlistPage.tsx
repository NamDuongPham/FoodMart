import { SITE_MAP } from "../../constants/site-map";
import { useTitle } from "../../hooks/useTitle";
import Wishlist from "../../modules/Wishlist/Wishlist";

function WishlistPage() {
    useTitle(SITE_MAP.WISHLIST.title)
    return (
        <div>
            <Wishlist/>
        </div>
    );
}

export default WishlistPage;