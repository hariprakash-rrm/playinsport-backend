"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const book_schema_1 = require("./schemas/book.schema");
const mongoose_2 = require("mongoose");
let BookService = class BookService {
    constructor(bookmodel) {
        this.bookmodel = bookmodel;
    }
    async findAll(query) {
        console.log(query);
        const resPerPage = 2;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        const keyword = query.keyword ? {
            title: {
                $regex: query.keyword,
                $options: 'i'
            }
        } : {};
        const book = await this.bookmodel.find(Object.assign({}, keyword)).limit(resPerPage).skip(skip);
        console.log(book);
        return book;
    }
    async createBook(book) {
        const res = await this.bookmodel.create(book);
        return res;
    }
    async findById(id) {
        const isvalidId = mongoose_2.default.isValidObjectId(id);
        if (!isvalidId) {
            throw new common_1.BadRequestException('Enter valid id');
        }
        const res = await this.bookmodel.findById(id);
        if (!res) {
            throw new common_1.NotFoundException('Book not found');
        }
        return res;
    }
    async updatById(id, book) {
        return await this.bookmodel.findByIdAndUpdate(id, book, {
            new: true,
            runValidators: true
        });
    }
    async deleteById(id) {
        return await this.bookmodel.findByIdAndDelete(id);
    }
};
BookService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(book_schema_1.Book.name)),
    __metadata("design:paramtypes", [mongoose_2.default.Model])
], BookService);
exports.BookService = BookService;
//# sourceMappingURL=book.service.js.map