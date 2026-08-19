function LoadingSkeleton() {
  return (
    <div className="mb-14">

      <div className="h-8 w-56 rounded bg-zinc-800 animate-pulse mb-6"></div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="rounded-2xl overflow-hidden"
          >
            <div className="h-[360px] bg-zinc-800 animate-pulse rounded-xl"></div>

            <div className="mt-3 h-5 w-3/4 bg-zinc-800 rounded animate-pulse"></div>

            <div className="mt-2 h-4 w-1/2 bg-zinc-800 rounded animate-pulse"></div>
          </div>
        ))}

      </div>

    </div>
  );
}

export default LoadingSkeleton;