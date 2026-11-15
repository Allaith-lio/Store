import { ChevronRight } from 'lucide-react'

const ProfileMenuItem = ({
  icon: Icon,
  title,
  onClick,
  color = 'bg-primary/10 text-primary',
  danger = false,
  active = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`group flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors ${
        danger ? 'hover:bg-red-500/10' : active ? 'bg-primary/5' : 'hover:bg-page'
      }`}
    >
      <span className="flex items-center gap-4">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-control ${
            danger ? 'bg-red-500/10 text-red-500' : color
          }`}
        >
          <Icon size={20} />
        </span>

        <span
          className={`text-sm font-semibold ${danger ? 'text-red-500' : active ? 'text-primary' : 'text-ink'}`}
        >
          {title}
        </span>
      </span>

      <ChevronRight
        size={18}
        className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
      />
    </button>
  )
}

export default ProfileMenuItem
