export const SkeletonAnnouncementsList = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-2">
        <div className="h-7 w-44 skeleton-animate rounded-lg"></div>
        <div className="h-4 w-56 skeleton-animate rounded"></div>
      </div>
      <div className="h-11 w-44 skeleton-animate rounded-xl"></div>
    </div>

    <div className="flex gap-2 flex-wrap">
      {['All', 'Important', 'General', 'Events'].map((_, i) => (
        <div key={i} className="h-9 w-24 skeleton-animate rounded-full"></div>
      ))}
    </div>

    <div className="grid gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="skeleton-announcement-card">
          <div className="flex gap-4">
            <div className="h-12 w-12 skeleton-animate rounded-xl flex items-center justify-center">
              <div className="h-6 w-6 skeleton-animate rounded-full"></div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="h-5 w-3/4 skeleton-animate rounded"></div>
                  <div className="h-3 w-32 skeleton-animate rounded"></div>
                </div>
                <div className="h-6 w-20 skeleton-animate rounded-full"></div>
              </div>
              <div className="space-y-1">
                <div className="h-3 w-full skeleton-animate rounded"></div>
                <div className="h-3 w-2/3 skeleton-animate rounded"></div>
              </div>
              <div className="flex gap-4 pt-2">
                <div className="h-6 w-16 skeleton-animate rounded-full"></div>
                <div className="h-6 w-20 skeleton-animate rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SkeletonAnnouncementsList;
