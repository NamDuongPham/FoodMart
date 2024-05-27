import { useLocation } from "react-router-dom";
import useEdit from "../../hooks/useEdit";

interface IProp {
  label: string;
  value: string;
  updateValue?: (newValue: string) => void;
}
function Info({ label, value, updateValue }: IProp) {
  const { isEditing, newValue, setNewValue, handleEditClick, handleSaveClickCustomer } = useEdit(
    (newValue: string, field: string) => {
      updateValue?.(newValue);
    }
  );


  const location = useLocation();
  const isProfilePage = location.pathname === "/admin/profile";
  const isAccountPage = location.pathname === "/account";
  const backgroundClass = isProfilePage
    ? "bg-white"
    : isAccountPage
    ? "bg-[#f0f0f0]"
    : "bg-gray-200";

  return (
    <div
      className={`flex justify-between items-center mb-4 shadow-md rounded-md ${backgroundClass}`}
    >
      <div className="p-4 basis-5/6">
        {!isEditing ? (
          <div>
            <p className="text-lg font-semibold mb-2 text-[#E85353]">{label}</p>
            <p>{value}</p>
          </div>
        ) : (
          <form>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#E85353]">
                {label}
              </label>
              <input
                type="text"
                className="mt-1 p-2 block w-full border "
                defaultValue={value}
                value={newValue}
                onChange={(e) => {
                  setNewValue(e.target.value);
                }}
              />
            </div>
          </form>
        )}
      </div>
      <div className="basis-1/6">
        {!isEditing ? (
          <button
            onClick={() => {
              handleEditClick();
            }}
            className="text-blue-500 hover:underline hover:bg-[#E85353] hover:text-white hover:border-none"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={() => {
              handleSaveClickCustomer();
            }}
            className="text-green-500 hover:underline"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}

export default Info;
