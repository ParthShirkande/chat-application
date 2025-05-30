import { animationDefaultOptions } from "@/lib/utils"
import Lottie from "lottie-react"

const EmptyChatContainer = () => {
  return (
    <div className=" flex-1  md:bg-[#c5caf6] md:flex flex-col justify-center items-center hidden   duration-300">
      <Lottie 
      animationData={animationDefaultOptions.animationData}
      style={{ height: 300, width: 300 }}
      />
      <div className="text-opaacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
        <h3 className="poppins-medium">
          Hi 
          <span className="text-purple-500">! </span>
          Welcome to 
          <span className="text-purple-500"> Synchronous</span>
          Chat App
          <span className="text-purple-500"></span>
        </h3>
      </div>
    </div>
  )
}

export default EmptyChatContainer
