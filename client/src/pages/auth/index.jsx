import { Tabs, TabsList } from "@/components/ui/tabs";
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import Victory from "../../assets/victory.svg";
import Background from "../../assets/login2.png";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client.js";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/index.js";

export default function Auth() {

  const navigate = useNavigate();
  const {setUserInfo} = useAppStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlelogin = async () => {
    if (validateLogin()) {
      try {
        const response = await apiClient.post(LOGIN_ROUTE, {email,password,},{withCredentials: true});
        if(response.data.user.id){
            setUserInfo(response.data.user)
        if(response.data.user.profileSetup)navigate("/chat")
            else navigate("/profile")
        }
        if (response.status === 200) {
          console.log("Login successful:", response.data);
          toast.success("Login successful!")
          setEmail("");
          setPassword("");
        }
      } catch (error) {      
        const errorMessage = error.response?.data?.message || "Error occurred during login";
        toast.error(errorMessage);
        console.error("Login error:", error);
      }
    }
  }
  const validateLogin = () => {
    if (!email.length) {  
      toast.error("Email is required")
      return false
    }
    if (!password.length) {
      toast.error("Password is required") 
      return false
    }
    return true;
  }
  const handlesignup = async () => {
    if (validateSignup()) {
      try {
        const response = await apiClient.post(SIGNUP_ROUTE, {
          email,
          password, 
        });
        if (response.status === 201) {
          setUserInfo(response.data.user)
          console.log("userinfo",setUserInfo)

          navigate("/profile")
          console.log("Signup successful:", response.data);
          toast.success("Signup successful!")
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        }
      } catch (error) {   
        if (error.response?.status === 409) {
          toast.error("This email is already registered");
          setPassword("");
          setConfirmPassword("");
          return;
      }   
        const errorMessage = error.response?.data?.message || "Error occurred during signup";
        toast.error(errorMessage);
        console.error("Signup error:", error);
      }
    }
  }

  const validateSignup = () => {

    if (!email.length) {  
      toast.error("Email is required")
      return false
    }
    if (!password.length) {
      toast.error("Password is required")
      return false
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password should be same")
      return false
    }
    return true;
  }
  return (
    // authentication of chat app
    <div className="h-[100vh] w-[100vw] flex justify-center items-center bg-[#f0f0f0]">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-50 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:[60vw] rounded-3xl  grid xl:grid-cols-2">
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <div className="text-4xl font-bold md:text-6xl text-[#1e1e1e] flex">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="background" className=" h-[100px] pb-10 md:pb-5" />
            </div>
            <p className="text-center font-medium">Fill in the details to get started with the best chat app !</p>
          </div>
          <div className="flex w-full justify-center items-center ">
            <Tabs className="w-3/4" defaultValue="login" >
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font=semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300" value="login">Login</TabsTrigger>
                <TabsTrigger className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font=semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300" value="signup">Signup</TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 " value="login">
                <Input placeholder="Email" className="rounded-full p-6 " value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input placeholder="Password" className="rounded-full p-6 mt-4" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button className="rounded-full p-6 mt-4 bg-[#1e1e1e] text-white hover:bg-[#1e1e1e]/80" onClick={handlelogin}>Login</Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5 " value="signup">
                <Input placeholder="Email" className="rounded-full p-6 " value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input placeholder="Password" className="rounded-full p-6 mt-4" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Input placeholder="Confirm Password" className="rounded-full p-6 mt-4" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <Button className="rounded-full p-6 mt-4 bg-[#1e1e1e] text-white hover:bg-[#1e1e1e]/80" onClick={handlesignup}>Signup</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="flex justify-center items-center ">
          {/* <img src={Background} alt="background login" className="h-[80vh] w-[80vw] md:w-[90vw] lg:w-[70vw] xl:[60vw] rounded-3xl" /> */}
        </div>
      </div>
    </div>
  );
}