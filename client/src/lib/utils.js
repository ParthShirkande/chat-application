import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import searchanimationData from "../assets/Animation"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}



export const colors=[
  "bg-[#ff6d0055] text-[#ff6d00] border-[1px] border-[#ff6d00aa]",  // Bright orange
  "bg-[#8338ec2a] text-[#8338ec] border-[1px] border-[#8338ecbb]",  // Vivid violet
  "bg-[#3a86ff2a] text-[#3a86ff] border-[1px] border-[#3a86ffbb]",  // Bright blue
  "bg-[#ffbe0b2a] text-[#ffbe0b] border-[1px] border-[#ffbe0bbb]",  // Yellow orange
  "bg-[#2ec4b62a] text-[#2ec4b6] border-[1px] border-[#2ec4b6bb]",  // Teal green
  "bg-[#ef476f2a] text-[#ef476f] border-[1px] border-[#ef476fbb]"   // Pinkish red
]


export const getColors=(color)=>{
  if(color >=0 && color<colors.length){
    return colors[color];
  }
  return colors[0];
}

export const animationDefaultOptions = {
  animationData: searchanimationData,
  loop: true,
  autoplay: true
};