export const SkeletonDashboardLayout = ({ children }) => (
  <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
    <SidebarSkeleton />
    <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
      <HeaderSkeleton />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        {children}
      </main>
      <FooterSkeleton />
    </div>
  </div>
);

const SidebarSkeleton = () => (
  <aside
    className="fixed lg:sticky inset-y-0 left-0 z-40 h-screen w-64 lg:w-72 border-r flex flex-col"
    style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}
  >
    <div className="px-4 py-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 skeleton-animate rounded-lg"></div>
        <div className="hidden sm:block space-y-2">
          <div className="h-5 w-20 skeleton-animate rounded"></div>
          <div className="h-3 w-24 skeleton-animate rounded"></div>
        </div>
      </div>
    </div>

    <div className="px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 skeleton-animate rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-24 skeleton-animate rounded"></div>
          <div className="h-3 w-16 skeleton-animate rounded"></div>
        </div>
      </div>
    </div>

    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="px-4 py-2.5">
          <div className="h-4 skeleton-animate rounded" style={{ width: `${60 + Math.random() * 40}%` }}></div>
        </div>
      ))}
    </nav>

    <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
      <div className="h-10 skeleton-animate rounded-lg"></div>
    </div>
  </aside>
);

const HeaderSkeleton = () => (
  <header
    className="sticky top-0 z-50 px-4 lg:px-8 py-4 shadow-md flex items-center gap-4"
    style={{ backgroundColor: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}
  >
    <div className="lg:hidden h-10 w-10 skeleton-animate rounded-lg"></div>
    
    <div className="ml-auto flex items-center gap-4">
      <div className="h-10 w-10 skeleton-animate rounded-full"></div>
      <div className="h-10 w-10 skeleton-animate rounded-full"></div>
    </div>
  </header>
);

const FooterSkeleton = () => (
  <footer
    className="px-4 lg:px-8 py-3 text-center border-t"
    style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}
  >
    <div className="h-4 w-64 mx-auto skeleton-animate rounded"></div>
  </footer>
);

export default SkeletonDashboardLayout;
