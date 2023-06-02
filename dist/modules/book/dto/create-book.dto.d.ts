import { Category } from "../schemas/book.schema";
export declare class CreateBookDto {
    readonly title: string;
    readonly description: string;
    readonly category: Category;
}
