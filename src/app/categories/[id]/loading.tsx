export default function CategoryLoadingId() {
  return (
    <div className="text-white w-full p-6">
      <div className="h-8 w-1/3 bg-gray-700 animate-pulse rounded mb-6" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-800 h-64 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
