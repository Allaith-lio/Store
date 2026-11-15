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
        title: "Edit Profile",
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
  // const handleContinue = () => {
  //   if (!password.trim()) return;

  //   // واجهة تجريبية فقط، بدون تحقق حقيقي من كلمة المرور
  //   setShowPasswordModal(false);
  //   setPassword("");
  // };

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
      {/* { (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

        <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl">

            <h2 className="text-xl font-bold text-ink">
                Verify Your Password
            </h2>

           <div className="mb-4 flex items-center justify-between">
    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <LockKeyhole size={24} />
    </div>

    <button
        type="button"
        onClick={() => {
            setShowPasswordModal(false);
            setPassword('');
        }}
        className="rounded-lg p-2 text-muted transition hover:bg-page hover:text-ink"
        aria-label="Close"
    >
        <X size={20} />
    </button>
</div>

<h2 className="text-xl font-bold text-ink">
    Verify Your Password
</h2>

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-5 w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none focus:border-primary"
            />

            <div className="mt-5 flex gap-3">

                <button
                    type="button"
                    onClick={() => {
                        setShowPasswordModal(false);
                        setPassword('');
                    }}
                    className="flex-1 rounded-xl border border-line px-4 py-3"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    disabled={!password.trim()}
                   onClick={handleContinue}
                    className="flex-1 rounded-xl bg-primary px-4 py-3 text-white disabled:opacity-50"
                >
                    Continue
                </button>

            </div>
        </div>
    </div>
    )} */}
    </div>
  );
};

export default ProfileMenu;
