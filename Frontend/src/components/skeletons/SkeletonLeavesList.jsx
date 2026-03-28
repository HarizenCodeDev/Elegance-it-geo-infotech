export const SkeletonLeavesList = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="h-7 w-40 skeleton-animate rounded-lg"></div>
        <div className="h-4 w-56 skeleton-animate rounded"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-10 w-32 skeleton-animate rounded-lg"></div>
        <div className="h-10 w-32 skeleton-animate rounded-lg"></div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton-stat-card">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-3 w-20 skeleton-animate rounded"></div>
              <div className="h-7 w-12 skeleton-animate rounded"></div>
            </div>
            <div className="h-10 w-10 skeleton-animate rounded-full"></div>
          </div>
        </div>
      ))}
    </div>

    <div className="skeleton-tabs">
      {['All', 'Pending', 'Approved', 'Rejected'].map((_, i) => (
        <div key={i} className="h-10 w-24 skeleton-animate rounded-t-lg"></div>
      ))}
    </div>

    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton-leave-card">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 skeleton-animate rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="h-4 w-32 skeleton-animate rounded"></div>
                  <div className="h-3 w-48 skeleton-animate rounded"></div>
                </div>
                <div className="h-6 w-20 skeleton-animate rounded-full"></div>
              </div>
              <div className="flex gap-4">
                <div className="h-3 w-24 skeleton-animate rounded"></div>
                <div className="h-3 w-24 skeleton-animate rounded"></div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-8 skeleton-animate rounded-lg"></div>
              <div className="h-8 w-8 skeleton-animate rounded-lg"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SkeletonLeavesList;
