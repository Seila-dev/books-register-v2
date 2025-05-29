import { Plus } from "lucide-react";
import Link from "next/link";

export const QuickAddCard = () => {

  return (
    <Link
    href={'/books/create'} 
    className="bg-slate-700 border-slate-600 hover:bg-slate-600 transition-all duration-300 group">
      <div className="p-0">
        <div className="aspect-[3/4] flex flex-col items-center justify-center p-4">
            <div 
              className="text-center cursor-pointer group-hover:scale-105 transition-transform duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                <Plus className="h-6 w-6 text-blue-400 group-hover:rotate-90 transition-transform duration-300" />
              </div>
              <span className="text-gray-300 text-sm font-medium">Adicionar</span>
            </div>
        </div>
      </div>
    </Link>
  );
};