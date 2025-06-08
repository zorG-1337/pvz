import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { NameDto } from './name.dto';
import { CreateUserBySuperAdminDto } from './cubsa.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get('profile')
  async getProfile(@CurrentUser('id') id: string) {
    return this.userService.getById(id)
  }

  @Auth()
  @Post("changeNameAndSurname")
  async changeNameAndSurname(@CurrentUser('id') id: string, @Body() dto: NameDto) {
    return this.userService.changeNameAndSurname(dto, id)
  }

  @Auth()
  @Post("CreateUserBySuperAdmin")
  async CreateUserBySuperAdminDto(@Body() data: CreateUserBySuperAdminDto) {
    return this.userService.createUserBySuperAdmin(data)
  }

  @Auth()
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers()
  }

  @Post("/:id")
  @Auth()
  async getUserById(@Param("id") id: string) {
    return this.userService.getById(id)
  }
}
