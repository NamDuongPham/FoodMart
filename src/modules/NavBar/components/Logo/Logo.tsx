import { useNavigate } from "react-router-dom";
import { SITE_MAP } from "../../../../constants/site-map";
import imageLogo from "@/assets/images/groceries.png";
function Logo() {
  const navigate = useNavigate();
  const handleClickToHome = () => {
    navigate(SITE_MAP.HOME.url);
  };
  return (
    <div className="flex flex-row gap-1">
      <div>
        <img
          src={imageLogo}
          alt="logo"
          onClick={handleClickToHome}
          className="cursor-pointer"
          height="52"
          width="52"
        />
      </div>
      <div
        className="flex flex-col gap-1 cursor-pointer"
        onClick={handleClickToHome}
      >
        <div className="flex flex-row font-bold">
          <h1 className="text-[#222222] text-[31px] ">FOOD</h1>
          <h1 className="bg-gradient-to-r from-[#E85353] to-[#BE1515] text-transparent bg-clip-text text-[31px] ">
            MART
          </h1>
        </div>
        <div>
          <h3 className="text-[#818181] text-[13px]">GROCERY STORE</h3>
        </div>
      </div>
    </div>
  );
}

export default Logo;
