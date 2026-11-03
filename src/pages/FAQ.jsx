import { useState } from 'react'
import {
  ChevronDown,
  CircleHelp,
  CreditCard,
  RotateCcw,
  Search,
  ShoppingBag,
  Truck,
  X,
} from 'lucide-react'
import Button from '../components/common/Button'
import Banner from '../components/common/Banner';

const categories = [
  {
    id: 'orders',
    label: 'Orders',
    Icon: ShoppingBag,
    h: 'h-56',
    image:
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80', // متجر وتسوق وتجهيز طلبات
  },
  {
    id: 'shipping',
    label: 'Shipping',
    Icon: Truck,
    h: 'h-40',
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80', // شحن وتوصيل وصناديق
  },
  {
    id: 'returns',
    label: 'Returns',
    Icon: RotateCcw,
    h: 'h-40',
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'payments',
    label: 'Payments',
    Icon: CreditCard,
    h: 'h-56',
    image:
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80', // دفع إلكتروني وبطاقات آمنة
  },
];

const faqs = [
  {
    category: 'orders',
    question: 'How do I place an order?',
    answer:
      'Browse the products, add what you like to your cart, and press checkout. You will get a confirmation as soon as your order is placed.',
  },
  {
    category: 'orders',
    question: 'Do I need an account to shop?',
    answer:
      'You can browse freely, but an account lets you save favorites, track your orders, and check out faster.',
  },
  {
    category: 'orders',
    question: 'Can I change or cancel my order?',
    answer:
      'Yes, as long as it has not shipped yet. Contact us as soon as possible and we will help you.',
  },
  {
    category: 'shipping',
    question: 'How long does delivery take?',
    answer:
      'Most orders arrive within 3 to 5 business days. You will get a tracking update as soon as your order ships.',
  },
  {
    category: 'shipping',
    question: 'How can I track my order?',
    answer:
      'Open My Orders from your profile to see the live status of every purchase.',
  },
  {
    category: 'shipping',
    question: 'Do you deliver to my country?',
    answer:
      'We keep adding new destinations. Enter your address at checkout to see the delivery options available for you.',
  },
  {
    category: 'returns',
    question: 'Can I return a product?',
    answer:
      'Yes. Unused items can be returned within 14 days of delivery, and we will help you with every step.',
  },
  {
    category: 'returns',
    question: 'How do refunds work?',
    answer:
      'Once we receive your return, the refund is sent to your original payment method within 5 to 7 business days.',
  },
  {
    category: 'payments',
    question: 'Which payment methods do you accept?',
    answer:
      'We accept the major credit and debit cards. More options are on the way.',
  },
  {
    category: 'payments',
    question: 'Is my payment information safe?',
    answer:
      'Yes. Payments are encrypted, and we never store your full card details.',
  },
]

export default function FAQ() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const visibleFaqs = faqs.filter(
    (faq) =>
      (category === 'all' || faq.category === category) &&
      (faq.question + faq.answer).toLowerCase().includes(search.toLowerCase())
  )

  const clearFilters = () => {
    setSearch('')
    setCategory('all')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <section className="grid items-center gap-12 py-12 md:py-8 lg:grid-cols-2">

        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-semibold text-primary shadow-card">
            <CircleHelp className="size-4 text-accent" />
            Help Center
          </span>

          <h1 className="mt-6">
            How can we{' '}
            <span className="font-logo logo-gradient text-[1.3em]">help </span>
            you today?
          </h1>

          <p className="mt-5 max-w-xl leading-8 text-muted">
            Search for answers or pick a topic from the cards. Can’t find what you need?
            Our support team is always one message away.
          </p>

          {/* Search Input */}
          <div className="relative mt-8 max-w-lg">
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute left-4 size-5 text-muted" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions, keywords, topics..."
                className="w-full rounded-2xl border border-line bg-surface py-3.5 pr-10 pl-12 text-sm text-ink shadow-xs outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 flex size-6 items-center justify-center rounded-full text-muted hover:bg-page hover:text-ink"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-4">
          {[categories.slice(0, 2), categories.slice(2)].map((column, i) => (
            <div
              key={i}
              className={`flex flex-col gap-4 ${i === 1 ? 'mt-10' : ''}`}
            >
              {column.map(({ label, Icon, h, image }) => (
                <div
                  key={label}
                  className={`${h} group relative flex flex-col overflow-hidden rounded-card border border-line p-5 text-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                >
                  <img
                    src={image}
                    alt={label}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <span className="flex size-10 items-center justify-center rounded-full bg-white/25 text-secondary backdrop-blur-md">
                      <Icon className="size-5" />
                    </span>

                    <p className="font-heading text-xl font-semibold text-white drop-shadow-sm">
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

      </section>

      <section className="mx-auto max-w-4xl py-8 md:py-12">
        <div className="mb-6 flex items-center justify-between text-sm text-muted">
          <p className="font-medium">
            Showing{' '}
            <span className="font-bold text-ink">{visibleFaqs.length}</span>{' '}
            {visibleFaqs.length === 1 ? 'question' : 'questions'}
          </p>
          {(category !== 'all' || search) && (
            <button
              type="button"
              onClick={clearFilters}
              className="cursor-pointer font-semibold text-primary transition hover:text-primary-hover hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {visibleFaqs.length > 0 ? (
          <div className="space-y-3.5">
            {visibleFaqs.map(({ category: faqCategory, question, answer }) => (
              <details
                key={question}
                className="group rounded-card border border-line bg-surface p-5 transition-all shadow-xs hover:border-line/80 open:border-primary/30 open:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      {faqCategory}
                    </span>
                    <span className="text-base font-semibold">{question}</span>
                  </div>
                  <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180 group-open:text-primary" />
                </summary>
                <p className="mt-3 border-t border-line/50 pt-3 text-sm leading-relaxed text-muted">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        ) : (
          <div className="rounded-card border border-dashed border-line bg-surface p-12 text-center">
            <Search className="mx-auto size-10 text-muted/60" />
            <h2 className="mt-4 font-heading text-xl font-semibold text-ink">
              No matching questions
            </h2>
            <p className="mt-1 text-sm text-muted">
              Try searching with different terms or reset your filters.
            </p>
            <Button
              type="button"
              onClick={clearFilters}
              className="btn btn-outline mt-6 rounded-control"
            >
              Clear filters
            </Button>
          </div>
        )}
      </section>
      <Banner
        title={"Still need help?"}
        description={"Send us a message and a real person from the Omni Store team will get back to you."}
        to={"/contactUs"}
        linkText={"Contact Us"}
      />
    </div>
  )
}