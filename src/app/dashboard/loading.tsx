export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 glass rounded-3xl h-36 bg-white/5" />
        <div className="glass rounded-3xl h-36 bg-white/5" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass rounded-3xl h-28 bg-white/5" />
        <div className="glass rounded-3xl h-28 bg-white/5" />
      </div>
    </div>
  );
}
