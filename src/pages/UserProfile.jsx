import React from 'react'
import ProfileMenu from '../components/ProfileMenu'

const UserProfile = () => {
  return (
    <div className="flex flex-col item-center pt-8">
  
            <img
      src="path/to/image.jpg"
      alt="Profile Image"
      className="w-24 h-24 rounded-full object-cover"
    />

    <h2 className="text-xl font-semibold mt-4">John Doe</h2>
    <p className="text-gray-400 text-sm mt-1">
      Software Developer
    </p>

    <ProfileMenu />
      
    </div>
    
  )
}

export default UserProfile
