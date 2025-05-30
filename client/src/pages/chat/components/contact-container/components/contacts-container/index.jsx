import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTE } from "@/utils/constants"
import { apiClient } from "@/lib/api-client"
import { getColors } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { HOST } from "@/utils/constants"
import { useAppStore } from "@/store"
import { Button } from "@/components/ui/button"
import MultipleSelector from "@/components/ui/multipleselect"
const CreateChannel = ({ onChannelCreated }) => {
  const { addChannels } = useAppStore();
  const [newChannelModel, setNewChannelModel] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);


  
  useEffect(() => {
    const getData = async () => {
      const res = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
        withCredentials: true,
      });
      setAllContacts(res.data.contacts);
      setFilteredContacts(res.data.contacts);
    };
    getData();
  }, []);
  
  const createChannels = async () => {
    try {
      const res = await apiClient.post(
        CREATE_CHANNEL_ROUTE,
        {
          name: channelName,
          members: selectedContact.map((c) => c.value),
        },
        { withCredentials: true }
      );
      
      if (res.status === 201) {
        setChannelName("");
        setSelectedContact([]);
        setNewChannelModel(false);
        
        // Update state
        addChannels(res.data.channel);

        if (onChannelCreated) onChannelCreated();
      }
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };



    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                            onClick={() => setNewChannelModel(true)} />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                        Select New Channel
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>
                            Please fill up the details for new channel.
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder="Channel Name" value={channelName} className="rounded-lg p-6 bg-[#2c2e3b] border-none" onChange={(e) => setChannelName(e.target.value)} />
                    </div>
                    <div>
                        <MultipleSelector
                            className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                            options={filteredContacts}
                            placeholder="Search Contacts"
                            value={selectedContact}
                            onChange={setSelectedContact}
                            emptyIndicator={
                                <p className="text-center text-lg leading-10 text-green-600">
                                    No result found
                                </p>
                            }
                        />

                    </div>
                    <div>
                        <Button className="bg-purple-700 w-full transition-all duration-300 hover:bg-purple-900" onClick={() => { createChannels() }}>
                            Create Channel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CreateChannel