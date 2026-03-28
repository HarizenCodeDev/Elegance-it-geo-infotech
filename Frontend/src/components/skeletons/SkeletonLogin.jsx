export const SkeletonLogin = () => (
  <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #030712 0%, #0f172a 50%, #030712 100%)' }}>
    <div className="absolute inset-0" style={{
      backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)`,
      backgroundSize: '60px 60px'
    }} />
    
    <div className="w-full max-w-md relative z-10">
      <div className="text-center mb-8">
        <div className="skeleton-logo-wrapper">
          <div className="skeleton-logo-ring" />
          <div className="skeleton-logo-glow" />
          <div className="skeleton-logo-inner" />
        </div>
        <div className="skeleton mt-6" style={{ height: '2.5rem', width: '60%', margin: '1.5rem auto 0', borderRadius: '0.5rem' }} />
        <div className="skeleton mt-2" style={{ height: '0.75rem', width: '40%', margin: '0.5rem auto 0', borderRadius: '0.25rem' }} />
      </div>

      <div className="skeleton-card" style={{ padding: '2rem' }}>
        <div className="text-center mb-6">
          <div className="skeleton" style={{ height: '1.5rem', width: '30%', margin: '0 auto', borderRadius: '0.5rem' }} />
          <div className="skeleton mt-2" style={{ height: '0.875rem', width: '60%', margin: '0.5rem auto 0', borderRadius: '0.25rem' }} />
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="skeleton" style={{ height: '0.875rem', width: '35%', borderRadius: '0.25rem' }} />
            <div className="skeleton" style={{ height: '3rem', borderRadius: '0.5rem' }} />
          </div>

          <div className="space-y-2">
            <div className="skeleton" style={{ height: '0.875rem', width: '25%', borderRadius: '0.25rem' }} />
            <div className="skeleton" style={{ height: '3rem', borderRadius: '0.5rem' }} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="skeleton" style={{ width: '1rem', height: '1rem', borderRadius: '0.25rem' }} />
              <div className="skeleton" style={{ height: '0.875rem', width: '5rem', borderRadius: '0.25rem' }} />
            </div>
            <div className="skeleton" style={{ height: '0.875rem', width: '6rem', borderRadius: '0.25rem' }} />
          </div>

          <div className="skeleton" style={{ height: '3rem', borderRadius: '0.75rem' }} />
        </div>

        <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--color-border, #334155)' }}>
          <div className="flex items-center justify-center gap-4">
            <div className="skeleton" style={{ height: '0.75rem', width: '5rem', borderRadius: '0.25rem' }} />
            <div className="skeleton" style={{ width: '0.25rem', height: '0.75rem', borderRadius: '50%' }} />
            <div className="skeleton" style={{ height: '0.75rem', width: '5rem', borderRadius: '0.25rem' }} />
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <div className="skeleton" style={{ height: '0.75rem', width: '60%', margin: '0 auto', borderRadius: '0.25rem' }} />
      </div>
    </div>
    
    <style>{`
      .skeleton-logo-wrapper {
        position: relative;
        width: 80px;
        height: 80px;
        margin: 0 auto;
      }
      .skeleton-logo-ring {
        position: absolute;
        inset: -10px;
        border: 2px solid rgba(99, 102, 241, 0.3);
        border-radius: 50%;
        animation: ring-spin 3s linear infinite;
      }
      .skeleton-logo-glow {
        position: absolute;
        inset: -20px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        animation: glow-pulse 2s ease-in-out infinite;
      }
      .skeleton-logo-inner {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: rgba(99, 102, 241, 0.5);
      }
      .skeleton {
        background: linear-gradient(90deg, #1e293b 0%, #334155 50%, #1e293b 100%);
        background-size: 200% 100%;
        animation: shimmer 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
      .skeleton-card {
        background-color: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 1.5rem;
        backdrop-filter: blur(10px);
      }
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      @keyframes glow-pulse {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.1); }
      }
      @keyframes ring-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default SkeletonLogin;
