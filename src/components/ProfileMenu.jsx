import React from 'react'
import {UserRound,Package,MapPin ,CreditCard ,Settings, CircleHelp,LogOut} from 'lucide-react'
import ProfileMenuItem from './ProfileMenuItem'


const ProfileMenu = () => {
    const menuItems = [
        {icon: UserRound, title: "Edit Personal Information", onClick: () => {}},
        {icon:Package, title:"my orders", onClick:()=>{}},
        {icon:MapPin, title:"my address", onClick:()=>{}},
        {icon:CreditCard, title:"payment methods", onClick:()=>{}},
        {icon:Settings, title:"settings", onClick:()=>{}},
        {icon:CircleHelp, title:"help center", onClick:()=>{}},
        {icon:LogOut, title:"logout", onClick:()=>{}}
    ]
  return (
    <div className="mt-8">
      {menuItems.map((item, index) => (
        <ProfileMenuItem
          key={index}
          icon={item.icon}
          title={item.title}
          onClick={item.onClick}
        />
      ))}
      
    </div>
  )
}

export default ProfileMenu
