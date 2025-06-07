export function BookDetailHeroSkeleton() {
  return (
    <section className="relative w-full bg-gradient-to-br from-[#0f0f0f] to-black text-white overflow-hidden rounded-xl shadow-2xl p-10">
      {/* Fundo Blur com placeholder */}
      <div className="absolute inset-0 bg-gray-900 opacity-20 blur-md scale-105" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-10">
        {/* Capa do livro - skeleton */}
        <div className="flex-shrink-0 w-full lg:w-60 flex justify-center md:justify-start">
          <div className="w-48 h-72 rounded-lg bg-gray-700 animate-pulse" />
        </div>

        {/* Conteúdo principal - skeleton */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Título */}
          <div className="h-12 w-3/4 bg-gray-700 rounded-md animate-pulse" />

          {/* Status */}
          <div className="h-6 w-24 bg-gray-700 rounded-md animate-pulse" />

          {/* Avaliação */}
          <div className="h-8 w-32 bg-gray-700 rounded-md animate-pulse" />

          {/* Descrição */}
          <div className="space-y-2">
            <div className="h-4 w-full max-w-2xl bg-gray-700 rounded-md animate-pulse" />
            <div className="h-4 w-5/6 max-w-2xl bg-gray-700 rounded-md animate-pulse" />
            <div className="h-4 w-3/4 max-w-2xl bg-gray-700 rounded-md animate-pulse" />
          </div>

          {/* Datas */}
          <div className="h-4 w-48 bg-gray-700 rounded-md animate-pulse" />

          {/* Categorias */}
          <div className="h-8 w-48 bg-gray-700 rounded-md animate-pulse" />

          {/* Ações */}
          <div className="h-10 w-40 bg-gray-700 rounded-md animate-pulse" />

          {/* Rodapé */}
          <div className="mt-auto flex justify-between text-xs text-gray-500">
            <div className="h-3 w-20 bg-gray-700 rounded-md animate-pulse" />
            <div className="h-3 w-48 bg-gray-700 rounded-md animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
