export default function LaporanLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
        <div>
          <div className="h-8 w-40 bg-white/10 rounded-lg mb-2" />
          <div className="h-4 w-64 bg-white/5 rounded-lg" />
        </div>
        <div className="h-12 w-40 glass rounded-full bg-white/5" />
      </div>
      <div className="glass rounded-3xl h-96 bg-white/5" />
    </div>
  );
}
