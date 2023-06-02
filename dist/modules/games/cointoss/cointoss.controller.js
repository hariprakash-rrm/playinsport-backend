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
exports.CointossController = void 0;
const common_1 = require("@nestjs/common");
const cointoss_dto_1 = require("./dto/cointoss.dto");
const cointoss_service_1 = require("./cointoss.service");
let CointossController = class CointossController {
    constructor(cointossService) {
        this.cointossService = cointossService;
    }
    play(cointossdto, authToken) {
        console.log(authToken);
        return this.cointossService.play(cointossdto, authToken);
    }
};
__decorate([
    (0, common_1.Post)('/play'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('Authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cointoss_dto_1.PlayCoinTossDto, String]),
    __metadata("design:returntype", void 0)
], CointossController.prototype, "play", null);
CointossController = __decorate([
    (0, common_1.Controller)(''),
    __metadata("design:paramtypes", [cointoss_service_1.CointossService])
], CointossController);
exports.CointossController = CointossController;
//# sourceMappingURL=cointoss.controller.js.map