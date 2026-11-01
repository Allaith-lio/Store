import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  BadgeCheck,
  Cpu,
  Gift,
  Headphones,
  Shirt,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Watch,
} from 'lucide-react'
import Banner from '../components/common/Banner'

const tiles = [
  { label: 'Electronics', Icon: Cpu, color: 'bg-sky-300', h: 'h-56' },
  { label: 'Accessories', Icon: Watch, color: 'bg-orange-300', h: 'h-40' },
  { label: 'Style', Icon: Shirt, color: 'bg-amber-300', h: 'h-40' },
  { label: 'Gifts', Icon: Gift, color: 'bg-emerald-300', h: 'h-56' },
]

const stats = [
  { value: '1,000+', label: 'Products' },
  { value: '25K+', label: 'Happy customers' },
  { value: '20+', label: 'Categories' },
  { value: '24/7', label: 'Friendly support' },
]

const values = [
  {
    Icon: BadgeCheck,
    title: 'Picked with care',
    text: 'Every product is chosen for quality and value, so you never have to settle.',
    color: 'bg-sky-400/15 text-sky-500',
  },
  {
    Icon: Truck,
    title: 'Fast delivery',
    text: 'From our shelves to your door with tracking at every step.',
    color: 'bg-amber-400/15 text-amber-500',
  },
  {
    Icon: ShieldCheck,
    title: 'Safe shopping',
    text: 'Secure payments and easy returns, because trust comes first.',
    color: 'bg-emerald-400/15 text-emerald-500',
  },
  {
    Icon: Headphones,
    title: 'Real people, real help',
    text: 'Questions about an order? A friendly team is always one message away.',
    color: 'bg-orange-400/15 text-orange-500',
  },
]

export default function AboutUs() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <section className="grid items-center gap-12 py-12 md:py-20 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-semibold text-primary shadow-card">
            <Sparkles className="size-4 text-accent" />
            About Omni Store
          </span>

          <h1 className="mt-6">
            One store for{' '}
            <span className="font-logo logo-gradient text-[1.3em]">everything</span>{' '}
            you love
          </h1>

          <p className="mt-5 max-w-xl leading-8 text-muted">
            Omni Store started with a simple idea: shopping online should be
            easy, friendly, and a little bit fun. From the latest gadgets to
            everyday essentials and thoughtful gifts, you will find it all in
            one place.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products" className="btn btn-primary rounded-full px-6 py-3">
              Start Shopping
              <ArrowUpRight className="size-4" />
            </Link>
            <Link to="/messageUs" className="btn btn-outline rounded-full px-6 py-3">
              Contact Us
            </Link>
          </div>
        </div>

        <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-4">
          {[tiles.slice(0, 2), tiles.slice(2)].map((column, i) => (
            <div key={i} className={`flex flex-col gap-4 ${i === 1 ? 'mt-10' : ''}`}>
              {column.map(({ label, Icon, h }) => (
                <div
                  key={label}
                  className={`${h} flex flex-col rounded-card border border-line bg-surface p-5 text-ink shadow-card transition-transform hover:-translate-y-1`}
                >
                  <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>

                  <p className="mt-auto font-heading text-xl font-semibold">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          ))}

          <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-line bg-surface px-5 py-3 shadow-raised">
            <Star className="size-5 fill-accent text-accent" />
            <span className="text-sm font-bold">4.9</span>
            <span className="text-sm text-muted">customer rating</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 divide-line rounded-card border border-line bg-surface shadow-card lg:grid-cols-4 lg:divide-x">
        {stats.map(({ value, label }) => (
          <div key={label} className="p-6 text-center md:p-8">
            <p className="font-heading text-3xl font-semibold text-primary md:text-4xl">
              {value}
            </p>
            <p className="mt-1 text-sm text-muted">{label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-10 py-16 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            Our story
          </p>
          <h2 className="mt-3">Why we called it Omni</h2>

          <div className="mt-8 rounded-card border-l-4 border-accent bg-surface p-6 shadow-card">
            <ShoppingBag className="size-6 text-primary" />
            <p className="mt-3 font-heading text-xl leading-snug">
              &ldquo;Omni&rdquo; means all. So we built one place for all of it.
            </p>
          </div>
        </div>

        <div className="space-y-5 leading-8 text-muted lg:col-span-7">
          <p>
            We were tired of jumping between a dozen websites just to find a
            good pair of headphones, a nice watch, and a gift for a friend.
            Omni Store brings them together, with a clean design that makes
            browsing a pleasure instead of a chore.
          </p>
          <p>
            Our collection grows every week, but our promise stays the same:
            honest products, clear prices, and a shopping experience that
            respects your time. Save your favorites, build your cart, and check
            out in a few simple steps.
          </p>
          <p className="font-semibold text-ink">
            Whatever you are looking for, it is probably already here.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            What we stand for
          </p>
          <h2 className="mt-3">Shopping that feels good</h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ Icon, title, text, color }) => (
            <div
              key={title}
              className="rounded-card border border-line bg-surface p-6 shadow-card transition hover:-translate-y-1 hover:shadow-raised"
            >
              <span className={`flex size-12 items-center justify-center rounded-card ${color}`}>
                <Icon className="size-6" />
              </span>
              <h3 className="mt-5 text-lg">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
      
      <Banner
        title={"Ready to find your next favorite?"}
        description={"Explore the collection and see why shoppers keep coming back to Omni Store."}
        to={"/products"}
        linkText={"Browse Products"}
      />
    </div>
  )
}
