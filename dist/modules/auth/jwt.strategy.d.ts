import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
declare const JwtStrategy_base: any;
export declare class JwtStrategy extends JwtStrategy_base {
    private userModel;
    constructor(userModel: Model<User>);
    validate(payload: any): unknown;
}
export {};
