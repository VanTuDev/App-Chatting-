import Conversation from "./Conversation.jsx";
import SearchInput from "./SearchInput.jsx"; // Case-sensitive import
import LogoutButton from "./LogoutButton.jsx";
const Sidebar = () => {
  return (
    <div className="border-r border-slate-500 p-4 flex flex-col">
      <SearchInput />
      <div className="divider px-3"></div>
      <Conversation />
      <Conversation />
      <Conversation />
      <LogoutButton />
    </div>
  );
};

export default Sidebar;
