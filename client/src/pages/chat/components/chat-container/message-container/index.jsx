// import { useAppStore } from '@/store'
// import { useEffect, useRef, useState } from 'react'
// import moment from 'moment'
// import { apiClient } from '@/lib/api-client';
// import { GET_CHANNEL_MESSAGES, GET_MESSAGES_ROUTE, HOST } from '@/utils/constants';
// import { MdFolderZip } from 'react-icons/md'
// import { IoMdArrowRoundDown } from "react-icons/io";
// import { IoCloseSharp } from 'react-icons/io5';
// import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
// import { getColors } from '../../../../../lib/utils.js';

// const MessageContainer = () => {
//   const scrollRef = useRef()
//   const imageRef = useRef()
//   const { selectedChatType, selectedChatData,setIsDownloading,setFileDownloadProgress, userInfo, selectedChatMessages, setSelectedChatMessages } = useAppStore()

//   const [showImage, setShowImage] = useState(false)
//   const [imageUrl, setImageUrl] = useState(null)




//   const downloadFile = async (fileUrl) => {
//     try {
//       setIsDownloading(true)
//       setFileDownloadProgress(0)
//       const response = await apiClient.get(`${HOST}/${fileUrl}`,{
//         responseType: 'blob',
//         withCredentials: true,
//         onDownloadProgress: (data) => {
//           const progress = Math.round((data.loaded * 100) / data.total)
//           setFileDownloadProgress(progress)
//         }
//       });
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href= url;
//       link.setAttribute('download', fileUrl.split('/').pop());
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);  
//       setIsDownloading(false)
//     } catch (error) {
//       console.error("Download error:", error);
//     }
//   };


//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (imageRef.current && !imageRef.current.contains(e.target)) {
//         setShowImage(false);
//       }
//     };

//     if (showImage) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showImage]);


//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollIntoView({ behavior: 'smooth' })
//     }
//   }, [selectedChatMessages]);

//   useEffect(() => {
//     const getMessages = async () => {
//       try {
//         const res = await apiClient.post(GET_MESSAGES_ROUTE,
//           { id: selectedChatData._id },
//           { withCredentials: true }
//         );

