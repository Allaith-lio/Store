import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export default function Banner({
  title,
  description,
  to,
  linkText,
}) {
  return (
    <section className="pb-16 ">
      <div className="relative overflow-hidden rounded-card bg-ink px-8 py-14 text-center text-page md:px-16">
        <span className="absolute -right-10 -top-10 size-48 rounded-full bg-accent/30" />
        <span className="absolute -bottom-12 -left-12 size-56 rounded-full bg-primary/30" />

        <div className="relative z-10">
          <h2 className="mx-auto max-w-xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-lg opacity-80">
            {description}
          </p>
          <Link
            to={to}
            className="btn mt-8 rounded-full bg-accent px-7 py-3 text-gray-950 hover:brightness-110"
          >
            {linkText}
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}