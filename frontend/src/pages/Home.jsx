import { Link } from 'react-router-dom'

function Home() {
  return (
    <main>
      <section
        aria-labelledby="hero-heading"
        className="bg-neutral-50"
      >
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-neutral-500">
              LUXOR
            </p>
            <h1
              id="hero-heading"
              className="text-4xl font-bold leading-[1.1] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Elevate Your Everyday
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-neutral-600 sm:text-lg">
              Discover thoughtfully designed products made for modern living.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-8 py-3.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-neutral-800"
              >
                Shop Now
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-8 py-3.5 text-sm font-medium text-neutral-900 transition-colors duration-200 hover:border-neutral-400 hover:bg-neutral-100"
              >
                Explore Collection
              </Link>
            </div>
          </div>

          <div className="relative lg:h-full">
            <figure className="overflow-hidden rounded-2xl shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
                alt="Minimal modern interior with curated lifestyle products"
                className="aspect-[4/5] w-full object-cover sm:aspect-[3/4] lg:aspect-auto lg:h-[min(72vh,720px)]"
              />
            </figure>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
