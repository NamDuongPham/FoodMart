import { BsGiftFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { SITE_MAP } from "../../constants/site-map";
interface NavItem {
  text: string;
  url?: string;
}
function Navigator() {
  
  const navigate = useNavigate();
  const location = useLocation();

  

  const handleClick = (index: number) => {
   
    const url = navItems[index]?.url; // Use optional chaining
    if (url) {
      navigate(url); // Navigate to the corresponding page
    } else {
      //console.error(`URL not defined for item: ${navItems[index].text}`); 
    }
  };
  const navItems: NavItem[] = [
    { text: "Home", url: SITE_MAP.HOME.url },
    { text: "Shop", url: SITE_MAP.SHOP.url },
    { text: "Contact", url: SITE_MAP.CONTACT.url }, // Add URL for Contact page
    { text: "About", url: SITE_MAP.ABOUT.url }, // Add URL for About page
  ];
  // console.log(location);
  return (
    <div className="flex flex-row justify-between items-center z-10">
      <div className="flex flex-row justify-center items-center relative right-[-10px]">
        {navItems.map((item, index) => (
          <div
            key={index}
            className={` rounded-[6px] py-[8px] px-[14px] cursor-pointer ${
                location.pathname === item.url
                ? "bg-gradient-to-br from-[#E85353] to-[#BE1515] text-white"
                : " text-[#222]"
            }`}
            onClick={() => handleClick(index)}
          >
            <p className="text-[16px]">{item.text}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-row items-center  gap-2 relative left-[300px]">
        <BsGiftFill className="w-[30px] h-[30px]" color="#E85353" />
        <p className="text-[#222] font-semibold "> Get Your Coupon Code</p>
      </div>
    </div>
  );
}

export default Navigator;
