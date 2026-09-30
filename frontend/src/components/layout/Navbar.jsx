import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { cartItemCount } = useCart()
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef(null)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { closeMobileMenu() }, [location.pathname])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    closeMobileMenu()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const navLinkClass = (path) =>
    `relative text-[13px] font-medium tracking-[0.08em] uppercase transition-colors duration-200 py-2 px-1 ${
      isActive(path)
        ? 'text-neutral-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-neutral-900'
        : 'text-neutral-500 hover:text-neutral-900'
    }`

  const iconBtnClass =
    'flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-900'

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-lg border-b border-neutral-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
          : 'bg-white border-b border-neutral-100'
      }`}
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Left: Brand & Nav */}
        <div className="flex items-center gap-12">
          <Link
            to="/"
            className="text-xl font-bold tracking-[0.3em] text-neutral-900 uppercase"
          >
            LUXOR
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/shop" className={navLinkClass('/shop')}>Shop</Link>
            <Link to="/categories" className={navLinkClass('/categories')}>Categories</Link>
          </div>
        </div>

        {/* Right: Search & Icons */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative group">
            <label htmlFor="navbar-search" className="sr-only">Search products</label>
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-neutral-400 group-focus-within:text-neutral-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </span>
            <input
              id="navbar-search"
              type="search"
              placeholder="Search..."
              className="h-9 w-64 rounded-full bg-neutral-100/80 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 border border-transparent transition-colors duration-200 focus:bg-white focus:border-neutral-300 focus:ring-0"
            />
          </div>

          <div className="flex items-center gap-1 ml-2">
            <Link to="/cart" className={`${iconBtnClass} relative`} aria-label={`Cart${cartItemCount > 0 ? `, ${cartItemCount} items` : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-neutral-900 px-1 text-[10px] font-bold text-white leading-none">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={iconBtnClass}
                  aria-expanded={dropdownOpen}
                  aria-label="Account menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-neutral-900/5 animate-scale-in">
                    <div className="px-3 py-2.5 border-b border-neutral-100 mb-1">
                      <p className="text-sm font-medium text-neutral-900 truncate">{user.name}</p>
                      <p className="text-xs text-neutral-500 truncate mt-0.5">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors">
                        Admin Dashboard
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors">
                      My Profile
                    </Link>
                    <Link to="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors">
                      My Orders
                    </Link>
                    <div className="border-t border-neutral-100 mt-1 pt-1">
                      <button onClick={handleLogout} className="w-full text-left rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className={iconBtnClass} aria-label="Sign in">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <Link to="/cart" className={`${iconBtnClass} relative`} aria-label="Cart">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-neutral-900 px-1 text-[10px] font-bold text-white leading-none">
                {cartItemCount}
              </span>
            )}
          </Link>
          <button
            className={iconBtnClass}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white px-6 py-8 animate-fade-in-down shadow-lg">
          <div className="flex flex-col gap-1">
            <Link to="/shop" onClick={closeMobileMenu} className="rounded-lg px-3 py-3 text-sm font-medium tracking-wide text-neutral-900 uppercase hover:bg-neutral-50 transition-colors">
              Shop
            </Link>
            <Link to="/categories" onClick={closeMobileMenu} className="rounded-lg px-3 py-3 text-sm font-medium tracking-wide text-neutral-900 uppercase hover:bg-neutral-50 transition-colors">
              Categories
            </Link>
            <hr className="border-neutral-100 my-3" />
            {isAuthenticated ? (
              <>
                <p className="px-3 text-xs text-neutral-400 uppercase tracking-[0.15em] mb-2">{user?.name}</p>
                {isAdmin && <Link to="/admin" onClick={closeMobileMenu} className="rounded-lg px-3 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">Admin Dashboard</Link>}
                <Link to="/profile" onClick={closeMobileMenu} className="rounded-lg px-3 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">My Profile</Link>
                <Link to="/orders" onClick={closeMobileMenu} className="rounded-lg px-3 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">My Orders</Link>
                <hr className="border-neutral-100 my-3" />
                <button onClick={handleLogout} className="text-left rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={closeMobileMenu} className="rounded-lg px-3 py-3 text-sm font-medium tracking-wide text-neutral-900 uppercase hover:bg-neutral-50 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
