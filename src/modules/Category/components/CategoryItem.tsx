import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
interface CategoryItemProps {
 
  name: string;
  image: string;
}

function CategoryItem(props: CategoryItemProps) {
  useEffect(() => {
    Aos.init({ duration: 3000 });
  }, []);
  const { name, image } = props;
  

  return (
    <div>
      <div
        data-aos-once="true"
        data-aos="fade-left"
        className="w-[200px] h-[200px] rounded-[12px] flex flex-col justify-center items-center gap-10 ; border border-[#fbfbfb]  shadow-[0_5px_22px_0_rgba(0,0,0,0.09)]"
      >
        <div>
          <img src={image} alt="" />
        </div>
        <div className="text-[20px] text-[#222] font-semibold">{name}</div>
      </div>
    </div>
  );
}

export default CategoryItem;
