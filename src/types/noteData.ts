import { Book } from "./bookData";

export interface CreateNoteData {
    content: string;
    bookId: string;
}

export interface UpdateNoteData {
    id: string;
    content: string;
}

export interface Note {
    id: string;
    content: string;
    createdAt: string;
    bookId: string;
    userId: number;
    book: Book;
}