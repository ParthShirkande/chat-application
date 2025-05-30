import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import {createContext,useEffect,useContext,useRef} from 'react'
import { io } from 'socket.io-client'


const SocketContext = createContext(null);
// React Context is created to globally provide the socket instance to components that need it.


//A helper hook to easily access the socket instance from any component.
export const useSocket=()=>{
    return useContext(SocketContext)
}


// provider component to initialize and manage the socket connection.
export const SocketProvider=({children})=>{
    const socket = useRef()     //Uses useRef() so the socket instance persists across renders.
    const {userInfo}=useAppStore()
 
    console.log(userInfo)

    useEffect(()=>{
        
        if(userInfo){   
        //Connects to the backend Socket.IO server using:
            socket.current = io(HOST,{
                withCredentials:true,
                query:{
                    userId:userInfo.id,
                }  
            })
            socket.current.on("connect",()=>{
                console.log(`Connected to socket server with id : ${socket.current.id}`)
            })

            const handleReceiveMessage=(message)=>{
                const {selectedChatData,selectedChatType,addMessage,userInfo,addContactsInDMContacts}=useAppStore.getState()
                if (selectedChatType!==undefined  &&
                    (
                      selectedChatData._id === message.sender._id ||
                      selectedChatData._id === message.recipient._id
                    )
                  ) {
                    addMessage(message);
                  }
                  
                console.log("Message received in selected chat",message)
                addContactsInDMContacts(message)
        }
        
        const handleReceiveChannelMessage=(message)=>{
            const {selectedChatData,selectedChatType,addMessage,addChannelInChannelList}=useAppStore.getState()
            if(selectedChatType!==undefined && selectedChatData?._id === message.channelId){
                console.log("message rcv",message)
                addMessage(message)
            }
            addChannelInChannelList(message)
        }

            socket.current.on("ReceiveMessage",handleReceiveMessage)
            socket.current.on("Receive-Channel-Message",handleReceiveChannelMessage)

            return () => {
                socket.current.disconnect()
                console.log(`Disconnected from socket server with id : ${socket.current.id}`)
            }
        }
    },[userInfo])


    

    //Makes the socket instance available to all child components via React Context.
    return (
        <SocketContext.Provider value={socket.current}>
        {children}
    </SocketContext.Provider>
)
}
