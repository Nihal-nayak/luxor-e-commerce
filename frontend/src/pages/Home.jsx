import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="bg-neutral-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2400&q=80"
            alt="Minimal modern interior"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-neutral-900/40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center animate-fade-in-up">
          <p className="mb-6 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-neutral-200">
            The New Standard
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 drop-shadow-sm">
            Elevate Your <br className="hidden sm:block" /> Everyday.
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-neutral-200 font-light leading-relaxed mb-12">
            Discover thoughtfully designed products made for modern living. Uncompromising quality meets timeless aesthetics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-sm font-medium tracking-wide text-neutral-900 bg-white rounded-full hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Shop Collection
            </Link>
            <Link
              to="/categories"
              className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-sm font-medium tracking-wide text-white bg-transparent border border-white/40 rounded-full hover:bg-white/10 transition-colors duration-200"
            >
              Explore Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-center">
            <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Free Shipping</p>
              <p className="mt-2 text-sm text-neutral-600">On orders over $50</p>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Premium Quality</p>
              <p className="mt-2 text-sm text-neutral-600">Carefully curated materials</p>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Easy Returns</p>
              <p className="mt-2 text-sm text-neutral-600">30-day hassle-free returns</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 mb-4">Collections</p>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">Curated Excellence</h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-neutral-600">Objects designed to last a lifetime.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          <Link to="/shop" className="group relative block overflow-hidden rounded-2xl bg-neutral-100 aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"
              alt="Everyday tech collection"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-neutral-900/10 to-transparent"></div>
            <div className="absolute bottom-8 left-8">
              <p className="text-xs font-semibold tracking-[0.2em] text-neutral-300 uppercase mb-2">Collection</p>
              <h3 className="text-2xl font-bold text-white">Everyday Tech</h3>
            </div>
            <div className="absolute bottom-8 right-8 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-neutral-900">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
          <Link to="/shop" className="group relative block overflow-hidden rounded-2xl bg-neutral-100 aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80"
              alt="Premium audio collection"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-neutral-900/10 to-transparent"></div>
            <div className="absolute bottom-8 left-8">
              <p className="text-xs font-semibold tracking-[0.2em] text-neutral-300 uppercase mb-2">Featured</p>
              <h3 className="text-2xl font-bold text-white">Premium Audio</h3>
            </div>
            <div className="absolute bottom-8 right-8 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-neutral-900">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 sm:py-28 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Join the LUXOR Community
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-neutral-400">
            Get early access to new arrivals and exclusive offers.
          </p>
          <Link
            to="/signup"
            className="mt-10 inline-flex items-center justify-center px-10 py-4 text-sm font-medium tracking-wide text-neutral-900 bg-white rounded-full hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Create an Account
          </Link>
        </div>
      </section>
    </main>
  )
}

export default Home
