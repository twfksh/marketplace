import { IsAlphanumeric, IsEmail, IsIn, IsNotEmpty, IsUrl, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @MinLength(4)
    @IsAlphanumeric('en-US')
    username: string;

    @IsUrl()
    img: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsIn(['admin', 'customer'])
    role: 'admin' | 'customer';
}
