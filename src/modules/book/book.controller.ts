import { Body, Controller,Delete,Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Book } from './schemas/book.schema';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import {Query as ExpressQuery} from 'express-serve-static-core'
import { AuthGuard } from '@nestjs/passport';
@Controller('book')
export class BookController {
constructor(private bookSerice:BookService){}
    @Get('/')
    async getAllBook(@Query()query:ExpressQuery):Promise<Book[]>{
      
       return this.bookSerice.findAll(query)
    }

    @Post()
    @UseGuards(AuthGuard())
    async create(@Body()book:CreateBookDto):Promise<Book>{
        return this.bookSerice.createBook(book)
    }

    @Get(':id')
    async getBookById(@Param('id')id:string):Promise<Book>{
       return this.bookSerice.findById(id)

    }

    @Put(':id')
    async updateById(@Param('id')id:string,@Body()book:CreateBookDto):Promise<Book>{
        return this.bookSerice.updatById(id,book)
    }

    @Delete(':id')
    async deleteById(@Param('id')id:string):Promise <Book>{
        return this.bookSerice.deleteById(id)
    }
}
