export const SkeletonEmployeesList = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="h-7 w-40 skeleton-animate rounded-lg"></div>
        <div className="h-4 w-64 skeleton-animate rounded"></div>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="h-10 w-64 skeleton-animate rounded-lg"></div>
        <div className="h-10 w-36 skeleton-animate rounded-lg"></div>
      </div>
    </div>

    <div className="skeleton-table-container">
      <div className="skeleton-table-header">
        <div className="grid grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 w-20 skeleton-animate rounded"></div>
          ))}
        </div>
      </div>
      <div className="skeleton-table-body">
        {[...Array(8)].map((_, rowIdx) => (
          <div key={rowIdx} className="skeleton-table-row">
            <div className="h-10 w-10 skeleton-animate rounded-full"></div>
            {[...Array(5)].map((_, colIdx) => (
              <div key={colIdx} className="space-y-1">
                <div className="h-4 skeleton-animate rounded" style={{ width: `${60 + Math.random() * 40}%` }}></div>
                <div className="h-3 w-3/4 skeleton-animate rounded"></div>
              </div>
            ))}
            <div className="flex gap-2">
              <div className="h-8 w-8 skeleton-animate rounded-lg"></div>
              <div className="h-8 w-8 skeleton-animate rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="flex items-center justify-between">
      <div className="h-4 w-32 skeleton-animate rounded"></div>
      <div className="flex gap-2">
        <div className="h-8 w-8 skeleton-animate rounded"></div>
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-8 w-8 skeleton-animate rounded"></div>
        ))}
        <div className="h-8 w-8 skeleton-animate rounded"></div>
      </div>
    </div>
  </div>
);

export default SkeletonEmployeesList;
