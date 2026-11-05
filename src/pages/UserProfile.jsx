import ProfileMenu from "../components/profile/ProfileMenu";
import { useState } from "react";

const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const UserProfile = ({
  name = "John Doe",
  email = "john.doe@example.com",
  avatar = defaultAvatar,
}) => {
  const [activeSection, setActiveSection] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  return (
    <div className="p-4 lg:grid lg:grid-cols-[40%_60%] lg:p-0 lg:min-h-[calc(100vh-5rem)]">
      {/* Right Profile Section */}
      <section className="p-4 lg:flex lg:flex-col lg:justify-center lg:px-10 lg:py-8 xl:px-16">
        <div className="relative overflow-hidden rounded-card border border-line bg-surface p-6 text-center shadow-card">
          <span className="absolute -right-8 -top-8 size-28 rounded-full bg-accent/30" />
          <span className="absolute -bottom-10 -left-10 size-32 rounded-full bg-primary/20" />

          <div className="relative">
            <img
              src={avatar}
              alt={`${name} profile`}
              className="mx-auto size-24 rounded-full border-4 border-surface object-cover shadow-raised ring-2 ring-primary"
            />

            <h2 className="mt-4 text-xl">{name}</h2>
            <p className="mt-1 text-sm text-muted">{email}</p>
          </div>
        </div>

        <ProfileMenu
          onSelect={(section) => {
            if (section === "Verify Password") {
              setShowPasswordModal(true);
            } else {
              setActiveSection(section);
            }
          }}
        />
      </section>
      <section className="p-4 lg:p-8">
        {activeSection === "Edit Profile" && (
          <div className="rounded-card border border-line bg-surface p-6 shadow-card">
            <h2 className="mb-2 text-2xl font-bold text-ink">Edit Profile</h2>

            <p className="mb-6 text-sm text-muted">
              Update your personal information.
            </p>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={name}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={email}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveSection("")}
                className="rounded-xl border border-line px-5 py-3 text-ink hover:bg-page"
              >
                Cancel
              </button>

              <button
                type="button"
                className="rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:opacity-90"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {activeSection === "My Orders" && (
          <div className="rounded-card border border-line bg-surface p-6 shadow-card">
            <h2 className="text-2xl font-bold text-ink">My Orders</h2>
          </div>
        )}

        {activeSection === "My Addresses" && (
          <div className="rounded-card border border-line bg-surface p-6 shadow-card">
            <h2 className="text-2xl font-bold text-ink">My Addresses</h2>
          </div>
        )}

        {activeSection === "Payment Methods" && (
          <div className="rounded-card border border-line bg-surface p-6 shadow-card">
            <h2 className="text-2xl font-bold text-ink">Payment Methods</h2>
          </div>
        )}
      </section>
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-ink">
                  Verify Your Password
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Enter your password to edit your profile.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="rounded-lg p-2 text-muted transition hover:bg-page hover:text-ink"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none focus:border-primary"
            />

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 rounded-xl border border-line px-4 py-3 text-ink hover:bg-page"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setActiveSection("Edit Profile");
                }}
                className="flex-1 rounded-xl bg-primary px-4 py-3 text-white hover:opacity-90"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
