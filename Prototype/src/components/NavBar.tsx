import { NavLink } from 'react-router'
import { BoltIcon, BookIcon, QuillIcon } from './icons'

const navItems = [
  { to: '/', label: '單字庫', Icon: BookIcon },
  { to: '/add', label: '新增單字', Icon: QuillIcon },
  { to: '/study', label: '快速學習', Icon: BoltIcon },
] as const

function NavBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-rule bg-surface pb-[env(safe-area-inset-bottom)]">
      {navItems.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-3 text-xs font-semibold ${
              isActive ? 'text-accent' : 'text-ink-soft'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon className="h-7 w-7" filled={isActive} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default NavBar
