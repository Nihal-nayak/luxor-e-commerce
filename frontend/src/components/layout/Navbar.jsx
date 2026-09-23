import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6l-1.5-3H2" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  )
}

function AccountIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

const navLinkClass =
  'text-sm font-medium text-neutral-900 transition-colors duration-200 hover:text-neutral-600'

const iconButtonClass =
  'flex h-10 w-10 items-center justify-center rounded-full text-neutral-900 transition-colors duration-200 hover:bg-neutral-100'

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { cartItemCount } = useCart()
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  // Handle clicking outside of dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    closeMobileMenu()
    navigate('/login')
  }

  return (
    <nav
      className="sticky top-0 z-50 border-b border-neutral-200 bg-white"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Left: brand + desktop nav */}
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="text-xl font-bold tracking-[0.2em] text-neutral-900 transition-opacity duration-200 hover:opacity-70"
          >
            LUXOR
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link to="/shop" className={navLinkClass}>
              Shop
            </Link>
            <Link to="/shop" className={navLinkClass}>
              Categories
            </Link>
          </div>
        </div>

        {/* Center/right: search + icons (desktop) */}
        <div className="hidden flex-1 items-center justify-end gap-4 md:flex">
          <div className="relative w-full max-w-sm">
            <label htmlFor="navbar-search" className="sr-only">
              Search products
            </label>
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-neutral-400">
              <SearchIcon />
            </span>
            <input
              id="navbar-search"
              type="search"
              placeholder="Search products..."
              className="h-10 w-full rounded-full border border-neutral-200 bg-neutral-50 pl-11 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors duration-200 focus:border-neutral-400 focus:bg-white focus:outline-none"
            />
          </div>

          <Link
            to="/cart"
            className={`${iconButtonClass} relative`}
            aria-label="View cart"
          >
            <CartIcon />
            {cartItemCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={iconButtonClass}
                aria-label="Account menu"
              >
                <AccountIcon />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-neutral-200 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {user && (
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-sm font-medium text-neutral-900 truncate">{user.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                    </div>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className={iconButtonClass}
              aria-label="Account"
            >
              <AccountIcon />
            </Link>
          )}
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="flex items-center gap-1 md:hidden">
          <Link
            to="/cart"
            className={`${iconButtonClass} relative`}
            aria-label="View cart"
          >
            <CartIcon />
            {cartItemCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            className={iconButtonClass}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-neutral-200 bg-white md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            <Link
              to="/shop"
              className="rounded-lg px-3 py-3 text-sm font-medium text-neutral-900 transition-colors duration-200 hover:bg-neutral-50"
              onClick={closeMobileMenu}
            >
              Shop
            </Link>
            <Link
              to="/shop"
              className="rounded-lg px-3 py-3 text-sm font-medium text-neutral-900 transition-colors duration-200 hover:bg-neutral-50"
              onClick={closeMobileMenu}
            >
              Categories
            </Link>
            <Link
              to="/cart"
              className="rounded-lg px-3 py-3 text-sm font-medium text-neutral-900 transition-colors duration-200 hover:bg-neutral-50"
              onClick={closeMobileMenu}
            >
              Cart
            </Link>
            {isAuthenticated ? (
              <>
                <div className="border-t border-neutral-100 my-2 pt-2">
                  <div className="px-3 pb-2">
                    <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                    <p className="text-xs text-neutral-500">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-neutral-900 transition-colors duration-200 hover:bg-neutral-50"
                    onClick={closeMobileMenu}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-neutral-900 transition-colors duration-200 hover:bg-neutral-50"
                    onClick={closeMobileMenu}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left rounded-lg px-3 py-3 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-neutral-50"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-lg px-3 py-3 text-sm font-medium text-neutral-900 transition-colors duration-200 hover:bg-neutral-50"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
