
function CategoryBoxSkeleton() {
  return (
    <div className="category-box">
      <div className="top-line">
        <span className="index w-5 h-5 skeleton"/>
      </div>
      <div className="w-40 h-9 skeleton mt-1" />
      <div className="mt-1 inline-flex">
        <div className="h-4 w-14 skeleton mr-1"/>
        <div className="h-4 w-4 skeleton"/>
      </div>
    </div>
  )
}

export default CategoryBoxSkeleton