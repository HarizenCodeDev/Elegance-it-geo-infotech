export const SkeletonLeaveCalendar = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="h-7 w-48 skeleton-animate rounded-lg"></div>
        <div className="h-4 w-40 skeleton-animate rounded"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-10 w-32 skeleton-animate rounded-lg"></div>
        <div className="h-10 w-24 skeleton-animate rounded-lg"></div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 skeleton-calendar-wrapper">
        <div className="skeleton-calendar-header">
          <div className="h-8 w-8 skeleton-animate rounded-lg"></div>
          <div className="h-6 w-32 skeleton-animate rounded"></div>
          <div className="h-8 w-8 skeleton-animate rounded-lg"></div>
        </div>
        <div className="skeleton-calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
            <div key={i} className="h-10 skeleton-animate rounded-t-lg flex items-center justify-center">
              <div className="h-3 w-8 skeleton-animate rounded"></div>
            </div>
          ))}
          {[...Array(35)].map((_, i) => (
            <div key={i} className="skeleton-calendar-day">
              <div className="h-8 w-8 skeleton-animate rounded-full"></div>
              {Math.random() > 0.7 && (
                <div className="h-2 w-6 skeleton-animate rounded-full" style={{ marginTop: 2 }}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="skeleton-legend-card">
          <div className="h-5 w-24 skeleton-animate rounded mb-3"></div>
          <div className="space-y-2">
            {['Annual Leave', 'Sick Leave', 'Casual Leave', 'Holidays'].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-4 w-4 skeleton-animate rounded-full"></div>
                <div className="h-3 w-20 skeleton-animate rounded"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="skeleton-pending-card">
          <div className="h-5 w-28 skeleton-animate rounded mb-3"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="h-8 w-8 skeleton-animate rounded-full"></div>
              <div className="flex-1 space-y-1">
                <div className="h-3 w-3/4 skeleton-animate rounded"></div>
                <div className="h-3 w-1/2 skeleton-animate rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default SkeletonLeaveCalendar;
