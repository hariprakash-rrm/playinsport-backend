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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./schemas/user.schema");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
const axios = require('axios');
const http = require('http');
let AuthService = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async signup(signupDto) {
        const { username, number } = signupDto;
        const hashedPassword = await bcrypt.hash('10', 1);
        const wallet = 0;
        try {
            var user = await this.userModel.create({
                username, number, password: hashedPassword, wallet
            });
            console.log(user);
        }
        catch (err) {
            if (err.code == 11000) {
                let data = Object.keys(err.keyValue);
                throw new common_1.NotAcceptableException(`${data} already taken`);
            }
            return err;
        }
        const min = 1000;
        const max = 9999;
        const otp = Math.floor(Math.random() * (max - min + 1) + min);
        user.otp = otp;
        console.log(otp);
        user.verified = 0;
        user.save();
        let num = console.log(parseInt(number));
        console.log(typeof (num));
        const postData = {
            number: number,
            message: `Otp only valid for 15sec : ${otp}`
        };
        return await this.sendOtp(postData, user);
    }
    async sendOtp(postData, user) {
        let data;
        var users = user.number;
        try {
            const response = await axios.post('http://localhost:3001/send-otp', postData).then((res) => {
                data = res;
            });
            console.log(data);
            const responseData = {
                statusCode: data.status,
                data: data.config.data,
                message: 'Otp sent '
            };
            setTimeout(async () => {
                const user = await this.userModel.findOne({ users });
                if (user.verified == 0) {
                    await this.userModel.findOneAndDelete({ users });
                }
            }, 100000);
            return responseData;
        }
        catch (err) {
            await this.userModel.findOneAndDelete({ users });
            throw new common_1.NotAcceptableException(`Something went wrong, Contact admin`);
        }
    }
    async login(singinDto) {
        const { number, password } = singinDto;
        const user = await this.userModel.findOne({ number });
        if (!user) {
            throw new common_1.UnauthorizedException('number is not valid');
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new common_1.UnauthorizedException('Password is not valid');
        }
        const token = this.jwtService.sign({ id: user._id });
        user.Atoken = token;
        user.save();
        const responseData = {
            statusCode: 201,
            token: token,
            message: 'Logged in'
        };
        return responseData;
    }
    async submitOtp(submitOtpDto) {
        const { number, otp } = submitOtpDto;
        const user = await this.userModel.findOne({ number });
        if (!user) {
            throw new common_1.UnauthorizedException('User details not found');
        }
        const isOTPmatched = otp == user.otp;
        if (!isOTPmatched) {
            throw new common_1.UnauthorizedException('OTP is not valid');
        }
        const token = this.jwtService.sign({ id: user._id });
        user.Atoken = token;
        user.verified = 1;
        user.otp = null;
        user.save();
        const responseData = {
            statusCode: 201,
            token: token,
            message: "Otp verified"
        };
        return responseData;
    }
    async setPassword(setPasswordDto, auth) {
        const { token, password } = setPasswordDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userModel.findOne({ auth });
        if (!user) {
            throw new common_1.UnauthorizedException('number is not valid');
        }
        user.password = hashedPassword;
        user.save();
        return {
            statusCode: 201,
            message: "Password Verified",
        };
    }
    async sendOTPForResetPassword(SendOTPForResetPasswordDto) {
        const { number } = SendOTPForResetPasswordDto;
        const user = await this.userModel.findOne({ number: number });
        if (!user) {
            throw new common_1.UnauthorizedException('number is not valid');
        }
        console.log(`user:    ${user}`);
        const min = 1000;
        const max = 9999;
        const otp = Math.floor(Math.random() * (max - min + 1) + min);
        user.otp = otp;
        user.save();
        const postData = {
            number: number,
            message: `Otp only valid for 1 min : ${otp}`
        };
        console.log(`postData:    ${postData}`);
        let data;
        var users = user.number;
        console.log(users);
        return await this.sendOtp(postData, user);
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map