import { useState } from 'react'
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react'
import InputField from '../components/common/InputField'
import Button from '../components/common/Button'

const info = [
  {
    Icon: Mail,
    title: 'Email us',
    text: 'support@omnistore.com',
    color: 'bg-sky-400/15 text-sky-500',
  },
  {
    Icon: Phone,
    title: 'Call us',
    text: '+1 (555) 123-4567',
    color: 'bg-amber-400/15 text-amber-500',
  },
  {
    Icon: MapPin,
    title: 'Visit us',
    text: '123 Market Street, Your City',
    color: 'bg-emerald-400/15 text-emerald-500',
  },
]

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [notice, setNotice] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setNotice(`Thanks ${formData.name}! Your message was sent. We will reply soon.`)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-2xl py-12 text-center md:py-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-semibold text-primary shadow-card">
          <MessageCircle className="size-4 text-accent" />
          Contact Us
        </span>

        <h1 className="mt-6">
          We’d love to{' '}
          <span className="font-logo logo-gradient text-[1.3em]">hear</span>{' '}
          from you
        </h1>

        <p className="mt-5 leading-8 text-muted">
          Questions about an order, a product, or just want to say hi? Send us
          a message and a real person from the Omni Store team will get back to
          you.
        </p>
      </section>

      <section className="grid items-start gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-card bg-linear-to-br from-[#244b7b] via-[#2b5b8f] to-[#3975a4] text-white p-6 shadow-card">
            <span className="flex size-11 items-center justify-center rounded-full bg-white/60 text-black">
              <Clock className="size-5" />
            </span>
            <p className="mt-6 font-heading text-xl font-semibold">
              We usually reply within 24 hours
            </p>
            <p className="mt-1 text-sm">Sunday to Thursday, 9:00 AM to 6:00 PM</p>
          </div>

          {info.map(({ Icon, title, text, color }) => (
            <div
              key={title}
              className="flex items-center gap-4 rounded-card border border-line bg-surface p-5 shadow-card transition hover:-translate-y-1 hover:shadow-raised"
            >
              <span
                className={`flex size-12 shrink-0 items-center justify-center rounded-card ${color}`}
              >
                <Icon className="size-6" />
              </span>
              <div>
                <h3 className="text-lg">{title}</h3>
                <p className="text-sm text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-card border border-line bg-surface p-6 shadow-card md:p-10 lg:col-span-7">
          <h2 className="text-h3">Send us a message</h2>
          <p className="mt-2 text-sm text-muted">
            Fill in the form and we will take it from there.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                name="name"
                label="Your name"
                placeholder="John Doe"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
              />
              <InputField
                name="email"
                label="Email address"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <InputField
              name="subject"
              label="Subject"
              placeholder="How can we help?"
              value={formData.subject}
              onChange={handleChange}
            />

            <InputField
              name="message"
              label="Message"
              placeholder="Write your message here..."
              multiline
              rows={5}
              minLength={10}
              value={formData.message}
              onChange={handleChange}
            />

            {notice && (
              <p
                className="rounded-control border border-primary/20 bg-primary/10 px-4 py-3 text-sm leading-5 text-primary"
                role="status"
              >
                {notice}
              </p>
            )}

            <Button type="submit" className="btn btn-primary rounded-full py-3">
              Send Message
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}
