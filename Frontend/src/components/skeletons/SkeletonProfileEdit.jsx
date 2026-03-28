export const SkeletonProfileEdit = () => (
  <div className="max-w-3xl mx-auto space-y-6">
    <div className="flex items-center justify-between">
      <div className="h-7 w-32 skeleton-animate rounded-lg"></div>
      <div className="h-10 w-28 skeleton-animate rounded-lg"></div>
    </div>

    <div className="skeleton-profile-card">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="h-24 w-24 skeleton-animate rounded-full"></div>
          <div className="absolute bottom-0 right-0 h-8 w-8 skeleton-animate rounded-full"></div>
        </div>
        <div className="text-center sm:text-left space-y-2">
          <div className="h-6 w-40 skeleton-animate rounded"></div>
          <div className="h-4 w-32 skeleton-animate rounded"></div>
          <div className="h-4 w-24 skeleton-animate rounded"></div>
        </div>
      </div>
    </div>

    <div className="skeleton-form-card">
      <div className="h-6 w-32 skeleton-animate rounded mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-20 skeleton-animate rounded"></div>
            <div className="h-11 skeleton-animate rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>

    <div className="skeleton-form-card">
      <div className="h-6 w-36 skeleton-animate rounded mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-24 skeleton-animate rounded"></div>
            <div className="h-11 skeleton-animate rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>

    <div className="flex gap-3">
      <div className="h-11 w-32 skeleton-animate rounded-xl"></div>
      <div className="h-11 w-24 skeleton-animate rounded-xl"></div>
    </div>
  </div>
);

export default SkeletonProfileEdit;
