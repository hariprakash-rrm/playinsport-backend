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
exports.CointossService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../auth/schemas/user.schema");
let CointossService = class CointossService {
    constructor(userModels) {
        this.userModels = userModels;
    }
    async play(details, authToken) {
        const result = 1;
        const { username, amount } = details;
        const user = await this.userModels.findOne({ authToken });
        if (result == 1) {
            user.wallet -= amount * 2;
            if (user.wallet - amount < 0) {
                throw new common_1.NotAcceptableException('not enough balance');
            }
            user.save();
        }
        let users = user.username;
        let userWallet = user.wallet;
        return { username, userWallet };
    }
};
CointossService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CointossService);
exports.CointossService = CointossService;
//# sourceMappingURL=cointoss.service.js.map