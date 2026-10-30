import {
  BatteryCharging,
  Check,
  Headphones,
  ShoppingBag,
  ShieldCheck,
  Star,
  Volume2,
} from "lucide-react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    description:
      "Enjoy your favorite music in exceptional clarity. These wireless headphones pair powerful, balanced sound with active noise cancellation and a comfortable fit made for all-day listening. A long-lasting battery keeps your soundtrack going wherever the day takes you.",
    highlights: [
      { label: "Active noise cancellation", Icon: Volume2 },
      { label: "Comfortable all-day fit", Icon: Headphones },
      { label: "Long-lasting battery", Icon: BatteryCharging },
    ],
    comments: [
      {
        name: "Maya R.",
        rating: 5,
        date: "October 18, 2026",
        text: "Great sound quality and comfortable to wear for long periods.",
      },
      {
        name: "Daniel K.",
        rating: 5,
        date: "October 12, 2026",
        text: "The noise cancellation feature is impressive, blocking out background noise effectively.",
      },
      {
        name: "Sofia L.",
        rating: 4,
        date: "October 4, 2026",
        text: "Battery life is excellent, lasting for hours on a single charge.",
      },
    ],
    category: "Electronics",
    price: 59.99,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=90",
    label: "Bestseller",
  },
];

function RatingStars({ rating, size = 17 }) {
  return (
    <span
      className="inline-flex items-center gap-0.5 text-accent"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={size}
          aria-hidden="true"
          fill={index < Math.round(rating) ? "currentColor" : "none"}
          strokeWidth={1.8}
        />
      ))}
    </span>
  );
}

export default function ProductPage() {
  const [product] = products;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-y-1 text-sm text-muted"
      >
        <Link to="/" className="text-muted no-underline hover:text-primary">
          Home
        </Link>
        <span className="mx-2 text-line" aria-hidden="true">
          /
        </span>
        <span>{product.category}</span>
        <span className="mx-2 text-line" aria-hidden="true">
          /
        </span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <section
        aria-labelledby="product-name"
        className="grid items-start gap-6 md:grid-cols-2 md:gap-8 lg:gap-12"
      >
        <div>
          <div className="group relative overflow-hidden rounded-card border border-line bg-surface shadow-card">
            {product.label && (
              <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                <Star size={13} fill="currentColor" aria-hidden="true" />
                {product.label}
              </span>
            )}
            <div className="flex aspect-[4/3] items-center justify-center bg-primary/5 p-5 sm:p-8">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted">
            A closer look at your next favorite listening companion
          </p>
        </div>

        <div className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-7 lg:p-8">
          <span className="inline-flex rounded-full bg-page px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted">
            {product.category}
          </span>
          <h1
            id="product-name"
            className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl"
          >
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
            <RatingStars rating={product.rating} />
            <span className="text-sm font-semibold text-ink">
              {product.rating}
            </span>
            <a
              href="#customer-reviews"
              className="text-sm text-muted underline underline-offset-4 hover:text-primary"
            >
              See all {product.comments.length} reviews
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-3xl font-semibold tracking-tight text-ink">
              ${product.price.toFixed(2)}
            </p>
            <span className="text-sm text-muted">One-time purchase</span>
          </div>
          <p className="mt-4 text-base leading-7 text-muted">
            {product.description}
          </p>

          <div className="mt-6 border-t border-line pt-5">
            <h2 className="text-sm font-semibold text-ink">
              Why you’ll love it
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {product.highlights.map(({ label, Icon }) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 text-sm text-muted"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-control bg-page p-4">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-ink">
                Shop with confidence
              </p>
              <p className="mt-1 text-xs leading-5 text-muted">
                Quality sound, comfortable listening, and a battery that keeps
                up with you.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-control bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-primary/25 transition hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBag size={19} aria-hidden="true" />
            Buy now
          </button>
        </div>
      </section>

      <section
        id="customer-reviews"
        aria-labelledby="reviews-title"
        className="mt-12 border-t border-line pt-10 sm:mt-16 sm:pt-12"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h2
              id="reviews-title"
              className="text-2xl font-semibold text-ink sm:text-3xl"
            >
              Loved by listeners
            </h2>
            <p className="mt-2 text-sm text-muted">
              Honest feedback from people who’ve tried these headphones.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start rounded-control border border-line bg-surface px-4 py-3 shadow-card sm:self-auto">
            <span className="text-2xl font-semibold text-ink">
              {product.rating}
            </span>
            <div>
              <RatingStars rating={product.rating} size={15} />
              <p className="mt-0.5 text-xs text-muted">
                Based on {product.comments.length} reviews
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {product.comments.map((comment) => (
            <article
              key={`${comment.name}-${comment.date}`}
              className="rounded-card border border-line bg-surface p-5 shadow-card transition-shadow hover:shadow-raised sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                  >
                    {comment.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-ink">
                      {comment.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted">{comment.date}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-page px-2.5 py-1 text-xs font-medium text-muted">
                  <Check size={13} aria-hidden="true" />
                  Verified buyer
                </span>
              </div>
              <div className="mt-4">
                <RatingStars rating={comment.rating} size={15} />
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">
                {comment.text}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
