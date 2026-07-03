import { NavLink } from 'react-router'

const navItems = [
  { to: '/', label: '單字庫' },
  { to: '/add', label: '新增單字' },
  { to: '/study', label: '快速學習' },
]

function NavBar() {
  return (
    <nav className="flex border-b border-gray-200 bg-white">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `flex-1 py-3 text-center text-sm font-medium ${
              isActive ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default NavBar
