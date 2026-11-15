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
      <div className="relative overflow-hidden rounded-card border border-line bg-surface px-8 py-14 text-center text-ink shadow-card md:px-16">
        <span className="absolute -right-12 -top-12 size-56 rounded-full bg-primary/15" />
        <span className="absolute -right-6 -top-4 size-40 rounded-full border-2 border-accent/40" />
        <span className="absolute -bottom-12 -left-12 size-56 rounded-full bg-accent/20" />
        <span className="absolute -bottom-6 -left-4 size-40 rounded-full border-2 border-accent/40" />
        
        <div className="relative z-10">
          <h2 className="mx-auto max-w-xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">
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
