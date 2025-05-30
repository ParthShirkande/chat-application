import EmojiPicker from "emoji-picker-react"
import { useEffect, useRef, useState } from "react"
import { GrAttachment } from "react-icons/gr"
import { IoSend } from "react-icons/io5"
import { RiEmojiStickerLine } from "react-icons/ri"
import { useAppStore } from "@/store/index.js"
import { useSocket } from "@/context/SocketContext.jsx"
import { apiClient } from "@/lib/api-client"
import { UPLOAD_FILE_ROUTE } from "@/utils/constants"

const MessageBar = () => {
  const emojiRef = useRef()

  const fileInputRef = useRef()

  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const [message, setMessage] = useState("")


  const { selectedChatType, selectedChatData, userInfo, setIsUploading, setFileUploadProgress, setFileDownloadProgress } = useAppStore()
  const socket = useSocket()


  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji)
  }

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        recipient: selectedChatData._id,
        messageType: "text",
        content: message,
      })
    } else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        sender: userInfo.id,
        recipient: selectedChatData._id,
        messageType: "text",
        content: message,
        fileUrl: undefined,
        channnelId: selectedChatData._id,
      })
    }
    setMessage("")
  }


  const handleAttachmentCLick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0]
      if (!file) return
      const formData = new FormData()
      formData.append("file", file)
      setIsUploading(true)
      setFileUploadProgress(0)
      const res = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
        withCredentials: true,
        onUploadProgress: (data) => {
          const progress = Math.round((data.loaded * 100) / data.total)
          setFileUploadProgress(progress)
        },
        onDownloadProgress: (data) => {
          const progress = Math.round((data.loaded * 100) / data.total)
          setFileDownloadProgress(progress)
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      if (res.status === 200 && res.data) {
        setIsUploading(false)
        if (selectedChatType === "contact") {
          socket.emit("sendMessage", {
            sender: userInfo.id,
            recipient: selectedChatData._id,
            messageType: "file",
            fileUrl: res.data.filePath,
          })
        } else if (selectedChatType === "channel") {
          socket.emit("send-channel-message", {
            sender: userInfo.id,
            recipient: selectedChatData._id,
            content: undefined,
            messageType: "file",
            fileUrl: res.data.filePath,
            channnelId: selectedChatData._id,
          })
        }
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiPickerOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [emojiRef])
  return (
    <div className="p-2 h-[10vh] bg-[#1c1d25] flex justify-center">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input type="text" className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none" placeholder="Enter message" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all" onClick={handleAttachmentCLick}>
          <GrAttachment className="text-2xl" />
        </button>
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />
        <div className="relative">
          <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all" onClick={() => setEmojiPickerOpen(true)}>
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false} />
          </div>
        </div>
      </div>
      <button
        onClick={handleSendMessage}
        className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-2xl ml-2 transition-all duration-300 flex items-center justify-center"
      >
        <IoSend className="text-xl" />
      </button>

    </div>
  )
}

export default MessageBar
