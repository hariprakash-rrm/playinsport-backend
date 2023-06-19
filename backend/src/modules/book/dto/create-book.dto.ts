import { IsEnum, IsNotEmpty, IsString, isNotEmpty, isString } from "class-validator";
import { Category } from "../schemas/book.schema";

export class CreateBookDto{

    @IsNotEmpty()
    @IsString()
    readonly title:string

    @IsNotEmpty()
    @IsString()
    readonly description : string

    @IsNotEmpty()
    @IsEnum(Category,{message:'please enter correct category'})
    readonly category:Category
}