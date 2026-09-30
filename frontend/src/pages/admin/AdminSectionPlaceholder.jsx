function AdminSectionPlaceholder({ title, description }) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
      <p className="mt-3 text-sm text-neutral-600">
        {description}
      </p>
      <p className="mt-6 rounded-lg bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
        Full management tools for this section will be added in the next implementation phase.
      </p>
    </div>
  )
}

export default AdminSectionPlaceholder
