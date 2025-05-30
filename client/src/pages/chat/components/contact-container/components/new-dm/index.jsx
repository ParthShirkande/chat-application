import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react"
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
import Lottie from "lottie-react"
import { animationDefaultOptions } from "@/lib/utils"
import { SEARCH_CONTACT_ROUTE } from "@/utils/constants"
import { apiClient } from "@/lib/api-client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getColors } from "@/lib/utils"
import { Avatar,AvatarImage } from "@/components/ui/avatar"
import { HOST } from "@/utils/constants"
import { useAppStore } from "@/store"

const NewDM = () => {

    const  {selectedChatType,selectedChatData} =useAppStore()
    const  {setSelectedChatType,setSelectedChatData} =useAppStore()

    const [openNewContactModel, setopenNewContactModel] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);

    const searchContacts = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                console.log(searchTerm)
                const res = await apiClient.post(SEARCH_CONTACT_ROUTE, { searchTerm }, { withCredentials: true })
                if (res.status === 200 && res.data.contacts) {
                    setSearchedContacts(res.data.contacts);
                }
            }
            else {
                setSearchedContacts([]);
            }
        }
        catch (error) {
            console.log({ error });
        }
    }

    const selectNewContact=(contact)=>(e)=>{
        e.preventDefault();
        e.stopPropagation();
        setSelectedChatType("contact")
        setSelectedChatData(contact)
        setopenNewContactModel(false);
        setSearchedContacts([])
    }

    return (
    <>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                        onClick={() => setopenNewContactModel(true)} />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                    Select New Contact
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <Dialog open={openNewContactModel}   
        onOpenChange=
        {
            (isOpen) => 
            {
                setopenNewContactModel(isOpen);
                if (!isOpen) 
                {
                setSearchedContacts([]);
                }
            }
        }>
            <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        Please select a contact
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div>
                    <Input placeholder="Search Contacts" className="rounded-lg p-6 bg-[#2c2e3b] border-none" onChange={(e) => searchContacts(e.target.value)} />
                </div>
                <ScrollArea className="h-[250px]">
                    <div className="flex flex-col gap-5">
                        {
                            searchedContacts.map((contact) => (
                                <div key={contact._id} onClick={selectNewContact(contact)} className="flex gap-3 cursor-pointer items-center">
                                    <div className="relative w-12 h-12">
                                        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                            {
                                                contact.image ? (
                                                    <AvatarImage
                                                        src={`${HOST}/${contact.image}`}
                                                        alt="profile"
                                                        className="object-cover w-full h-full object-fill bg-black"
                                                    />
                                                ) : (
                                                    <div className={`uppercase h-12 w-12 text-lg border-[1px] flex justify-center items-center rounded-full ${getColors(contact.color)}`}>
                                                        {contact.firstName ? contact.firstName.charAt(0) : contact.email.charAt(0)}
                                                    </div>
                                                )
                                            }
                                        </Avatar>
                                    </div>
                                    <div className="flex flex-col">
                                    <span>
                                        {
                                            contact.firstName && contact.lastName
                                            ? `${contact.firstName} ${contact.lastName}`
                                            : contact.email
                                        }
                                    </span>
                                    <span className="text-xs">{contact.email}
                                    </span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </ScrollArea>
                {
                    searchedContacts.length <= 0 && (
                        <div className="flex-1  flex flex-col gap-10 justify-center items-center duration-300">
                            <div className="relative w-32 h-32">
                            <Lottie
                                animationData={animationDefaultOptions.animationData}
                                className="w-full h-full"
                                style={{ height: 100, width: 100 }}
                                onClick={() => {}} 
                            />
                        </div>
                            <div className="text-opacity-80 text-white flex flex-col mb-5 items-center mt-2 lg:text-2xl text-xl transition-all duration-300 text-center">
                                <h3 className="poppins-medium">
                                    Hi
                                    <span className="text-purple-500">! </span>
                                    Search new
                                    <span className="text-purple-500"> Contact.</span>
                                </h3>
                            </div>
                        </div>
                    )}
            </DialogContent>
        </Dialog>
        </>
    )
}

export default NewDM
