export function BookExtrasSectionSkeleton() {
  return (
    <div className="mt-8 space-y-12 p-6 relative z-0">
      {/* Skeleton Header da seção */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-700 rounded-lg animate-pulse">
              <div className="w-5 h-5 bg-gray-600 rounded" />
            </div>
            <div className="space-y-1">
              <div className="h-6 w-48 bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-600 rounded animate-pulse" />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="h-8 w-32 bg-gray-700 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Skeleton filtros */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
          <div className="flex-1 relative">
            <div className="h-10 w-full bg-gray-700 rounded-lg animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-gray-700 rounded animate-pulse" />
            <div className="h-10 w-32 bg-gray-700 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Skeleton form nova anotação */}
        <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700 p-6 space-y-4 animate-pulse">
          <div className="h-6 w-40 bg-gray-700 rounded" />
          <div className="h-32 w-full bg-gray-700 rounded" />
          <div className="flex justify-end gap-3">
            <div className="h-10 w-20 bg-gray-700 rounded" />
            <div className="h-10 w-24 bg-gray-700 rounded" />
          </div>
        </div>

        {/* Skeleton lista de anotações */}
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-r from-gray-900/60 to-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-6 space-y-4 animate-pulse"
            >
              <div className="h-20 w-full bg-gray-700 rounded-md" />
              <div className="h-4 w-32 bg-gray-600 rounded-md" />
            </div>
          ))}
        </div>
      </section>

      {/* Skeleton carrossel livros similares */}
      <div className="mt-12">
        <div className="h-48 w-full bg-gray-700 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
