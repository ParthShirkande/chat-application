import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { Navigate, useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import { apiClient } from "@/lib/api-client";
import { getColors } from "@/lib/utils";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore()
  const navigate = useNavigate()

  const logout = async () => {
    try {
      const response = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true })
      if (response.status === 200) {
        navigate("/auth")
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="absolute bottom-0 w-full bg-[#2a2b33] px-6 py-3 flex items-center justify-between">
    <div className="flex items-center gap-3 min-w-0">
      <div className="relative w-12 h-12">
        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
          {
            userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                className="object-cover w-full h-full object-fill bg-black"
              />
            ) : (
              <div className={`uppercase h-12 w-12 text-lg border-[1px] flex justify-center items-center rounded-full ${getColors(userInfo.color)}`}>
                {userInfo.firstName ? userInfo.firstName.charAt(0) : userInfo.email.charAt(0)}
              </div>
            )
          }
        </Avatar>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px] text-white font-medium">
              {
               userInfo.firstName && userInfo.lastName
                ? `${userInfo.firstName} ${userInfo.lastName}`
                : ""}              
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-[#1a181d] border-none text-white">
            {userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  
    {/* Edit & Logout Icons */}
    <div className="flex items-center gap-5">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FiEdit2
              className="cursor-pointer text-purple-500 text-xl font-medium"
              onClick={() => navigate("/profile")}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1a181d] border-none text-white">
            Edit Profile
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <IoPowerSharp
              className="cursor-pointer text-red-500 text-xl font-medium"
              onClick={logout}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1a181d] border-none text-white">
            Logout
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
  )
}

export default ProfileInfo
