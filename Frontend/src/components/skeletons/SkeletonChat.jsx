export const SkeletonChat = () => (
  <div className="h-full flex" style={{ backgroundColor: 'var(--color-bg-card)' }}>
    <div className="w-80 border-r flex flex-col" style={{ borderColor: 'var(--color-border)' }}>
      <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="h-10 w-full skeleton-animate rounded-lg"></div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {[...Array(10)].map((_, i) => (
          <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${i === 0 ? 'skeleton-active-chat' : ''}`}>
            <div className="h-12 w-12 skeleton-animate rounded-full"></div>
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between">
                <div className="h-4 w-24 skeleton-animate rounded"></div>
                <div className="h-3 w-12 skeleton-animate rounded"></div>
              </div>
              <div className="h-3 w-32 skeleton-animate rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--color-border)' }}>
        <div className="h-12 w-12 skeleton-animate rounded-full"></div>
        <div className="space-y-1.5">
          <div className="h-4 w-28 skeleton-animate rounded"></div>
          <div className="h-3 w-20 skeleton-animate rounded"></div>
        </div>
        <div className="ml-auto flex gap-2">
          <div className="h-10 w-10 skeleton-animate rounded-lg"></div>
          <div className="h-10 w-10 skeleton-animate rounded-lg"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={i % 2 === 0 ? 'skeleton-message-sent' : 'skeleton-message-received'}>
            <div className="skeleton-message-content">
              <div className="h-4 w-48 skeleton-animate rounded"></div>
              <div className="h-4 w-32 skeleton-animate rounded mt-1"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex gap-3">
          <div className="h-12 w-12 skeleton-animate rounded-lg"></div>
          <div className="flex-1 h-12 skeleton-animate rounded-xl"></div>
          <div className="h-12 w-24 skeleton-animate rounded-xl"></div>
        </div>
      </div>
    </div>
  </div>
);

export default SkeletonChat;
