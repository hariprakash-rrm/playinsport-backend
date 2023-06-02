import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name)
    private userModel: Model<User>,
        private jwtService: JwtService) { }


    async signup(signupDto: SignupDto): Promise<{ token: string }> {
        const { name, username, number, password } = signupDto

        const hashedPassword = await bcrypt.hash(password, 10)
        const wallet = 0
        const user = await this.userModel.create({
            name, username, number, password: hashedPassword, wallet
        })

        const token = this.jwtService.sign({ id: user._id })
      
        return { token }
    }

    async login(singinDto: SigninDto): Promise<{ token }> {
        const { number, password } = singinDto

        const user = await this.userModel.findOne({ number })
        if (!user) {
            throw new UnauthorizedException('number is not valid')
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {
            throw new UnauthorizedException('Password is not valid')
        }
        const token = this.jwtService.sign({ id: user._id })
        user.Atoken= token
        user.save()

        

        return { token }

    }
}
