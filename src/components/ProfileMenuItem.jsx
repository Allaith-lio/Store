import { ChevronRight } from 'lucide-react';

import React from 'react'

const profileMenuItem = ({icon:Icon ,title ,onClick}) => {
  return (
   <>
   <button onClick={onClick} className='flex items-center justify-between w-full px-3 py-5 
   hover:bg-blue-50 transition-rounded-xl'>
    <div className='flex items-center gap-5'>
        <Icon size={23} className='text-gray-600'/>
        <span className='text-gray-700 font-meduium'>{title}</span>
    </div>
    <ChevronRight size={20} className='text-gray-400'/>

   </button>
   </>
  )
}

export default profileMenuItem