//         if (res.data.messages) {
//           setSelectedChatMessages(res.data.messages)
//         }
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     const getChannelMessages=async()=>{
//         try {
//         const res = await apiClient.get(`${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
//           { withCredentials: true }
//         );
//         if (res.data.messages) {
//           setSelectedChatMessages(res.data.messages)
//         }
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     if (selectedChatData._id ){
//       if( selectedChatType === 'contact') 
//       getMessages();
//     else if(selectedChatType==="channel")
//       getChannelMessages()
//     }
//   }, [selectedChatData, selectedChatType,setSelectedChatMessages]);

//   const checkIfImage = (filePath) => {
//     const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico|heic|heif)$/i;
//     return imageRegex.test(filePath);
//   };

//   const renderDMMessages = (message) => {
//     const isSender = message.sender === selectedChatData?._id;

//     return (
//       <div className={`flex flex-col ${isSender ? 'items-start' : 'items-end'} w-full`}>
//         {message.messageType === 'text' && (
//           <div className={`${isSender
//             ? "bg-white text-black border-gray-300"
//             : "bg-[#8417ff]/80 text-white border-transparent"
//             } border p-4 rounded-lg my-1 max-w-[85%] sm:max-w-[70%] break-words`}>
//             {message.content}
//           </div>
//         )}

//         {
//           message.messageType === "file" &&
//           <div className={`${message.sender !== selectedChatData._id
//             ? "bg-[#8417ff]/80 text-white/80 border-transparent/20"
//             : "bg-white text-black border-gray-300"} 
//     border p-4 rounded my-1 max-w-[80%] sm:max-w-[70%] md:max-w-[60%] break-words`}>

//             {checkIfImage(message.fileUrl) ? (
//               <div className="cursor-pointer w-full" onClick={() => { setShowImage(true); setImageUrl(message.fileUrl) }}>
//                 <img
//                   src={`${HOST}/${message.fileUrl}`}
//                   alt="uploaded"
//                   className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto rounded-md object-contain"
//                 />
//               </div>
//             ) : (
//               <div className="flex items-center justify-center gap-4">
//                 <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
//                   <MdFolderZip />
//                 </span>
//                 <span>{message.fileUrl.split("/").pop()}</span>
//                 <span
//                   className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
//                   onClick={() => downloadFile(message.fileUrl)}
//                 >
//                   <IoMdArrowRoundDown />
//                 </span>
//               </div>
//             )}
//           </div>
//         }


//         <span className="text-xs text-gray-500 mt-1">
//           {moment(message.timestamp).format('LT')}
//         </span>
//       </div>
//     );
//   };
// const renderChannelMessages = (message) => {
//   const isSender = message.sender._id === userInfo?._id;

//   const isImage = checkIfImage(message.fileUrl);

//   return (
//     <div className={`w-full flex ${isSender ? 'justify-start' : 'justify-end'} mb-3`}>
//       {!isSender && (
//         <div className="flex items-start max-w-[85%] sm:max-w-[70%] md:max-w-[60%]">
//           <Avatar className="h-5 w-5 rounded-full overflow-hidden shrink-0">
//             {message.sender.image ? (
//               <img
//                 src={`${HOST}/${message.sender.image}`}
//                 alt="avatar"
//                 className="object-cover w-full h-full"
//               />
//             ) : (
//               <AvatarFallback
//                 className={`uppercase h-5 w-5 text-sm border flex justify-center items-center rounded-full ${getColors(message.sender.color)}`}
//               >
//                 {message.sender.firstName
//                   ? message.sender.firstName.charAt(0)
//                   : message.sender.email?.charAt(0)}
//               </AvatarFallback>
//             )}
//           </Avatar>

//           <div className="pl-2">
//             <div className="text-xs text-gray-500 font-semibold mb-1">
//               {message.sender.firstName} {message.sender.lastName}
//             </div>

//             <div className="bg-[#f0f0f0] text-black px-4 py-2 rounded-xl relative max-w-full break-words">
//               {message.messageType === 'text' && (
//                 <p className="text-sm break-words pr-10">{message.content}</p>
//               )}

//               {message.messageType === 'file' && (
//                 <div>
//                   {isImage ? (
//                     <div
//                       className="cursor-pointer w-full"
//                       onClick={() => {
//                         setShowImage(true);
//                         setImageUrl(message.fileUrl);
//                       }}
//                     >
//                       <img
//                         src={`${HOST}/${message.fileUrl}`}
//                         alt="uploaded"
//                       className="w-full max-w-[220px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] xl:max-w-[450px] h-auto rounded-md object-contain"
//                       />
//                     </div>
//                   ) : (
//                     <div className="flex items-center justify-start gap-4">
//                       <span className="text-black text-2xl bg-gray-300 rounded-full p-2">
//                         <MdFolderZip />
//                       </span>
//                       <span>{message.fileUrl?.split('/').pop()}</span>
//                       <span
//                         className="bg-gray-300 p-2 text-xl rounded-full hover:bg-gray-400 cursor-pointer"
//                         onClick={() => downloadFile(message.fileUrl)}
//                       >
//                         <IoMdArrowRoundDown />
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               )}

//               <span className="absolute bottom-1 right-2 text-[10px] text-gray-400">
//                 {moment(message.timestamp).format('LT')}
//               </span>
//             </div>
//           </div>
//         </div>
//       )}

//       {isSender && (
//         <div className="flex justify-end max-w-[85%] sm:max-w-[70%] md:max-w-[60%]">
//           <div className="bg-[#dcf8c6] text-black px-4 py-2 rounded-xl relative max-w-full break-words">
//             {message.messageType === 'text' && (
//               <p className="text-sm break-words pr-10">{message.content}</p>
//             )}

//             {message.messageType === 'file' && (
//               <div>
//                 {isImage ? (
//                   <div
//                     className="cursor-pointer w-full"
//                     onClick={() => {
//                       setShowImage(true);
//                       setImageUrl(message.fileUrl);
//                     }}
//                   >
//                     <img
//                       src={`${HOST}/${message.fileUrl}`}
//                       alt="uploaded"
//                       className="w-full max-w-[220px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] xl:max-w-[450px] h-auto rounded-md object-contain"
//                     />
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-start gap-4">
//                     <span className="text-black text-2xl bg-gray-300 rounded-full p-2">
//                       <MdFolderZip />
//                     </span>
//                     <span>{message.fileUrl?.split('/').pop()}</span>
//                     <span
//                       className="bg-gray-300 p-2 text-xl rounded-full hover:bg-gray-400 cursor-pointer"
//                       onClick={() => downloadFile(message.fileUrl)}
//                     >
//                       <IoMdArrowRoundDown />
//                     </span>
//                   </div>
//                 )}
//               </div>
//             )}

//             <span className="absolute bottom-1 right-2 text-[10px] text-gray-600">
//               {moment(message.timestamp).format('LT')}
//             </span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };



//   const renderMessages = () => {
//     if (!selectedChatMessages?.length) return null;

//     let lastDate = null;
//     return selectedChatMessages.map((message, index) => {
//       if (!message) return null;

