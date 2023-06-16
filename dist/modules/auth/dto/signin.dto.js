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
exports.returnSubmitOtpForResetPasswordDto = exports.sendOTPForResetPasswordDto = exports.returnSetPasswordDto = exports.returnSubmitOtpDto = exports.returnSignUpDto = exports.returnSignInDto = exports.SetPasswordDto = exports.SubmitOtpDto = exports.SignupDto = exports.SigninDto = void 0;
const class_validator_1 = require("class-validator");
class SigninDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SigninDto.prototype, "number", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], SigninDto.prototype, "password", void 0);
exports.SigninDto = SigninDto;
class SignupDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], SignupDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignupDto.prototype, "number", void 0);
exports.SignupDto = SignupDto;
class SubmitOtpDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitOtpDto.prototype, "number", void 0);
exports.SubmitOtpDto = SubmitOtpDto;
class SetPasswordDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SetPasswordDto.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], SetPasswordDto.prototype, "password", void 0);
exports.SetPasswordDto = SetPasswordDto;
class returnSignInDto {
}
exports.returnSignInDto = returnSignInDto;
class returnSignUpDto {
}
exports.returnSignUpDto = returnSignUpDto;
class returnSubmitOtpDto {
}
exports.returnSubmitOtpDto = returnSubmitOtpDto;
class returnSetPasswordDto {
}
exports.returnSetPasswordDto = returnSetPasswordDto;
class sendOTPForResetPasswordDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], sendOTPForResetPasswordDto.prototype, "number", void 0);
exports.sendOTPForResetPasswordDto = sendOTPForResetPasswordDto;
class returnSubmitOtpForResetPasswordDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], returnSubmitOtpForResetPasswordDto.prototype, "otp", void 0);
exports.returnSubmitOtpForResetPasswordDto = returnSubmitOtpForResetPasswordDto;
//# sourceMappingURL=signin.dto.js.map