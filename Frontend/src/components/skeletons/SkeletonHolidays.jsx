export const SkeletonHolidays = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="h-7 w-36 skeleton-animate rounded-lg"></div>
        <div className="h-4 w-48 skeleton-animate rounded"></div>
      </div>
      <div className="h-11 w-44 skeleton-animate rounded-xl"></div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="skeleton-holiday-card">
          <div className="flex gap-4">
            <div className="skeleton-date-box">
              <div className="h-8 w-12 skeleton-animate rounded-lg"></div>
              <div className="h-3 w-16 skeleton-animate rounded mt-1"></div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 skeleton-animate rounded"></div>
              <div className="h-3 w-1/2 skeleton-animate rounded"></div>
            </div>
            <div className="h-6 w-6 skeleton-animate rounded-full"></div>
          </div>
        </div>
      ))}
    </div>

    <div className="skeleton-calendar-mini">
      <div className="h-8 w-full skeleton-animate rounded-t-xl"></div>
      <div className="grid grid-cols-7 gap-1 p-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-8 skeleton-animate rounded"></div>
        ))}
        {[...Array(35)].map((_, i) => (
          <div key={i} className="h-8 skeleton-animate rounded" style={{ opacity: Math.random() > 0.7 ? 1 : 0.3 }}></div>
        ))}
      </div>
    </div>
  </div>
);

export default SkeletonHolidays;
