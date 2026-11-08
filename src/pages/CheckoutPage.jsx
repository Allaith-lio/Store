import {
  Check,
  CreditCard,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
  Truck,
  UserRound,
  Mail,
  MapPin,
  Building2,
  Hash,
  Phone,
  ShoppingBag,
  CheckCircle2
} from "lucide-react";
import InputField from "../components/common/InputField";
import { useState } from "react";
import { Link } from "react-router-dom";

const checkoutFields = {
  firstName: {
    label: "First name",
    placeholder: "Your first name",
    autoComplete: "given-name",
    icon: UserRound,
  },

  lastName: {
    label: "Last name",
    placeholder: "Your last name",
    autoComplete: "family-name",
    icon: UserRound,
  },

  email: {
    label: "Email address",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
    icon: Mail,
    wrapperClassName: "sm:col-span-2",
  },

  address: {
    label: "Street address",
    placeholder: "House number and street name",
    autoComplete: "street-address",
    icon: MapPin,
    wrapperClassName: "sm:col-span-2",
  },

  city: {
    label: "City",
    placeholder: "City",
    autoComplete: "address-level2",
    icon: Building2,
  },

  postalCode: {
    label: "Postal code",
    placeholder: "Postal code",
    autoComplete: "postal-code",
    icon: Hash,
  },

  phone: {
    label: "Phone number (optional)",
    type: "tel",
    placeholder: "+1 (555) 000-0000",
    autoComplete: "tel",
    icon: Phone,
    required: false,
    wrapperClassName: "sm:col-span-2",
  },
};

const orderItems = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    option: "Black",
    price: 59.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
  },
  {
    id: 2,
    name: "Minimalist Leather Watch",
    option: "Brown",
    price: 129.5,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
  },
  {
    id: 3,
    name: "Ergonomic Coffee Mug",
    option: "Stone",
    price: 24.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&q=80",
  },
];

const subtotal = orderItems.reduce(
  (total, item) => total + item.price * item.quantity,
  0,
);
const shipping = 0;
const total = subtotal + shipping;

