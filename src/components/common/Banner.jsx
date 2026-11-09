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
        {/* Blue tints only: they look clean on both the white and the dark surface */}
        <span className="absolute -right-10 -top-10 size-48 rounded-full bg-primary/15" />
        <span className="absolute -bottom-12 -left-12 size-56 rounded-full bg-accent/20" />

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
