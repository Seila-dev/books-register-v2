import { Plus } from "lucide-react";
import Link from "next/link";

export const QuickAddCard = () => {
  return (
    <Link
      href="/home/books/create"
      className="w-full aspect-[2/3] relative rounded-xl overflow-hidden bg-gray-800 hover:scale-[1.03] hover:shadow-blue-400/30 transition-all duration-300 ease-in-out flex items-center justify-center"
    >
      <div className="text-center cursor-pointer group-hover:scale-105 transition-transform duration-300">
        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
          <Plus className="h-6 w-6 text-blue-400 group-hover:rotate-90 transition-transform duration-300" />
        </div>
        <span className="text-gray-300 text-sm font-medium">Adicionar</span>
      </div>
    </Link>
  );
};
