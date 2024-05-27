import Navbar from "../../modules/NavBar/Navbar";
import Navigator from "../../modules/Navigator/Navigator";

function Header() {
  return (
    <div className=" h-[151px] container mx-auto mt-[42px]">
      <div>
        <Navbar></Navbar>
      </div>
      <div className="bg-[#f6f6f6]  h-[1px]  my-[32px]"></div>
      <div className="flex justify-center items-center ">
        <Navigator />
      </div>
    </div>
  );
}

export default Header;
