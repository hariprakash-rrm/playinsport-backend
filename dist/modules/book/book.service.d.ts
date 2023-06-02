import { Book } from './schemas/book.schema';
import { Query } from 'express-serve-static-core';
import mongoose from 'mongoose';
export declare class BookService {
    private bookmodel;
    constructor(bookmodel: mongoose.Model<Book>);
    findAll(query: Query): Promise<Book[]>;
    createBook(book: Book): Promise<Book>;
    findById(id: string): Promise<Book>;
    updatById(id: string, book: Book): Promise<Book>;
    deleteById(id: string): Promise<Book>;
}
