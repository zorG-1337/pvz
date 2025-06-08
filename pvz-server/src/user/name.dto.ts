import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class NameDto {
    @IsString()
    @MinLength(2, {
        message: "Минимальная длина имени должна быть больше одного"
    })

    name: string

    @IsString()
    @MinLength(2, {
        message: "Минимальная длина фамилии должна быть больше одного"
    })

    surname: string

}