const Checkout = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const handleChange  = (e)=> {
    const {name, value} = e.target
    setFormData((prev)=> (
      {...prev, [name]: value}
    ))}
  const handleSubmit = (e)=> {
    e.preventDefault()
    const randomId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(randomId);
      // Backend integration will be added later.
    console.log("Checkout data:", formData);
    setIsOrderPlaced(true);
  }
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mt-7 flex flex-col gap-5 sm:mt-9 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-2">
            <span className="font-logo logo-gradient text-[1.3em]">Checkout...</span> 
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">
            Add your details below to complete your order securely.
          </p>
        </div>

        <div
          aria-label="Checkout progress"
          className="flex items-center gap-3 self-start rounded-full border border-line bg-surface px-4 py-2.5 text-sm shadow-card sm:self-auto"
        >
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary text-white">
            <Check size={15} strokeWidth={2.5} aria-hidden="true" />
          </span>
          <span className="font-semibold text-ink">1. Delivery</span>
          <span className="h-px w-6 bg-muted" aria-hidden="true" />
          <span className="text-muted">2. Payment</span>
        </div>
      </div>

      <form
        className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_380px]"
        onSubmit={handleSubmit}>
        <div className="space-y-6">
          <section className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-7">
            <div className="flex items-start gap-4">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary-text">
                <MapPin size={21} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl">Contact & delivery</h2>
                <p className="mt-1 text-sm text-muted">
                  Where should we send your order?
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {Object.keys(checkoutFields).map((name)=>{
                const {wrapperClassName, ...fieldProps} = checkoutFields[name];
                return(
                  <div key={name} className={wrapperClassName}>
                    <InputField
                    name={name}
                    {...fieldProps}
                    value={formData[name] || ''}
                    onChange={handleChange}
                    />
                  </div>
                )
              })}
            </div>
          </section>

          <section className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-7">
            <div className="flex items-start gap-4">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary-text">
                <CreditCard size={21} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl">Payment method</h2>
                <p className="mt-1 text-sm text-muted">
                  Choose how you would like to pay.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-control border border-primary/40 bg-primary/5 p-4">
                <input
                  className="mt-1 size-4 accent-primary"
                  defaultChecked
                  name="paymentMethod"
                  type="radio"
                  value="card"
                />
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-ink">
                    Credit or debit card
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    Visa, Mastercard, and other major cards
                  </span>
                </span>
                <CreditCard
                  className="mt-0.5 shrink-0 text-muted"
                  size={20}
                  aria-hidden="true"
                />
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-control border border-line p-4 transition-colors hover:border-primary/40">
                <input
                  className="mt-1 size-4 accent-primary"
                  name="paymentMethod"
                  type="radio"
                  value="cash"
                />
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-ink">
                    Cash on delivery
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    Pay when your order arrives
                  </span>
                </span>
              </label>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-muted">
              <LockKeyhole size={16} aria-hidden="true" />
              Your payment information is protected.
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-card border border-line bg-surface p-5 shadow-card sm:p-7 lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl">Your order</h2>
            <span className="rounded-full bg-page px-3 py-1 text-xs font-semibold text-muted">
              {orderItems.reduce((count, item) => count + item.quantity, 0)} items
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {orderItems.map((item) => (
              <article key={item.id} className="flex gap-3">
                <div className="relative size-16 shrink-0 rounded-control bg-page p-2">
                  <img
                    alt={item.name}
                    className="size-full object-contain"
                    src={item.image}
                  />
                  <span className="absolute -right-2 -top-2 inline-flex size-5 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-ink">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted">{item.option}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-ink">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </article>
            ))}
          </div>

          <div className="my-6 border-t border-line" />

          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-4 text-muted">
              <span>Subtotal</span>
              <span className="font-medium text-ink">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4 text-muted">
              <span>Shipping</span>
              <span className="font-medium text-emerald-600">Free</span>
            </div>
          </div>

          <div className="my-5 border-t border-line" />

          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-ink">Total</span>
            <span className="text-2xl font-bold text-ink">
              ${total.toFixed(2)}
            </span>
          </div>

          <button type="submit" className="btn btn-primary mt-6 w-full py-3">
            Place order
          </button>

          <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs leading-5 text-muted">
            <ShieldCheck className="shrink-0 text-primary-text" size={16} aria-hidden="true" />
            Secure checkout with encrypted payment
          </p>

          <div className="mt-6 flex items-start gap-3 rounded-control bg-page p-4">
            <Truck className="mt-0.5 shrink-0 text-primary-text" size={18} aria-hidden="true" />
            <p className="text-xs leading-5 text-muted">
              <span className="font-semibold text-ink">Free standard shipping</span>
              <br />
              Your order will be delivered in 3–5 business days.
            </p>
            <PackageCheck
              className="ml-auto mt-0.5 shrink-0 text-muted"
              size={18}
              aria-hidden="true"
            />
          </div>
        </aside>
      </form>
      {isOrderPlaced && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 text-center shadow-2xl sm:p-8">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 size={36} />
            </div>

            <h3 className="mt-4 text-2xl font-bold text-ink">Order Successful!</h3>
            <p className="mt-2 text-sm text-muted">
              Thank you for your purchase, <span className="font-semibold text-ink">{formData.firstName || "Customer"}</span>. Your order has been placed successfully.
            </p>

            <div className="my-6 rounded-xl bg-page p-4 text-left space-y-2 border border-line">
              <div className="flex justify-between text-xs text-muted">
                <span>Order ID:</span>
                <span className="font-mono font-semibold text-ink">{orderId}</span>
              </div>
              <div className="flex justify-between text-xs text-muted">
                <span>Total Amount:</span>
                <span className="font-semibold text-ink">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted">
                <span>Shipping Address:</span>
                <span className="font-medium text-ink truncate max-w-[180px]">{formData.address || "N/A"}, {formData.city || "N/A"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/"
                className="btn btn-primary flex-1 py-3 text-center justify-center flex items-center gap-2"
              >
                <ShoppingBag size={18} />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Checkout;
