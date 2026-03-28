export const SkeletonDashboardHome = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <div className="skeleton" style={{ height: '2rem', width: '12rem', borderRadius: '0.5rem' }} />
        <div className="skeleton" style={{ height: '1rem', width: '8rem', borderRadius: '0.25rem' }} />
      </div>
      <div className="flex gap-2">
        <div className="skeleton" style={{ height: '2.5rem', width: '8rem', borderRadius: '0.5rem' }} />
        <div className="skeleton" style={{ height: '2.5rem', width: '6rem', borderRadius: '0.5rem' }} />
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { color: 'rgba(99, 102, 241, 0.2)', icon: 'bg-indigo-500/20' },
        { color: 'rgba(34, 197, 94, 0.2)', icon: 'bg-emerald-500/20' },
        { color: 'rgba(239, 68, 68, 0.2)', icon: 'bg-rose-500/20' },
        { color: 'rgba(234, 179, 8, 0.2)', icon: 'bg-amber-500/20' },
      ].map((item, i) => (
        <div key={i} className="skeleton-stat-card">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="skeleton" style={{ height: '0.75rem', width: '5rem', borderRadius: '0.25rem' }} />
              <div className="skeleton" style={{ height: '2rem', width: '4rem', borderRadius: '0.25rem' }} />
              <div className="skeleton" style={{ height: '0.625rem', width: '6rem', borderRadius: '0.25rem' }} />
            </div>
            <div className={`skeleton ${item.icon}`} style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem' }} />
          </div>
        </div>
      ))}
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="skeleton-chart-card">
        <div className="skeleton" style={{ height: '1.5rem', width: '10rem', marginBottom: '1rem', borderRadius: '0.25rem' }} />
        <div className="skeleton-chart">
          {[65, 85, 50, 90, 75, 60, 80].map((h, i) => (
            <div key={i} className="skeleton-chart-bar" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
        <div className="flex justify-around mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border, #334155)' }}>
          {[...Array(7)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '0.625rem', width: '2rem', borderRadius: '0.25rem' }} />
          ))}
        </div>
      </div>

      <div className="skeleton-chart-card">
        <div className="skeleton" style={{ height: '1.5rem', width: '10rem', marginBottom: '1rem', borderRadius: '0.25rem' }} />
        <div className="flex items-center justify-center gap-8">
          <div className="skeleton-donut">
            <div className="skeleton" style={{ width: '8rem', height: '8rem', borderRadius: '50%' }} />
          </div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="skeleton" style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%' }} />
                <div className="skeleton" style={{ height: '0.75rem', width: '5rem', borderRadius: '0.25rem' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="grid gap-4 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton-list-card">
          <div className="flex items-center justify-between mb-4">
            <div className="skeleton" style={{ height: '1.25rem', width: '8rem', borderRadius: '0.25rem' }} />
            <div className="skeleton" style={{ height: '1.875rem', width: '4rem', borderRadius: '0.5rem' }} />
          </div>
          {[...Array(4)].map((_, j) => (
            <div key={j} className="skeleton-list-item">
              <div className="skeleton" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%' }} />
              <div className="flex-1 space-y-2">
                <div className="skeleton" style={{ height: '1rem', width: '60%', borderRadius: '0.25rem' }} />
                <div className="skeleton" style={{ height: '0.75rem', width: '40%', borderRadius: '0.25rem' }} />
              </div>
              <div className="skeleton" style={{ height: '1.5rem', width: '4rem', borderRadius: '9999px' }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default SkeletonDashboardHome;
