import ProductCard from './ProductCard'

export default function ProductGrid({ products, categoriesById }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-10">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} categoryName={categoriesById?.[p.categoryId]?.name} delay={i} />
      ))}
    </div>
  )
}
