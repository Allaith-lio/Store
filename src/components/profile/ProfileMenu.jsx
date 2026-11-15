import {
  UserRound,
  Package,
  MapPin,
  CreditCard,
  LogOut,
} from "lucide-react";
import ProfileMenuItem from "./ProfileMenuItem";

const sections = [
  {
    title: "Account",
    items: [
      {
        icon: UserRound,
        title: "Profile",
        color: "bg-sky-400/15 text-sky-500",
        onClick: () => {},
      },
      {
        icon: Package,
        title: "My Orders",
        color: "bg-amber-400/15 text-amber-500",
        onClick: () => {},
      },
      {
        icon: MapPin,
        title: "My Addresses",
        color: "bg-emerald-400/15 text-emerald-500",
        onClick: () => {},
      },
      {
        icon: CreditCard,
        title: "Payment Methods",
        color: "bg-orange-400/15 text-orange-500",
        onClick: () => {},
      },
    ],
  },
];

const ProfileMenu = ({ onSelect, onLogout, activeSection }) => {

  return (
    <div className="mt-6 space-y-6">
      {sections.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-muted">
            {section.title}
          </p>

          <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface shadow-card">
            {section.items.map((item) => (
              <ProfileMenuItem
                key={item.title}
                {...item}
                active={activeSection === item.title}
                onClick={() => {
                  if (item.title === "Edit Profile") {
                    onSelect("Verify Password");
                  } else {
                    onSelect(item.title);
                  }
                }}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
        <ProfileMenuItem
          icon={LogOut}
          title="Log out"
          danger
          onClick={onLogout}
        />
      </div>
    </div>
  );
};

export default ProfileMenu;
