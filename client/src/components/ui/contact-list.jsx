import { useAppStore } from "@/store";
import { Avatar } from "./avatar.jsx";
import { getColors } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { HOST } from "@/utils/constants";
import { useEffect } from "react";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    selectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");

    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  useEffect(() => {}, [
    contacts,
    setSelectedChatMessages,
    setSelectedChatData,
    setSelectedChatType,
  ]);

  return (
    <div className="mt-5">
      {contacts.map((contact) => {
        const isSelected =
          selectedChatData && selectedChatData._id === contact._id;

        return (
          <div
            key={contact._id}
            className={`pl-10 py-2 transition-all flex items-center cursor-pointer ${
              isSelected
                ? "bg-[#8417ff] hover:bg-[#8417ff]"
                : "hover:bg-[#f1f1f111]"
            }`}
            onClick={() => handleClick(contact)}
          >
            <div className="flex items-center justify-start text-neutral-300">
              {/* Render contact avatar */}
              {!isChannel && (
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  {contact.image ? (
                    <AvatarImage
                      src={`${HOST}/${contact.image}`}
                      alt="profile"
                      className="object-cover w-full h-full object-fill bg-black"
                    />
                  ) : (
                    <div
                      className={`uppercase h-10 w-10 text-lg flex justify-center items-center rounded-full border ${
                        isSelected
                          ? "bg-[#ffffff22] border-white/70 border-1"
                          : getColors(contact.color)
                      }`}
                    >
                      {contact?.firstName
                        ? contact?.firstName.charAt(0)
                        : contact?.email?.charAt(0)}
                    </div>
                  )}
                </Avatar>
              )}

              {/* Render channel avatar with selected highlight */}
              {isChannel && (
                <div
                  className={`mr-2 h-10 w-10 flex justify-center items-center rounded-full text-white font-bold text-xl ${
                    isSelected
                      ? "bg-[#ffffff22] border-white/70 border-1"
                      : "bg-[#ffffff22]"
                  }`}
                >
                  #
                </div>
              )}

              {/* Name or Email */}
              {isChannel ? (
                <span>{contact.name}</span>
              ) : (
                <span className="ml-2">
                  {contact.firstName && contact.lastName
                    ? `${contact.firstName} ${contact.lastName}`
                    : contact.email}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;