//       const messageDate = moment(message.timestamp).format('YYYY-MM-DD');
//       const showDate = messageDate !== lastDate;
//       lastDate = messageDate;

//       return (
//         <div key={index} className="mb-6">
//           {showDate && (
//             <div className="flex justify-center mb-4">
//               <span className="bg-gray-800 text-gray-400 text-xs px-4 py-2 rounded-full">
//                 {moment(message.timestamp).format('LL')}
//               </span>
//             </div>
//           )}
//           <div className={`flex ${message.sender?._id === userInfo?._id ? "justify-start" : "justify-end"}`}>
//             {selectedChatType === 'contact' && renderDMMessages(message)}
//             {selectedChatType === 'channel' && renderChannelMessages(message)}

//           </div>
//         </div>
//       );
//     });
//   };


//   if (!selectedChatType || !selectedChatData) return null;

//   return (
//     <div className="flex-1 overflow-y-auto p-4 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] px-8 w-full scrollbar-hide">
//       {renderMessages()}
//       <div ref={scrollRef} />
//       {
//         showImage &&
//         <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
//           <div ref={imageRef}>
//             <img
//               src={`${HOST}/${imageUrl}`}
//               alt="uploaded"
//               className="w-full h-[80vh] object-contain"
//               onClick={() => setShowImage(false)}
//             />
//           </div>
//           <div className='flex gap-5 fixed top-0 mt-5'>
//             <button
//               className="bg-black/20 p-3 text-2xl rounded-full hover:bg-gray-500/50 cursor-pointer transition-all duration-300"
//               onClick={() => downloadFile(imageUrl)}>
//               <IoMdArrowRoundDown />
//             </button>
//             <button
//               className="bg-black/20 p-3 text-2xl rounded-full hover:bg-gray-500/50 cursor-pointer transition-all duration-300"
//               onClick={() => {setImageUrl(null); setShowImage(false); }}>
//               <IoCloseSharp />
//             </button>
//           </div>
//         </div>
//       }
//     </div>
//   );
// };

// export default MessageContainer;






import { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { apiClient } from '@/lib/api-client'
import { useAppStore } from '@/store'
import { GET_CHANNEL_MESSAGES, GET_MESSAGES_ROUTE, HOST } from '@/utils/constants'
import { MdFolderZip } from 'react-icons/md'
import { IoMdArrowRoundDown } from 'react-icons/io'
import { IoCloseSharp } from 'react-icons/io5'
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'
import { getColors } from '../../../../../lib/utils.js'

const MessageContainer = () => {
  const scrollRef = useRef(null)
  const imageRef = useRef(null)

  const {
    selectedChatType,
    selectedChatData,
    setIsDownloading,
    setFileDownloadProgress,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages
  } = useAppStore()

  const [showImage, setShowImage] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)

  const isImage = (filePath) =>
    /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico|heic|heif)$/i.test(filePath)

  const downloadFile = async (fileUrl) => {
    try {
      setIsDownloading(true)
      setFileDownloadProgress(0)
      const res = await apiClient.get(`${HOST}/${fileUrl}`, {
        responseType: 'blob',
        withCredentials: true,
        onDownloadProgress: (data) => {
          const progress = Math.round((data.loaded * 100) / data.total)
          setFileDownloadProgress(progress)
        }
      })
      const blob = new Blob([res.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileUrl.split('/').pop())
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download error:', err)
    } finally {
      setIsDownloading(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (imageRef.current && !imageRef.current.contains(e.target)) {
        setShowImage(false)
      }
    }

    if (showImage) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showImage])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedChatMessages])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const url =
          selectedChatType === 'contact'
            ? GET_MESSAGES_ROUTE
            : `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`

        const res =
          selectedChatType === 'contact'
            ? await apiClient.post(url, { id: selectedChatData._id }, { withCredentials: true })
            : await apiClient.get(url, { withCredentials: true })

        if (res.data.messages) {
          setSelectedChatMessages(res.data.messages)
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    if (selectedChatData?._id) fetchMessages()
  }, [selectedChatData, selectedChatType])

  const FileContent = ({ fileUrl }) => (
    <div className="flex items-center justify-start gap-4">
      <span className="text-black text-2xl bg-gray-300 rounded-full p-2">
        <MdFolderZip />
      </span>
      <span>{fileUrl?.split('/').pop()}</span>
      <span
        onClick={() => downloadFile(fileUrl)}
        className="bg-gray-300 p-2 text-xl rounded-full hover:bg-gray-400 cursor-pointer"
      >
        <IoMdArrowRoundDown />
      </span>
    </div>
  )

  const ImageContent = ({ fileUrl }) => (
    <div className="cursor-pointer w-full" onClick={() => {
      setShowImage(true)
      setImageUrl(fileUrl)
    }}>
      <img
        src={`${HOST}/${fileUrl}`}
        alt="uploaded"
        className="w-full max-w-md h-auto rounded-md object-contain"
      />
    </div>
  )

  const DMMessage = ({ message }) => {
    const isSender = message.sender === selectedChatData?._id
    const msgClass = isSender ? 'items-start' : 'items-end'

    return (
      <div className={`flex flex-col ${msgClass} w-full`}>
        {message.messageType === 'text' && (
          <div className={`${isSender ? 'bg-white text-black border' : 'bg-purple-700 text-white'} p-4 rounded-lg my-1 max-w-[80%] break-words`}>
            {message.content}
          </div>
        )}

        {message.messageType === 'file' && (
          <div className={`${isSender ? 'bg-white text-black' : 'bg-purple-700 text-white'} p-1 rounded-lg my-1 max-w-[80%] break-words`}>
            {isImage(message.fileUrl)
              ? <ImageContent fileUrl={message.fileUrl} />
              : <FileContent fileUrl={message.fileUrl} />}
          </div>
        )}

        <span className="text-xs text-gray-500 mt-1">
          {moment(message.timestamp).format('LT')}
        </span>
      </div>
    )
  }

  const ChannelMessage = ({ message }) => {
    if (!message.sender) {
      return null 
    }
    const isSender = message.sender._id === userInfo._id
    const msgBoxClass = isSender ? 'bg-[#dcf8c6]' : 'bg-[#f0f0f0]'

    return (
      <div className={`w-full flex ${isSender ? 'justify-end' : 'justify-start'} mb-3`}>
        {!isSender && (
          <div className="flex items-start max-w-[85%]">
            <Avatar className="h-5 w-5 rounded-full overflow-hidden shrink-0">
              {message.sender.image ? (
                <img src={`${HOST}/${message.sender.image}`} alt="avatar" className="object-cover w-full h-full" />
              ) : (
                <AvatarFallback className={`uppercase h-5 w-5 text-sm flex justify-center items-center rounded-full ${getColors(message.sender.color)}`}>
                  {message.sender?.firstName?.[0] || message.sender?.email?.[0]}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="pl-2">
              <div className="text-xs text-gray-500 font-semibold mb-1">
                {message.sender.firstName} {message.sender.lastName}
              </div>
              <div className={`${msgBoxClass} text-black p-1 rounded-xl relative`}>
                {message.messageType === 'text' && <p className="text-sm break-words pr-10">{message.content}</p>}
                {message.messageType === 'file' && (
                  isImage(message.fileUrl)
                    ? <ImageContent fileUrl={message.fileUrl} />
                    : <FileContent fileUrl={message.fileUrl} />
                )}
                <span className="absolute bottom-1 right-2 text-[10px] text-gray-400">
                  {moment(message.timestamp).format('LT')}
                </span>
              </div>
            </div>
          </div>
        )}
        {isSender && (
          <div className="flex justify-end max-w-[85%]">
            <div className={`${msgBoxClass} text-black px-4 py-2 rounded-xl relative`}>
              {message.messageType === 'text' && <p className="text-sm break-words pr-10">{message.content}</p>}
              {message.messageType === 'file' && (
                isImage(message.fileUrl)
                  ? <ImageContent fileUrl={message.fileUrl} />
                  : <FileContent fileUrl={message.fileUrl} />
              )}
              <span className="absolute bottom-1 right-2 text-[10px] text-gray-600">
                {moment(message.timestamp).format('LT')}
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderMessages = () =>
  selectedChatMessages?.map((msg, index) => {
    if (!msg || (selectedChatType !== 'contact' && !msg.sender)) return null
    return selectedChatType === 'contact'
      ? <DMMessage key={index} message={msg} />
      : <ChannelMessage key={index} message={msg} />
  })


  return (
    <div className="w-full h-full overflow-y-auto p-4">
      {renderMessages()}
      <div ref={scrollRef} />

      {showImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div ref={imageRef} className="relative">
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => downloadFile(imageUrl)}
                className="text-white text-2xl bg-black/60 p-2 rounded-full hover:bg-black"
              >
                <IoMdArrowRoundDown />
              </button>
              <button
                onClick={() => setShowImage(false)}
                className="text-white text-2xl bg-black/60 p-2 rounded-full hover:bg-black"
              >
                <IoCloseSharp />
              </button>
            </div>
            <img
              src={`${HOST}/${imageUrl}`}
              alt="Preview"
              className="max-h-[80vh] max-w-[90vw] object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageContainer
