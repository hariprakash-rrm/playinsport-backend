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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayCoinTossDtoResult = exports.PlayCoinTossDto = void 0;
const class_validator_1 = require("class-validator");
const cointoss_schema_1 = require("../schemas/cointoss.schema");
class PlayCoinTossDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(cointoss_schema_1.CointossCategory, { message: `please enter correct number ${Object.values(cointoss_schema_1.CointossCategory)}` }),
    __metadata("design:type", Number)
], PlayCoinTossDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PlayCoinTossDto.prototype, "username", void 0);
exports.PlayCoinTossDto = PlayCoinTossDto;
class PlayCoinTossDtoResult {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PlayCoinTossDtoResult.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], PlayCoinTossDtoResult.prototype, "userWallet", void 0);
exports.PlayCoinTossDtoResult = PlayCoinTossDtoResult;
//# sourceMappingURL=cointoss.dto.js.map