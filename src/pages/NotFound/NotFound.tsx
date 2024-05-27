import { Link } from "react-router-dom";
function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center">
      <img src="images/404.png" alt="not-found" className="w-[50%] h-[50%]" />
      <Link to="/" className="text-[30px]">Go Home</Link>
    </div>
  );
}

export default NotFound;
