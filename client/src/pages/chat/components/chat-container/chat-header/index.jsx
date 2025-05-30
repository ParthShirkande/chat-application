import { useAppStore } from "@/store"
import { RiCloseFill } from "react-icons/ri"
import { HOST } from "@/utils/constants"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { getColors } from "@/lib/utils"

const ChatHeader = () => {
  const { closeChat, selectedChatData ,selectedChatType} = useAppStore()
  if (!selectedChatData) {
    return null;
  }
  console.log(selectedChatData)
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-10 ">
      <div className="flex gap-2 items-center">
        <div className="flex gap-3 items-center justify-center">
          <div className="relative w-12 h-12 ">
            {
             selectedChatType==="contact" ?  
             <Avatar className="h-12 w-12 rounded-full overflow-hidden">
              {
                selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full object-fill bg-black"
                  />
                ) : (
                  <div className={`uppercase h-12 w-12 text-lg border-[1px] flex justify-center items-center rounded-full ${getColors(selectedChatData.color)}`}>
                    {selectedChatData?.firstName ? selectedChatData?.firstName.charAt(0) : selectedChatData?.email?.charAt(0)}
                  </div>
                )
              }
            </Avatar>
            :
            (
              <div className="bg-[#ffffff22] h-10 border-1 border-white/15  w-10 flex items-center font-bold  justify-center rounded-full">#</div>
            )
            } 
          </div>
        </div>
        {
          selectedChatType==="channel" && selectedChatData.name 
        }
        {
          selectedChatType==="contact" && selectedChatData.firstName ? `${selectedChatData.firstName} ${selectedChatData.lastName}` : selectedChatData.email}    
        <div className="flex items-center justify-center gap-5">
          <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
            <RiCloseFill className="text-3xl" onClick={closeChat} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader
