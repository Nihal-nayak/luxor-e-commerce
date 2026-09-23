import ProductCard from './ProductCard'

function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-neutral-500">
        No products found in this category.
      </p>
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}

export default ProductGrid
