import { Carousel } from "antd";
import "./Banner.css";
import Aos from "aos"
import "aos/dist/aos.css"
import { useEffect } from "react";
function Banner() {
  useEffect(()=>{
    Aos.init({duration:3000})
  },[])
  return (
    <div className="container mx-auto py-[107px] gap-5 flex flex-row justify-evenly">
      {/* right */}
      <Carousel className="w-[100%]" >
        <div className="container mx-auto w-[100%] bg-[#e6f3fa] h-[520px] rounded-[12px]" data-aos="fade-right" >
          <div className="flex flex-row justify-evenly gap-2 my-[10px] ">
            <div className="flex flex-col gap-5 justify-evenly items-start max-w-[336px]">
              <p className="text-[#ed8939] text-[27px]">100% Tự nhiên</p>
              <h1 className="text-[#222]">
                Fresh Smoothie <br />& Summer Juice
              </h1>
              <p className="text-[#727272] text-[18px]">
                Best Selling Summer Juice
              </p>
              <button className=" bg-[#e6f3fa] h-[56px] border border-[#222] rounded-[4px] text-[16px] text-center">
                SHOP NOW
              </button>
            </div>
            <div className="max-w-[336px]">
              <img src="/images/Image1.png" alt="banner" />
              {/* <img src="/images/bannertest.png" alt="banner" /> */}

            </div>
          </div>
        </div>
        <div className="container mx-auto w-[100%] bg-[#ffeada] h-[520px] rounded-[12px]">
          <div className="flex flex-row justify-evenly gap-2 my-[10px] ">
            <div className="flex flex-col gap-5 justify-evenly items-start max-w-[336px]">
              <p className="text-[#BC4B68] text-[27px]">Up to 15% Off</p>
              <h1 className="text-[#222]">Creamy Muffins</h1>
              <p className="text-[#727272] text-[18px]">
                Very tasty & creamy vanilla flavour creamy muffins.
              </p>
              <button className=" bg-[#ffeada] h-[56px] border border-[#222] rounded-[4px] text-[16px] text-center">
                SHOP NOW
              </button>
            </div>
            <div className="max-w-[536px] ">
              <img src="/images/socola.png" alt="banner" />
            </div>
          </div>
        </div>
        <div className="container mx-auto w-[100%] bg-[#E1F7F9] h-[520px] rounded-[12px]">
          <div className="flex flex-row justify-evenly gap-2 my-[10px] ">
            <div className="flex flex-col gap-5 justify-evenly items-start max-w-[336px]">
              <p className="text-[#BC4B68] text-[27px]">Up to 15% Off</p>
              <h1 className="text-[#222]">
                Luxa Smoothie <br />& Dark Chocolate
              </h1>
              <p className="text-[#727272] text-[18px]">
                Chocolate is only the happiness that you can eat.
              </p>
              <button className=" text-white bg-[#222] h-[56px] border border-[#222] rounded-[4px] text-[16px] text-center">
                SHOP NOW
              </button>
            </div>
            <div className="max-w-[736px]">
              <img src="/images/icecream.png" alt="banner" />
              
            </div>
          </div>
        </div>
      </Carousel>

      {/* left */}
      <div className="flex flex-col justify-between  w-[40%]  gap-5">
        <div className="flex flex-row justify-around rounded-[12px] w-full h-full py-[20px] bg-[#EEF5E4] bg-no-repeat bg-[url('/images/image2.png')] bg-right-bottom" data-aos="fade-left">
          <div className="flex flex-col justify-evenly items-start mr-[170px]">
            <p className="text-[#222] text-[25px]">20% Off</p>
            <h3 className="text-[#222] font-semibold text-[30px]">
              Fruits & Vegetables
            </h3>
            <p className="text-[#222] text-[16px]">Shop the category</p>
          </div>
        </div>
        <div className="flex flex-row justify-around rounded-[12px] w-full h-full py-[20px] bg-[#F9ECDE] bg-no-repeat bg-[url('/images/bakery1.png')] bg-right-bottom" data-aos="fade-left">
          <div className="flex flex-col justify-evenly items-start mr-[170px]">
            <p className="text-[#222] text-[25px]">20% Off</p>
            <h3 className="text-[#222] font-semibold text-[30px]">
              Baked Products
            </h3>
            <p className="text-[#222] text-[16px]">Shop the category</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
