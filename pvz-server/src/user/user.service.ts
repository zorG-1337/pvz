import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {hash} from 'argon2'
import { AuthDto } from './auth.dto';
import { NameDto } from './name.dto';
import { CreateUserBySuperAdminDto } from './cubsa.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id
            }
        })

        return user
    }

    async getByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        })

        return user
    }

    async createUser(dto: AuthDto) {
        return this.prisma.user.create({
            data: {
                email: dto.email,
                password: await hash(dto.password)
            }
        })
    }

    async changeNameAndSurname(dto: NameDto, id: string) {

        if(dto.name.length < 2) {
            throw new BadRequestException("Имя должно быть длиннее двух символов")
        }

        if(dto.surname.length < 2) {
            throw new BadRequestException("Фамилия должна быть длиннее двух символов")
        }

        const user = await this.prisma.user.update({
            where: {
                id: id
            },
            data: {
                name: dto.name,
                surname: dto.surname
            }
        })

        return user
    }

    async createUserBySuperAdmin(data: CreateUserBySuperAdminDto) {
        const passwordAreEqual = data.confirmPassword === data.password

        if(!passwordAreEqual) {
            throw new BadRequestException("Пароли не совпадают")
        }

        const user = await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                surname: data.surname,
                password: await hash(data.password),
                status: data.status
            }
        })

        return user
    }

    async getAllUsers() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                surname: true,
                status: true
            }
        })

        return users
    }
}
