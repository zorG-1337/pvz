import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { Response } from 'express';
import { NotFoundError } from 'rxjs';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from 'src/user/auth.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    EXPIRE_DAY_REFRESH_TOKEN = 1
    REFRESH_TOKEN_NAME = 'refreshToken'

    constructor(private jwt: JwtService, private userService: UserService, private prismaService: PrismaService, private configService: ConfigService) {

    }

    async login(dto: AuthDto) {
        const user = await this.validateUser(dto)

        const isPasswordValid = await verify(user.password, dto.password)

        if (!isPasswordValid) {
            throw new BadRequestException('Неверный пароль')
        }

        const tokens = this.issueTokens(user.id)

        return {user, ...tokens}
    }

    async register(dto: AuthDto) {
        const oldUser = await this.userService.getByEmail(dto.email)

        if(oldUser) throw new BadRequestException('Пользователь уже сущесствует')

        if(dto.password !== dto.passwordRepeat) {
            throw new BadRequestException("Пароли не совпадают")
        }

        const user = await this.userService.createUser(dto)

        const tokens = this.issueTokens(user.id)

        return {user, ...tokens}
    }

    async getNewTokens(refreshToken: string) {
        const result = await this.jwt.verifyAsync(refreshToken)

        if(!result) {
            throw new UnauthorizedException("Невалидный рефреш-токен")
        }

        const user = await this.userService.getById(result.id)

        const tokens = this.issueTokens(user.id)

        return {user, ...tokens}
    }

    issueTokens(userId: string) {
        const data = { id: userId }

        const accessToken = this.jwt.sign(data, {
            expiresIn: '1h'
        })

        const refreshToken = this.jwt.sign(data, {
            expiresIn: '7d'
        })

        return {accessToken, refreshToken}
    }

    private async validateUser(dto: AuthDto) {
        const user = await this.userService.getByEmail(dto.email)

        if(!user) {
            throw new NotFoundException('Пользователь не найден')
        }

        return user
    }

    addRefreshTokenToResponse(res: Response, refreshToken: string) {
        const expiresIn = new Date()

        expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

        res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
            httpOnly: false,
            domain: this.configService.get('SERVER_DOMAIN'),
            expires: expiresIn,
            secure: true,
            sameSite: 'none'
        })
    }

    removeRefreshTokenFromResponse(res: Response) {

        res.cookie(this.REFRESH_TOKEN_NAME, "",  {
            httpOnly: false,
            domain: this.configService.get('SERVER_DOMAIN'),
            expires: new Date(0),
            secure: true,
            sameSite: 'none'
        })
    }
}
