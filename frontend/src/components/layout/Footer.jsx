import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="text-xl font-bold tracking-[0.3em] text-white uppercase">
              LUXOR
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-neutral-500 max-w-xs">
              Thoughtfully designed products for modern living. Quality without compromise.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300 mb-4">Shop</h3>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-sm text-neutral-500 hover:text-white transition-colors duration-200">All Products</Link></li>
              <li><Link to="/categories" className="text-sm text-neutral-500 hover:text-white transition-colors duration-200">Categories</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300 mb-4">Account</h3>
            <ul className="space-y-3">
              <li><Link to="/login" className="text-sm text-neutral-500 hover:text-white transition-colors duration-200">Sign In</Link></li>
              <li><Link to="/signup" className="text-sm text-neutral-500 hover:text-white transition-colors duration-200">Create Account</Link></li>
              <li><Link to="/orders" className="text-sm text-neutral-500 hover:text-white transition-colors duration-200">Order History</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300 mb-4">Info</h3>
            <ul className="space-y-3">
              <li><span className="text-sm text-neutral-500">Shipping & Returns</span></li>
              <li><span className="text-sm text-neutral-500">Privacy Policy</span></li>
              <li><span className="text-sm text-neutral-500">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} LUXOR. All rights reserved.
          </p>
          <p className="text-xs text-neutral-700">
            Designed with precision.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
