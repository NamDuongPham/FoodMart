interface UserItem {
    onClick: () => void;
    label: string;
  }
function UserItem({ onClick, label }: UserItem) {
    return (
        <button className="px-2 py-3 text-left bg-white hover:bg-neutral-100 hover:border-red-500 transition font-semibold" onClick={onClick}>
        {label}
      </button>
    );
}

export default UserItem;