import { IsNumber, IsString } from "class-validator"

export class PVZDto {
    @IsString()
    name: string

    @IsString()
    address: string
    
    @IsString()
    descriptions: string

    @IsNumber()
    latitude: number

    @IsNumber()
    logitude: number

    @IsString() 
    adminUserId: string
}