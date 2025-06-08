import { IsNumber, IsString, MinLength } from "class-validator";

export class ReviewDto {
    @IsNumber()
    rating: number

    @IsString()
    @MinLength(10, {
        message: "Комментарий не должен быть короче 6-ти символов"
    })
    comment: string

    @IsString()
    pvzId: string
}