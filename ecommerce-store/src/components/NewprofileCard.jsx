import { useContext } from "react";
import UserDetailContext from "../context/userDetailContext";

const NewprofileCard = () => {
  const user = useContext(UserDetailContext);
  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-80">
      <img
        src={user.avatar}
        alt="User Avatar"
        className="w-24 h-24 rounded-full mb-4"
      />
      <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
      <p className="text-gray-600 mb-2">{user.bio}</p>
      <p className="text-gray-500 text-sm mb-1">Location: {user.location}</p>
      <p className="text-gray-500 text-sm mb-1">Email: {user.email}</p>
    </div>
  );
};

export default NewprofileCard;
