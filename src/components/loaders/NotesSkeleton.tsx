const NotesSkeleton = () => (
    <div className="min-h-screen w-full bg-gray-900 p-6 text-white">
        <div className="mx-auto animate-pulse space-y-6">
            <div className="h-10 bg-gray-700 rounded"></div>
            {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-800 p-6 rounded-lg">
                    <div className="h-5 bg-gray-700 rounded mb-3"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                </div>
            ))}
        </div>
    </div>
);

export default NotesSkeleton;