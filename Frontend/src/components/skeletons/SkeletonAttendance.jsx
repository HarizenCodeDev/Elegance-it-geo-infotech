export const SkeletonAttendance = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="h-7 w-44 skeleton-animate rounded-lg"></div>
        <div className="h-4 w-52 skeleton-animate rounded"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-10 w-40 skeleton-animate rounded-lg"></div>
        <div className="h-10 w-32 skeleton-animate rounded-lg"></div>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'Present', value: '22', color: 'bg-emerald-500' },
        { label: 'Absent', value: '2', color: 'bg-rose-500' },
        { label: 'Late', value: '1', color: 'bg-amber-500' },
        { label: 'On Leave', value: '3', color: 'bg-blue-500' },
      ].map((stat, i) => (
        <div key={i} className="skeleton-stat-card">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-3 w-16 skeleton-animate rounded"></div>
              <div className="h-7 w-10 skeleton-animate rounded"></div>
            </div>
            <div className={`h-10 w-10 skeleton-animate rounded-lg ${stat.color}`}></div>
          </div>
        </div>
      ))}
    </div>

    <div className="skeleton-chart-card p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 w-40 skeleton-animate rounded"></div>
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-16 skeleton-animate rounded-lg"></div>
          ))}
        </div>
      </div>
      <div className="skeleton-bar-chart">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="skeleton-bar-wrapper">
            <div 
              className="skeleton-bar" 
              style={{ height: `${30 + Math.random() * 70}%` }}
            ></div>
            <div className="h-2 w-full skeleton-animate rounded mt-2"></div>
          </div>
        ))}
      </div>
    </div>

    <div className="skeleton-table-container">
      <div className="skeleton-table-header">
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-20 skeleton-animate rounded"></div>
          ))}
        </div>
      </div>
      <div className="skeleton-table-body">
        {[...Array(8)].map((_, rowIdx) => (
          <div key={rowIdx} className="skeleton-table-row">
            <div className="h-10 w-10 skeleton-animate rounded-full"></div>
            <div className="space-y-1">
              <div className="h-4 w-24 skeleton-animate rounded"></div>
              <div className="h-3 w-16 skeleton-animate rounded"></div>
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 w-16 skeleton-animate rounded"></div>
            ))}
            <div className="h-6 w-16 skeleton-animate rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SkeletonAttendance;
