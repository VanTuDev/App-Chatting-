const Message = () => {
  return (
    <div className=" chat chat-end">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
          />
        </div>
      </div>
      <div
        className={"char-bubble text-white bg-blue-500 py-2 px-3 rounded-xl "}
      >
        Hi Bro, My name is Tu ne
      </div>
      <div className="`chat-footer opacity-50 text-xs flex gap-1 items-center mt-2">
        12:42
      </div>
    </div>
  );
};

export default Message;
