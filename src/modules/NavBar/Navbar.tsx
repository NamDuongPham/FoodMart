import Logo from "./components/Logo/Logo";
import Search from "./components/Search/Search";
import Usermenu from "./components/UserMenu/Usermenu";

function Navbar() {
    
    return (
        <div className="mx-auto flex flex-row items-center justify-between">
            <Logo/>
            <Search/>
            <Usermenu/>
        </div>
    );
}

export default Navbar;