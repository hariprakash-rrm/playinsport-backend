import { Book } from './schemas/book.schema';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
export declare class BookController {
    private bookSerice;
    constructor(bookSerice: BookService);
    getAllBook(query: ExpressQuery): Promise<Book[]>;
    create(book: CreateBookDto): Promise<Book>;
    getBookById(id: string): Promise<Book>;
    updateById(id: string, book: CreateBookDto): Promise<Book>;
    deleteById(id: string): Promise<Book>;
}
