export interface User {
    id: string | number;
    email: string;
    username: string;
    books?: string[]; 
}