import ProfileMenu from "../components/profile/ProfileMenu";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Check,
  CreditCard,
  Pencil,
  MapPin,
  Package,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import {
  getCurrentUser,
  getStoreOrders,
  logoutUser,
  updateCurrentUser,
  verifyCurrentPassword,
} from "../services/dashboardService";

const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const emptyAddress = {
  label: "",
  fullName: "",
  address: "",
  city: "",
  region: "",
  postalCode: "",
  country: "",
  phone: "",
};

function readUserCollection(key, userId) {
  if (!userId) return [];
  return JSON.parse(localStorage.getItem(`${key}:${userId}`) || "[]");
}

function saveUserCollection(key, userId, items) {
  if (!userId) throw new Error("Please sign in to save this information.");
  localStorage.setItem(`${key}:${userId}`, JSON.stringify(items));
}

function getCardBrand(number) {
  if (number.startsWith("4")) return "Visa";
  if (/^5[1-5]/.test(number)) return "Mastercard";
  if (/^3[47]/.test(number)) return "American Express";
  return "Card";
}

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getCurrentUser());
  const [orders] = useState(() => getStoreOrders());
  const [activeSection, setActiveSection] = useState("");
  const [addresses, setAddresses] = useState(() =>
    readUserCollection("storeAddresses", getCurrentUser()?.id),
  );
  const [paymentMethods, setPaymentMethods] = useState(() =>
    readUserCollection("storePaymentMethods", getCurrentUser()?.id),
  );
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [cardForm, setCardForm] = useState({
    holder: "",
    number: "",
    expiry: "",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState(() => {
    const currentUser = getCurrentUser();
    return {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
    };
  });
  const name = user?.name || "Guest";
  const email = user?.email || "Sign in to manage your profile";
  const avatar = user?.avatar || defaultAvatar;
  const userOrders = orders
    .filter((order) => order.email === user?.email)
    .sort((first, second) => new Date(second.date) - new Date(first.date));

  function persistCollection(key, items) {
    try {
      saveUserCollection(key, user?.id, items);
      return true;
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to save your changes.");
      return false;
    }
  }

  function handleAddressSubmit(event) {
    event.preventDefault();
    const updatedAddresses = editingAddressId
      ? addresses.map((address) =>
          address.id === editingAddressId
            ? { ...address, ...addressForm }
            : address,
        )
      : [
          ...addresses,
          {
            ...addressForm,
            id: crypto.randomUUID(),
            isDefault: addresses.length === 0,
          },
        ];
    if (!persistCollection("storeAddresses", updatedAddresses)) return;
    setAddresses(updatedAddresses);
    setAddressForm(emptyAddress);
    setShowAddressForm(false);
    setEditingAddressId(null);
    setNotice(editingAddressId ? "Address updated." : "Address saved.");
  }

  function editAddress(address) {
    setAddressForm({
      label: address.label,
      fullName: address.fullName,
      address: address.address,
      city: address.city,
      region: address.region || "",
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone || "",
    });
    setEditingAddressId(address.id);
    setShowAddressForm(true);
  }

  function setDefaultAddress(addressId) {
    const updatedAddresses = addresses.map((address) => ({
      ...address,
      isDefault: address.id === addressId,
    }));
    if (!persistCollection("storeAddresses", updatedAddresses)) return;
    setAddresses(updatedAddresses);
  }

  function removeAddress(addressId) {
    const remaining = addresses.filter((address) => address.id !== addressId);
    if (addresses.find((address) => address.id === addressId)?.isDefault && remaining.length) {
      remaining[0] = { ...remaining[0], isDefault: true };
    }
    if (!persistCollection("storeAddresses", remaining)) return;
    setAddresses(remaining);
  }

  function handleCardSubmit(event) {
    event.preventDefault();
    const number = cardForm.number.replace(/\D/g, "");
    if (number.length < 12 || number.length > 19) {
      setNotice("Enter a valid card number (12–19 digits).");
      return;
    }
    const paymentMethod = {
      id: crypto.randomUUID(),
      holder: cardForm.holder.trim(),
      brand: getCardBrand(number),
      last4: number.slice(-4),
      expiry: cardForm.expiry,
      isDefault: paymentMethods.length === 0,
    };
    const updatedMethods = [...paymentMethods, paymentMethod];
    if (!persistCollection("storePaymentMethods", updatedMethods)) return;
    setPaymentMethods(updatedMethods);
    setCardForm({ holder: "", number: "", expiry: "" });
    setShowCardForm(false);
    setNotice("Payment method saved. Only its last four digits are stored.");
  }

  function setDefaultPayment(paymentId) {
    const updatedMethods = paymentMethods.map((method) => ({
      ...method,
      isDefault: method.id === paymentId,
    }));
    if (!persistCollection("storePaymentMethods", updatedMethods)) return;
    setPaymentMethods(updatedMethods);
  }

  function removePayment(paymentId) {
    const remaining = paymentMethods.filter((method) => method.id !== paymentId);
    if (paymentMethods.find((method) => method.id === paymentId)?.isDefault && remaining.length) {
      remaining[0] = { ...remaining[0], isDefault: true };
    }
    if (!persistCollection("storePaymentMethods", remaining)) return;
    setPaymentMethods(remaining);
  }

  function handleProfileSave(event) {
    event.preventDefault();
    try {
      const updatedUser = updateCurrentUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
      });
      setUser(updatedUser);
      setNotice("Your profile has been updated.");
      setActiveSection("");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to update your profile.");
    }
  }

  async function handleVerifyPassword(event) {
    event.preventDefault();
    setPasswordError("");
    try {
      if (!(await verifyCurrentPassword(password))) {
        setPasswordError("The password is incorrect.");
        return;
      }
      setForm({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
      });
      setShowPasswordModal(false);
      setPassword("");
      setActiveSection("Edit Profile");
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Unable to verify your password.");
    }
  }

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
          activeSection={activeSection}
          onLogout={() => {
            logoutUser();
            navigate("/", { replace: true });
          }}
          onSelect={(section) => {
            if (section === "Verify Password") {
              setPassword("");
              setPasswordError("");
              setShowPasswordModal(true);
            } else {
              setNotice("");
              setActiveSection(section);
            }
          }}
        />
      </section>
      <section className="p-4 lg:p-8">
        {notice && (
          <p className="mb-4 rounded-control border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary" role="status">
            {notice}
          </p>
        )}
        {activeSection === "Edit Profile" && (
          <div className="rounded-card border border-line bg-surface p-6 shadow-card">
            <h2 className="mb-2 text-2xl font-bold text-ink">Edit Profile</h2>

            <p className="mb-6 text-sm text-muted">
              Update your personal information.
            </p>

            <form className="space-y-5" onSubmit={handleProfileSave}>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Enter your full name"
                  required
                  minLength={2}
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none focus:border-primary"
                />
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
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:opacity-90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {activeSection === "My Orders" && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Your account</p>
                <h2 className="mt-1 text-2xl font-bold text-ink">My Orders</h2>
                <p className="mt-1 text-sm text-muted">Track your purchases and review order details.</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                {userOrders.length} {userOrders.length === 1 ? "order" : "orders"}
              </span>
            </div>

            {userOrders.length ? (
              userOrders.map((order) => (
                <article key={order.id} className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-page/60 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-control bg-amber-400/15 text-amber-500">
                        <Package size={20} />
                      </span>
                      <div>
                        <p className="font-semibold text-ink">{order.id}</p>
                        <p className="text-xs text-muted">
                          {Number.isNaN(new Date(order.date).getTime())
                            ? order.date
                            : new Date(order.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                        </p>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                      order.status === "Delivered"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : order.status === "Shipped"
                          ? "bg-sky-500/10 text-sky-600"
                          : "bg-amber-500/10 text-amber-600"
                    }`}>
                      {order.status || "Processing"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-ink">{order.items || "Order items"}</p>
                      <p className="mt-1 text-xs text-muted">
                        {order.quantity || 1} {Number(order.quantity || 1) === 1 ? "item" : "items"}
                      </p>
                    </div>
                    <p className="font-heading text-lg font-bold text-ink">
                      ${Number(order.total || 0).toFixed(2)}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-card border border-dashed border-line bg-surface px-6 py-12 text-center shadow-card">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Package size={25} />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink">No orders yet</h3>
                <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
                  When you place an order, its status and details will appear here.
                </p>
                <Link to="/products" className="btn btn-primary mt-5 inline-flex px-5 py-2.5">
                  Start shopping
                </Link>
              </div>
            )}
          </div>
        )}

        {activeSection === "My Addresses" && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Delivery details</p>
                <h2 className="mt-1 text-2xl font-bold text-ink">My Addresses</h2>
                <p className="mt-1 text-sm text-muted">Save and manage the places you ship to.</p>
              </div>
              {!showAddressForm && user && (
                <button
                  type="button"
                  onClick={() => {
                    setAddressForm(emptyAddress);
                    setEditingAddressId(null);
                    setShowAddressForm(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  <Plus size={17} /> Add address
                </button>
              )}
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddressSubmit} className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
                <h3 className="mb-4 text-lg font-semibold text-ink">
                  {editingAddressId ? "Edit delivery address" : "New delivery address"}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["label", "Address label", "Home, work..."],
                    ["fullName", "Recipient name", "Full name"],
                    ["address", "Street address", "House number and street"],
                    ["city", "City", "City"],
                    ["region", "State / region", "State or region"],
                    ["postalCode", "Postal code", "Postal code"],
                    ["country", "Country", "Country"],
                    ["phone", "Phone number", "Phone number"],
                  ].map(([field, label, placeholder]) => (
                    <label key={field} className={`grid gap-1.5 text-sm font-medium text-ink ${field === "address" ? "sm:col-span-2" : ""}`}>
                      {label}
                      <input
                        required={field !== "region" && field !== "phone"}
                        type={field === "phone" ? "tel" : "text"}
                        value={addressForm[field]}
                        onChange={(event) => setAddressForm((current) => ({ ...current, [field]: event.target.value }))}
                        placeholder={placeholder}
                        autoComplete={field === "address" ? "street-address" : field === "city" ? "address-level2" : field === "postalCode" ? "postal-code" : "off"}
                        className="w-full rounded-xl border border-line bg-page px-4 py-3 text-ink outline-none focus:border-primary"
                      />
                    </label>
                  ))}
                </div>
                <div className="mt-5 flex justify-end gap-3">
                  <button type="button" onClick={() => {
                    setShowAddressForm(false);
                    setEditingAddressId(null);
                    setAddressForm(emptyAddress);
                  }} className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:bg-page">Cancel</button>
                  <button type="submit" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">
                    {editingAddressId ? "Update address" : "Save address"}
                  </button>
                </div>
              </form>
            )}

            {!user ? (
              <div className="rounded-card border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
                <Link to="/login?mode=login" className="font-semibold text-primary hover:underline">Sign in</Link> to save delivery addresses.
              </div>
            ) : addresses.length ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {addresses.map((address) => (
                  <article key={address.id} className="rounded-card border border-line bg-surface p-5 shadow-card">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-control bg-emerald-400/15 text-emerald-500"><MapPin size={20} /></span>
                        <div>
                          <h3 className="font-semibold text-ink">{address.label}</h3>
                          {address.isDefault && <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"><Check size={13} /> Default address</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => editAddress(address)} aria-label={`Edit ${address.label} address`} className="rounded-lg p-2 text-muted hover:bg-primary/10 hover:text-primary"><Pencil size={16} /></button>
                        <button type="button" onClick={() => removeAddress(address.id)} aria-label={`Remove ${address.label} address`} className="rounded-lg p-2 text-muted hover:bg-red-500/10 hover:text-red-500"><Trash2 size={17} /></button>
                      </div>
                    </div>
                    <div className="mt-4 space-y-1 text-sm text-muted">
                      <p className="font-medium text-ink">{address.fullName}</p>
                      <p>{address.address}</p>
                      <p>{[address.city, address.region, address.postalCode].filter(Boolean).join(", ")}</p>
                      <p>{address.country}</p>
                      {address.phone && <p>{address.phone}</p>}
                    </div>
                    {!address.isDefault && (
                      <button type="button" onClick={() => setDefaultAddress(address.id)} className="mt-4 text-sm font-semibold text-primary hover:underline">Set as default</button>
                    )}
                  </article>
                ))}
              </div>
            ) : !showAddressForm && (
              <div className="rounded-card border border-dashed border-line bg-surface px-6 py-10 text-center shadow-card">
                <MapPin className="mx-auto text-emerald-500" size={27} />
                <h3 className="mt-3 font-semibold text-ink">No saved addresses</h3>
                <p className="mt-1 text-sm text-muted">Add an address to make your next delivery easier.</p>
              </div>
            )}
          </div>
        )}

        {activeSection === "Payment Methods" && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Checkout preferences</p>
                <h2 className="mt-1 text-2xl font-bold text-ink">Payment Methods</h2>
                <p className="mt-1 text-sm text-muted">Manage the payment options saved to your account.</p>
              </div>
              {!showCardForm && user && (
                <button type="button" onClick={() => setShowCardForm(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">
                  <Plus size={17} /> Add card
                </button>
              )}
            </div>

            <div className="flex items-start gap-3 rounded-control border border-line bg-page/60 p-4 text-sm text-muted">
              <ShieldCheck className="mt-0.5 shrink-0 text-primary" size={19} />
              <p>For your safety, only the cardholder name, brand, last four digits, and expiry are saved here. Never enter your CVV; card details are not sent to a payment processor.</p>
            </div>

            {showCardForm && (
              <form onSubmit={handleCardSubmit} className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
                <h3 className="mb-4 text-lg font-semibold text-ink">Add a card</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-medium text-ink sm:col-span-2">
                    Cardholder name
                    <input required value={cardForm.holder} onChange={(event) => setCardForm((current) => ({ ...current, holder: event.target.value }))} autoComplete="cc-name" className="w-full rounded-xl border border-line bg-page px-4 py-3 text-ink outline-none focus:border-primary" placeholder="Name on card" />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium text-ink sm:col-span-2">
                    Card number
                    <input required inputMode="numeric" autoComplete="cc-number" maxLength={23} value={cardForm.number} onChange={(event) => setCardForm((current) => ({ ...current, number: event.target.value.replace(/[^\d\s-]/g, "") }))} className="w-full rounded-xl border border-line bg-page px-4 py-3 text-ink outline-none focus:border-primary" placeholder="Card number (never stored)" />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium text-ink">
                    Expiration
                    <input required type="month" min={new Date().toISOString().slice(0, 7)} autoComplete="cc-exp" value={cardForm.expiry} onChange={(event) => setCardForm((current) => ({ ...current, expiry: event.target.value }))} className="w-full rounded-xl border border-line bg-page px-4 py-3 text-ink outline-none focus:border-primary" />
                  </label>
                </div>
                <div className="mt-5 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowCardForm(false)} className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:bg-page">Cancel</button>
                  <button type="submit" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">Save payment method</button>
                </div>
              </form>
            )}

            {!user ? (
              <div className="rounded-card border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
                <Link to="/login?mode=login" className="font-semibold text-primary hover:underline">Sign in</Link> to manage your payment methods.
              </div>
            ) : paymentMethods.length ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {paymentMethods.map((method) => (
                  <article key={method.id} className="rounded-card border border-line bg-surface p-5 shadow-card">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-11 items-center justify-center rounded-control bg-orange-400/15 text-orange-500"><CreditCard size={21} /></span>
                        <div>
                          <h3 className="font-semibold text-ink">{method.brand} ending in {method.last4}</h3>
                          <p className="mt-1 text-xs text-muted">{method.holder}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => removePayment(method.id)} aria-label={`Remove ${method.brand} ending in ${method.last4}`} className="rounded-lg p-2 text-muted hover:bg-red-500/10 hover:text-red-500"><Trash2 size={17} /></button>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-sm">
                      <span className="text-muted">Expires {method.expiry}</span>
                      {method.isDefault ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"><Check size={13} /> Default</span>
                      ) : (
                        <button type="button" onClick={() => setDefaultPayment(method.id)} className="text-xs font-semibold text-primary hover:underline">Set as default</button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : !showCardForm && (
              <div className="rounded-card border border-dashed border-line bg-surface px-6 py-10 text-center shadow-card">
                <CreditCard className="mx-auto text-orange-500" size={28} />
                <h3 className="mt-3 font-semibold text-ink">No saved payment methods</h3>
                <p className="mt-1 text-sm text-muted">Add a card to keep your checkout preferences in one place.</p>
              </div>
            )}
          </div>
        )}
      </section>
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleVerifyPassword} className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl">
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              minLength={8}
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none focus:border-primary"
            />
            {passwordError && (
              <p className="mt-3 text-sm text-red-500" role="alert">{passwordError}</p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                  setPasswordError("");
                }}
                className="flex-1 rounded-xl border border-line px-4 py-3 text-ink hover:bg-page"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 rounded-xl bg-primary px-4 py-3 text-white hover:opacity-90"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
