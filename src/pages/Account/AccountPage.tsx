import { SITE_MAP } from "../../constants/site-map";
import { useTitle } from "../../hooks/useTitle";
import Account from "../../modules/Account/Account";

function AccountPage() {
    useTitle(SITE_MAP.ACCOUNT.title)
    return (
        <div>
            <Account/>
        </div>
    );
}

export default AccountPage;