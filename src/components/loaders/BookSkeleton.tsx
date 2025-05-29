export const BookSkeleton = () => {
  return (
    <div className="flex flex-col animate-pulse rounded-md shadow-md overflow-hidden max-h-[450px] h-full bg-gray-800 w-full">
      <div className="h-36 md:h-[40rem] w-full bg-gray-700"></div>
      <div className="p-1 flex flex-col gap-2 border-t border-gray-700 items-center">
        <div className="h-4 w-24 bg-gray-700 rounded"></div>
        <div className="h-4 w-16 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};