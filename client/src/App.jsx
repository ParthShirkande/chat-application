import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from '@/components/ui/button'

import { Card } from '@/components/ui/card'

import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Auth from '@/pages/Auth'
import { Navigate } from 'react-router-dom'
import Profile from './pages/profile'
import Chat from './pages/chat'
import { GET_USER_INFO } from './utils/constants'
import { useAppStore } from '@/store'
import { apiClient } from '@/lib/api-client'

const PrivateRoute = ({ children }) => {
  const {userInfo} = useAppStore()
  const isAuthenticated=!!userInfo
  return isAuthenticated ? children : <Navigate to="/auth" />;
}  

const AuthRoute = ({ children }) => {
  const {userInfo} = useAppStore()
  const isAuthenticated=!!userInfo
  return isAuthenticated ?  <Navigate to="/chat"/> : children ;
}

function App() {
  const {userInfo,setUserInfo} = useAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });
        if (response.data.id) {
          setUserInfo(response.data);
        }
        else{
          setUserInfo(null)
        }
        console.log("User data fetched:", response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    }
    getUserData();
  },[setUserInfo]);
  


  return (
   <BrowserRouter>
   <Routes>
    <Route path='/auth' element={<AuthRoute><Auth/></AuthRoute>}/>
    <Route path='/profile' element={<Profile/>}/>
    <Route path='/chat' element={<PrivateRoute><Chat/></PrivateRoute>}/>
    <Route path="*" element={<Navigate to="/auth"/>} />  
    </Routes>
    </BrowserRouter>
  )
}

export default App




//steps
// 1]app.listen(...) creates the HTTP server:
// 2]setupSocket(server) is immediately called after that:
// 3]Inside setupSocket, this line creates the Socket.IO server:
// 4]Socket.IO server is created on Express port.
//   It allows your server to handle WebSocket (real-time) connections on the same port as your Express HTTP server.
//   The cors options ensure that your frontend (usually on a different port, like 3000) is allowed to connect.
// 5]Frontend initiates connection using io(...).
// 6]Backend can now send/receive real-time events
// 7]Now that the socket is connected, you can:
// -> Emit events to this user:You want to emit events from server → client.
//  io.to(socketId).emit("newMessage", { ... })
// -> Listen for events from frontend: use when You want to receive data/events from a client.



//Client emits: socket.emit("SendMessage", message)
// Server listens: socket.on("SendMessage", ...)
// Server emits: io.to(...).emit("ReceiveMessage", message)
// Client listens: socket.on("ReceiveMessage", ...)

// on means to receive data
// emit means to send data