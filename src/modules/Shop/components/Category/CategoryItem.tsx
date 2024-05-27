import { useLocation, useNavigate, useParams } from "react-router-dom";
interface ICategoryProps {
  icon: string;
  label: string;

  selected?: boolean;
}
function CategoryItem(props: ICategoryProps) {
  const { selected, icon, label } = props;
  const { category: currentCategory } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const handleClickHandler = () => {
    const updatedCategory: string | undefined =
      currentCategory === label ? undefined : label;

    const searchParams = new URLSearchParams(location.search);
    if (updatedCategory !== undefined) {
      searchParams.set("category", updatedCategory);
    } else {
      searchParams.delete("category");
    }

    // setSelectd(true);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };
  return (
    <>
      <div
        onClick={handleClickHandler}
        className={` cursor-pointer flex flex-col items-center justify-center gap-2 p-3 hover:text-neutral-800transitioncursor-pointer ${
          selected ? "text-[#de3151]" : "text-neutral-500"
        }

`}
      >
        <img src={icon} alt="Icon" />
        <h3 className="font-semibold text-sm">{label}</h3>
      </div>
    </>
  );
}

export default CategoryItem;
