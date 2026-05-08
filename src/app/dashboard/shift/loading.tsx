export default function ShiftLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
        <div>
          <div className="h-8 w-48 bg-white/10 rounded-lg mb-2" />
          <div className="h-4 w-72 bg-white/5 rounded-lg" />
        </div>
        <div className="flex gap-3">
          <div className="h-16 w-36 glass rounded-3xl bg-white/5" />
          <div className="h-16 w-36 glass rounded-3xl bg-white/5" />
        </div>
      </div>
      <div className="glass rounded-3xl h-80 bg-white/5 mb-8" />
      <div className="glass rounded-3xl h-64 bg-white/5" />
    </div>
  );
}
