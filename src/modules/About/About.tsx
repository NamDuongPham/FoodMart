import { BsArrowLeftCircle } from "react-icons/bs";

import { useNavigate } from "react-router-dom";
import { SITE_MAP } from "../../constants/site-map";
function About() {
    const navigate = useNavigate();
  const handleClickToHome = () => {
    navigate(SITE_MAP.HOME.url);
  };
  return (
    <main className="text-[#123829]">
      <div>
        <section className="bg-[#fff1d8] mt-10 py-[70px] text-[#123829]">
          <div className="container mx-auto">
            <div>
              <div>
                <a className="flex gap-2 text-[22px] cursor-pointer mb-10 text-[#e85353]" onClick={handleClickToHome}>
                  <span>
                    <BsArrowLeftCircle />
                  </span>
                  Back to Home
                </a>
                <div className="text-[40px] font-bold mb-[12px]">
                  <h2>About Us</h2>
                </div>
                <p>
                  Welcome to our "About Us" page, where we are delighted to
                  share the story and values that drive our organization.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="container mx-auto">
        <section className="mt-10">
          <div>
            <div className="text-center ">
              <h2 className="text-[40px] font-bold">About our services</h2>
              <p className="leading-5 font-medium">
                Completing this culinary masterpiece is a drizzle of velvety,
                aromatic sauce. Its base is a reduction of red wine, infused
                with fragrant rosemary and thyme. The sauce embraces the steak,
                adding a depth of flavor with its complex, slightly tangy and
                savory notes.
              </p>
            </div>
          </div>
        </section>
        {/*  */}
        <section className="py-[50px]">
          <div>
            <div className="text-[41px] font-bold mb-[20px]">
              <h2>The Dough Diaries</h2>
            </div>
            <div className="flex gap-4 font-medium">
              <div className="leading-5">
                <div>
                  <p>
                    The centerpiece of this gastronomic delight is a perfectly
                    seared, medium-rare steak. As you cut into it, the knife
                    glides effortlessly through the tender, juicy flesh,
                    revealing a blush-pink interior that promises succulence
                    with every bite. The aroma of sizzling beef fills the air,
                    accompanied by hints of smokiness from the grill.
                  </p>
                </div>
              </div>
              <div className="leading-5">
                <div className="about-us-content">
                  <p>
                    Beside the steak lies a medley of vibrant, roasted
                    vegetables. Ruby-red cherry tomatoes burst with sweetness,
                    their juices mingling with the earthy notes of caramelized
                    onions and the subtle bitterness of charred bell peppers.
                    The vegetables retain a slight crunch, adding texture and a
                    burst of freshness to the ensemble.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*  */}
        <section>
          <div className="mb-10">
            <div className="text-[41px] text-center font-bold mb-[20px]">
              <h2>The Oven's Delight</h2>
            </div>
            <div className="flex justify-between mb-20">
              <div className="w-[60%] flex flex-col justify-center">
                <div>
                  <div className="my-10 text-[38px] font-bold">
                    <h3>The Pastry Pages</h3>
                  </div>
                  <p className="font-medium leading-5 mb-2">
                    On the other side of the plate, a mound of fluffy, golden
                    mashed potatoes awaits. Each spoonful reveals a creamy,
                    velvety texture with a hint of buttery richness. The
                    potatoes are expertly seasoned, striking a delicate balance
                    between saltiness and the earthy undertones of garlic and
                    herbs. Completing this culinary masterpiece is a drizzle of
                    velvety, aromatic sauce. Its base is a reduction of red
                    wine, infused with fragrant rosemary and thyme. The sauce
                    embraces the steak, adding a depth of flavor with its
                    complex, slightly tangy and savory notes.
                  </p>
                  <p className="font-medium leading-5">
                    As you take your first bite, a harmonious chorus of flavors
                    dances on your palate. The savory richness of the steak
                    melds with the sweetness of the roasted vegetables, while
                    the creamy potatoes provide a comforting and satisfying
                    element. The accompanying sauce enhances every component,
                    elevating the dish to new heights.
                  </p>
                </div>
              </div>
              <div>
                <div>
                  <img
                    className="w-[100%] h-[455px]"
                    src="//bakery-workdo.myshopify.com/cdn/shop/files/abt-1.jpg?v=1680785428"
                  />
                </div>
              </div>
            </div>
            {/*  */}
            <div className="flex justify-between flex-row-reverse">
              <div className="w-[60%] flex flex-col justify-center">
                <div className="abt-shp-column-left">
                  <div className="my-10 text-[38px] font-bold">
                    <h3>Rolling Pin Tales</h3>
                  </div>
                  <p className="font-medium leading-5 mb-2">
                    Rolling Pin Tales is not a specific term or phrase that I am
                    familiar with. It could potentially be a book title, a
                    restaurant name, or a concept related to baking or cooking.
                    If you could provide more context or clarify what you are
                    referring to, I would be happy to assist you further.
                  </p>
                  <p className="font-medium leading-5">
                    As you take your first bite, a harmonious chorus of flavors
                    dances on your palate. The savory richness of the steak
                    melds with the sweetness of the roasted vegetables, while
                    the creamy potatoes provide a comforting and satisfying
                    element. The accompanying sauce enhances every component,
                    elevating the dish to new heights. This gastronomic delight
                    is not just a mere meal; it is a celebration of culinary
                    artistry. From the careful selection of prime ingredients to
                    the skillful execution of cooking techniques, every detail
                    has been meticulously crafted to create a symphony of taste
                    and pleasure.
                  </p>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="abt-shp-column-right">
                  <img
                    src="//bakery-workdo.myshopify.com/cdn/shop/files/abt-2.jpg?v=1680785456"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*  */}
      </div>
    </main>
  );
}

export default About;
