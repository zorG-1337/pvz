import { UserStatus } from "@prisma/client";
import { IsEmail, IsString } from "class-validator";

export class CreateUserBySuperAdminDto {
    @IsEmail()
    @IsString()
    email: string

    @IsString()
    name: string

    @IsString()
    surname: string

    @IsString()
    status: UserStatus

    @IsString()
    password: string

    @IsString()
    confirmPassword: string
}