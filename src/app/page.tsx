import BooksPage from "@/components/BooksPage";
import { Header } from "@/components/Header";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-gray-900 text-white flex flex-col items-center min-h-full w-full">
      <BooksPage />
    </div>
  )
}
