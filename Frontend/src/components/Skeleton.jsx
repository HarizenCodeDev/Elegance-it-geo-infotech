export const Skeleton = ({ className = "", variant = "text" }) => {
  const baseClasses = "animate-pulse bg-slate-700/50";
  
  const variants = {
    text: "h-4 rounded",
    title: "h-6 rounded",
    avatar: "h-10 w-10 rounded-full",
    card: "rounded-xl",
    button: "h-10 w-24 rounded-lg",
  };

  return (
    <div 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
    />
  );
};

export const SkeletonText = ({ lines = 3, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    {[...Array(lines)].map((_, i) => (
      <Skeleton key={i} variant="text" className={i === lines - 1 ? "w-3/4" : "w-full"} />
    ))}
  </div>
);

export const SkeletonCard = ({ className = "" }) => (
  <div 
    className={`rounded-2xl border p-4 ${className}`}
    style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
  >
    <div className="space-y-3">
      <Skeleton variant="title" className="w-1/2" />
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-3/4" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
    <div className="bg-slate-800/50 p-3">
      <div className="flex gap-4">
        {[...Array(cols)].map((_, i) => (
          <Skeleton key={i} variant="text" className="w-24" />
        ))}
      </div>
    </div>
    <div className="p-3 space-y-3">
      {[...Array(rows)].map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4">
          {[...Array(cols)].map((_, colIdx) => (
            <Skeleton key={colIdx} variant="text" className="w-24" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonChart = () => (
  <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
    <Skeleton variant="title" className="w-40 mb-4" />
    <div className="h-64 flex items-center justify-center">
      <Skeleton variant="card" className="h-full w-full" />
    </div>
  </div>
);

export const SkeletonList = ({ items = 5 }) => (
  <div className="space-y-3">
    {[...Array(items)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-1/3" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonGrid = ({ items = 6, cols = 3 }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols} gap-4`}>
    {[...Array(items)].map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default Skeleton;
