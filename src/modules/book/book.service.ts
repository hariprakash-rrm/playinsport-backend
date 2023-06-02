import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import { Query } from 'express-serve-static-core'
import mongoose from 'mongoose';
import { promises } from 'dns';
@Injectable()
export class BookService {

    constructor(@InjectModel(Book.name)
    private bookmodel: mongoose.Model<Book>) { }


    async findAll(query: Query): Promise<Book[]> {
        console.log(query)
        const resPerPage = 2
        const currentPage = Number(query.page) || 1
        const skip = resPerPage * (currentPage - 1)
        const keyword = query.keyword ? {
            title: {
                $regex: query.keyword,
                $options: 'i'
            }
        } : {}
        const book = await this.bookmodel.find({ ...keyword }).limit(resPerPage).skip(skip)

        console.log(book)
        return book
    }

    async createBook(book: Book): Promise<Book> {
        const res = await this.bookmodel.create(book)
        return res
    }

    async findById(id: string): Promise<Book> {
       

        const isvalidId= mongoose.isValidObjectId(id)
        if(!isvalidId){
            throw new BadRequestException('Enter valid id')
        }
        const res = await this.bookmodel.findById(id)
        if (!res) {
            throw new NotFoundException('Book not found')
        }
        return res
    }

    async updatById(id: string, book: Book): Promise<Book> {
        return await this.bookmodel.findByIdAndUpdate(id, book, {
            new: true,
            runValidators: true
        })
    }

    async deleteById(id: string): Promise<Book> {
        return await this.bookmodel.findByIdAndDelete(id)
    }
}
