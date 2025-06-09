import { Book } from "./bookData";

export interface Category {
    id: string;
    name: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    books: Book[];
    rank?: number;
}

export interface BookCategory {
    category: Category;
    categoryId: string;
    bookId: string;
    assignedAt: string;
    book: Book;
}