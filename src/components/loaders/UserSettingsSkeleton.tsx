export default function UserSettingsSkeleton() {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 animate-pulse text-white">
      <div className="flex items-center mb-4 space-x-2">
        <div className="bg-gray-700 rounded-full w-5 h-5" />
        <div className="bg-gray-700 h-4 w-24 rounded" />
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow space-y-4">
        <div className="space-y-2">
          <div className="bg-gray-700 h-5 w-48 rounded" />
          <div className="bg-gray-700 h-4 w-64 rounded" />
          <div className="bg-gray-700 h-4 w-40 rounded" />
        </div>

        <div className="space-y-2 mt-6">
          <div className="bg-gray-700 h-5 w-40 rounded" />
          <div className="bg-gray-700 h-4 w-56 rounded" />
          <div className="bg-gray-700 h-4 w-48 rounded" />
        </div>

        <div className="text-right pt-4">
          <div className="bg-gray-700 h-10 w-32 rounded-md inline-block" />
        </div>
      </div>
    </div>
  );
}