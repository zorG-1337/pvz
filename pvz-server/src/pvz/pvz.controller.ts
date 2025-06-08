import { Body, Controller, Get, Post } from '@nestjs/common';
import { PvzService } from './pvz.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PVZDto } from './pvz.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';

@Controller('pvz')
export class PvzController {
  constructor(private readonly pvzService: PvzService) {}

  @Post("create-pvz")
  @Auth()
  async createPVZ(@Body() data: PVZDto) {
    return this.pvzService.createPVZ(data)
  }

  @Auth()
  @Get()
  async getAllPvz() {
    return this.pvzService.getAllPvz()
  }

  @Auth()
  @Post('get-pvz-by-id')
  async getPvzById(@Body() data: {id: string}) {
    return this.pvzService.getPvzById(data)
  }

  @Auth()
  @Post('get-my-pvz')
  async getMyPvz(@CurrentUser() data: any) {
    return this.pvzService.getMyPvz(data.id)
  }
}
