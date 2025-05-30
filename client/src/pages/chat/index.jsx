import { useAppStore } from "@/store";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import ChatContainer from "./components/chat-container";
import ContactContainer from "./components/contact-container";
import EmptyChatContainer from "./components/empty-chat-container";


export default function Chat() {

  const {userInfo,selectedChatType,isUploading,isDownloading,fileUploadProgress,fileDownloadProgress}=useAppStore()
  const navigate = useNavigate();
  useEffect(() => {
    if (userInfo && !userInfo.profileSetup) {
      toast.error("Please complete your profile setup first.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return (
    <div className="w-full fixed flex h-[100vh] text-white overflow-hidden ">
      {
        isUploading && <div className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-lg z-50 flex items-center justify-center">
          <h5 className="text-2xl text-white">Uploading file...{fileUploadProgress}%</h5>
          </div>
      }
      {
        isDownloading && <div className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-lg z-50 flex items-center justify-center">
          <h5 className="text-2xl text-white">Downloading file...{fileDownloadProgress}%</h5>
          </div>
      }
      <ContactContainer/>
      {
        selectedChatType===null ? (<EmptyChatContainer/>):(<ChatContainer/>)
      }
      {/* <EmptyChatContainer/>
      <ChatContainer/>  */}
    </div>
  );
}   