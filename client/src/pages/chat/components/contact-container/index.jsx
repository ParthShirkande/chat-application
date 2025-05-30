import { Profiler, useEffect } from "react";
import ProfileInfo from "./components/profile-info";
import NewDM from "./components/new-dm";
import { apiClient } from "@/lib/api-client";
import { GET_CONTACTS_FOR_DM_ROUTE, GET_USER_CHANNEL_ROUTE } from "@/utils/constants";
import { Contact } from "lucide-react";
import ContactList from "@/components/ui/contact-list";
import { useAppStore } from "@/store";
import CreateChannel from "./components/contacts-container";

const ContactContainer = () => {
  const {setDirectMessagesContacts,directMessagesContacts, channels,setChannels} = useAppStore()

     useEffect(() => {
    if (channels && channels.length > 0) {
      console.log("Channels list:");
      channels.forEach((channel, idx) => {
        console.log(`Channel ${idx + 1}:`, channel);
      });
    }
  }, [channels]);



  useEffect(() => {
    const getContacts = async () => {
      const res = await apiClient.get(GET_CONTACTS_FOR_DM_ROUTE, {
        withCredentials: true,
      });
      if(res.data.contacts){
      setDirectMessagesContacts(res.data.contacts)
      }
    }
    getContacts();
    
    
    const getChannels = async () => {
      const res = await apiClient.get(GET_USER_CHANNEL_ROUTE, {
        withCredentials: true,
      });
      if(res.data.channels){
      setChannels(res.data.channels)
      }
    }
    getChannels(); 


  },[setChannels,setDirectMessagesContacts])

  return (
    <div className="relative   md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-60px">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="mb-2 flex  items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className=" border-[#2f303b] max-h-[30vh] overflow-y-auto scrollbar-hide">
          <ContactList contacts={directMessagesContacts}/>
        </div> 
      </div>
      {/* <div className="border-b-2 border-[#2f303b]"></div> */}
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel/>
        </div>
         <div className=" border-[#2f303b] max-h-[30vh] overflow-y-auto scrollbar-hide">
          <ContactList contacts={channels} isChannel={true}/>
        </div> 
      </div>
      <ProfileInfo />
    </div>
  )
}

export default ContactContainer


const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "}
      </svg>
      <span className="text-3xl font-semibold ">Synchronous</span>
    </div>
  );
};


const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">{text}</h6>
  )
}