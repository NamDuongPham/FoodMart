import { AiFillInstagram, AiOutlineDollar } from "react-icons/ai";
import { BsShieldCheck } from "react-icons/bs";
import { FaFacebook, FaTiktok, FaYoutube } from "react-icons/fa";
import { LiaMedalSolid } from "react-icons/lia";
import { MdOutlineDiscount } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { SITE_MAP } from "../../constants/site-map";
import imageLogo  from "@/assets/images/groceries.png"
function Footer() {
  const navigate = useNavigate();
  const handleClickToHome = () => {
    navigate(SITE_MAP.HOME.url);
  };
  return (
    <footer className="bg-white py-8 mt-[100px] border-t-[1px] border-solid border-[1px] border-[#e6e6e6]">
      <div className="container mx-auto ">
        {/* top - feature */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="text-[#222]">
            <h3 className="text-[20px] font-semibold mb-[10px] flex items-center gap-2">
              <TbTruckDelivery /> Free delivery
            </h3>
            <p className="text-[#747474] text-[16px] leading-[30px]">
              Free delivery on first order, or 100% payment online orders
            </p>
          </div>
          <div className="text-[#222]">
            <h3 className="text-[20px] font-semibold mb-[10px] flex items-center gap-2">
              <BsShieldCheck /> 100% secure payment
            </h3>
            <p className="text-[#747474] text-[16px] leading-[30px]">
              Ensure safe payments using reputable methods
            </p>
          </div>
          <div className="text-[#222]">
            <h3 className="text-[20px] font-semibold mb-[10px] flex items-center gap-2">
              <LiaMedalSolid /> Quality guarantee
            </h3>
            <p className="text-[#747474] text-[16px] leading-[30px]">
              Committed to high quality products.
              <br /> Free returns 1 to 1 for defective product
            </p>
          </div>
          <div className="text-[#222]">
            <h3 className="text-[20px] font-semibold mb-[10px] flex items-center gap-2">
              <AiOutlineDollar /> Guaranteed savings
            </h3>
            <p className="text-[#747474] text-[16px] leading-[30px]">
              Competitive prices, many incentive programs.
            </p>
          </div>
          <div className="text-[#222]">
            <h3 className="text-[20px] font-semibold mb-[10px] flex items-center gap-2">
              <MdOutlineDiscount /> Daily offers
            </h3>
            <p className="text-[#747474] text-[16px] leading-[30px]">
              Update new promotions every day.
            </p>
          </div>
        </div>
        {/* divider */}
        <div className="h-[1px] bg-[#f8f8f8] my-5"></div>
        {/* bottom */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="flex flex-col">
              <div>
                <img
                  src={imageLogo}
                  alt="logo"
                  onClick={() => {
                    handleClickToHome();
                  }}
                />
              </div>
              <div className="flex flex-col mt-8">
                <h3 className="text-[#222] font-semibold mb-[10px] text-[24px]">
                  Follow Us
                </h3>
                <div className="flex gap-6">
                  <button className="p-3  flex items-center justify-center border border-[#efefef] hover:text-[#0866ff] hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.1)]">
                    <FaFacebook className="w-[20px] h-[20px] hover:text-[#0866ff]" />
                  </button>
                  <button className="p-3  flex items-center justify-center border border-[#efefef] hover:text-[#f0ad60] hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.1)]">
                    <AiFillInstagram className="w-[20px] h-[20px] " />
                  </button>
                  <button className="p-3  flex items-center justify-center border border-[#efefef] hover:text-[#ff0000] hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.1)]">
                    <FaYoutube className="w-[20px] h-[20px] hover:text-[#ff0000]" />
                  </button>
                  <button className="p-3  flex items-center justify-center border border-[#efefef] hover:text-[#161823] hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.1)]">
                    <FaTiktok className="w-[20px] h-[20px] hover:text-[#161823]" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-[#222] font-semibold mb-[10px] text-[24px]">
                Quick Link
              </h3>
              <ul className="text-[#747474] text-[16px] flex flex-col gap-6 cursor-pointer mt-[13px] ">
                <li className="hover:bg-gradient-to-r from-[#E85353] to-[#BE1515] hover:text-transparent hover:bg-clip-text">
                  Home
                </li>
                <li className="hover:bg-gradient-to-r from-[#E85353] to-[#BE1515] hover:text-transparent hover:bg-clip-text">
                 About
                </li>

                <li className="hover:bg-gradient-to-r from-[#E85353] to-[#BE1515] hover:text-transparent hover:bg-clip-text">
                  Shop
                </li>
                <li className="hover:bg-gradient-to-r from-[#E85353] to-[#BE1515] hover:text-transparent hover:bg-clip-text">
                  Contact
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#222] font-semibold mb-[10px] text-[24px]">
                About Foodmart
              </h3>
              <ul className="text-[#747474] text-[16px] flex flex-col gap-6 cursor-pointer mt-[13px] ">
                <li className="hover:bg-gradient-to-r from-[#E85353] to-[#BE1515] hover:text-transparent hover:bg-clip-text">
                  About
                </li>
                <li className="hover:bg-gradient-to-r from-[#E85353] to-[#BE1515] hover:text-transparent hover:bg-clip-text">
                  Foodmart Terms
                </li>

                <li className="hover:bg-gradient-to-r from-[#E85353] to-[#BE1515] hover:text-transparent hover:bg-clip-text">
                  Recruitment
                </li>
                <li className="hover:bg-gradient-to-r from-[#E85353] to-[#BE1515] hover:text-transparent hover:bg-clip-text">
                  Marketing program
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#222] font-semibold mb-[10px] text-[24px]">
                Customer care
              </h3>
              <ul className="text-[#747474] text-[16px] flex flex-col gap-6 cursor-pointer mt-[13px] ">
                <li className="hover:bg-gradient-to-r from-[#E85353] to-[#BE1515] hover:text-transparent hover:bg-clip-text">
                  Help Center
                </li>
                <li className="hover:bg-gradient-to-r from-[#E85353] to-[#BE1515] hover:text-transparent hover:bg-clip-text">
                  Shipping
                </li>
                <li className="hover:bg-gradient-to-r from-[#E85353] to-[#BE1515] hover:text-transparent hover:bg-clip-text">
                  Returns & Refunds
                </li>
                <li className="hover:bg-gradient-to-r from-[#E85353] to-[#BE1515] hover:text-transparent hover:bg-clip-text">
                  FAQs
                </li>
                <li className="hover:bg-gradient-to-r from-[#E85353] to-[#BE1515] hover:text-transparent hover:bg-clip-text">
                  Payment
                </li>
                <li className="hover:bg-gradient-to-r from-[#E85353] to-[#BE1515] hover:text-transparent hover:bg-clip-text">
                  Warranty Policy
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#222] font-semibold mb-[10px] text-[24px] ">
                Our Newsletter
              </h3>
              <p className="text-[#787878] mb-[10px] text-[16px] leading-6 ">
                Subscribe to our newsletter to get updates about our grand
                offers.
              </p>
              {/* <div className="flex mt-10">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="px-4 py-2 bg-[#f4f4f4] text-[#222] focus:outline-none "
                />
                <button className="px-4 py-2 bg-[#222] text-white rounded-none hover:border-none">
                  SEND
                </button>
              </div> */}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          &copy; 2022 TemplatesJungle. All rights reserved. Design by
          TemplatesJungle.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
