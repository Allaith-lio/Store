import { useState } from "react"
import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Package,
  Store,
  Sun,
  Users,
  X,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { Logo } from "../components/common/Logo"
const navItems = [
  { to: '/dashboard', label: 'Overview', Icon: LayoutDashboard, end: true },
  { to: '/dashboard/products', label: 'Products', Icon: Package },
  { to: '/dashboard/orders', label: 'Orders & Customers', Icon: Users },
]

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-semibold transition-colors ${
    isActive
      ? 'bg-primary/10 text-primary'
      : 'text-muted hover:bg-page hover:text-ink'
  }`


export const DashboardLayout = () => {
  const [open, setOpen] = useState(false)
  const { isDarkMode, toggleTheme } = useTheme()
  return (
    <div className="min-h-screen bg-page text-ink lg:flex">
      <aside className={`fixed inset-y-0 left-0 z-45 flex w-64 flex-col border-r border-line bg-surface p-4 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between px-2 py-2">
          <Logo/>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-control p-2 text-muted hover:bg-page lg:hidden"
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="mt-8 px-3 text-xs font-bold uppercase tracking-widest text-muted">Menu</p>
        
        <nav className="mt-3 space-y-1" aria-label="Dashboard">
          {navItems.map(({to, label, Icon, end}) => (
            <NavLink 
              key={to}
              to={to} 
              end={end} 
              className={linkClass}
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-line space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-control border border-line px-3 py-2.5 text-sm font-semibold text-muted transition-colors hover:border-primary hover:text-primary"
          >
            <Store size={20} />
            Back to store
          </Link>

          <button
            type="button"
            onClick={() => {
              alert("Logged out");
            }}
            className="w-full flex items-center gap-3 cursor-pointer rounded-control border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/20"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-surface/80 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-control p-2 text-ink hover:bg-page lg:hidden"
          >
            <Menu size={24} />
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="rounded-control p-2.5 text-muted transition-colors hover:bg-page hover:text-primary"
            >
              {isDarkMode ? (
                <Sun size={20} className="text-amber-400" />
              ) : (
                <Moon size={20} />
              )}
            </button>

            <div className="flex items-center gap-2.5 rounded-full border border-line py-1 pl-1 pr-4">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                A
              </span>
              <span className="hidden text-sm font-semibold sm:inline">Admin</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
