import { Outlet } from "react-router";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import icon from "@/assets/images/iconmess.png";
import { IoMdArrowDropdown } from "react-icons/io";

const DefaultLayout = () => {
  return (
    <div>
      <header className="md:container md:px-10 2xl:mx-auto">
        <Header></Header>
      </header>
      <main className="min-h-[800px] md:px-10 ">
        <Outlet />
        <div className="flex justify-end bottom-10 sticky md:px-10 2xl:mx-30">
          <div className="group relative">
            <a
              className="cursor-pointer"
              href="https://m.me/273076119232591"
              target="_blank"
            >
              <img src={icon} alt="" />
            </a>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-6 left-[-40px] -translate-x-1/2  w-[160px]">
              <span className="bg-gray-800 text-white px-2 py-1 rounded-md">
                Send Message For Us
              </span>
              <IoMdArrowDropdown className="relative bottom-2 left-[130px] " size={30}/>
            </div>
          </div>
        </div>
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default DefaultLayout;
