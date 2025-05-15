export interface Category {
    id: string;
    name: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface BookCategory {
    category: Category;
    categoryId: string;
    bookId: string;
    assignedAt: string;
}