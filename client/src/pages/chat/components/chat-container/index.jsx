import ChatHeader from "./chat-header"
import MessageBar from "./message-bar"
import MessageContainer from "./message-container"

const ChatContainer = () => {
  return (
    <div className=" top-0 h-[100vh] w-[100vh]  pr-2 bg-[#1c1d25] flex flex-col md:static md:flex-1">
      <ChatHeader/>
      <MessageContainer/>
      <MessageBar/>
    </div>
  )
}

export default ChatContainer
 