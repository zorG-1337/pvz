import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class AuthDto {
    @IsString()
    @IsEmail()
    email: string

    @IsString({
        message: 'Пароль обязателен'
    })
    @MinLength(6, {
        message: 'Пароль должен содержать не менее 6 символов'
    })

    password: string
    
    @IsString({
        message: 'Пароль обязателен'
    })
    @MinLength(6, {
        message: 'Пароль должен содержать не менее 6 символов'
    })

    @IsOptional()
    passwordRepeat?: string
}