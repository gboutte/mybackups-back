import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StatusService } from './status.service';
import { Public } from '../global/decorators/public.decorator';

@Controller('status')
@ApiTags('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  @Public()
  async getStatus() {
    return {
      isInstalled: await this.statusService.isInstalled(),
    };
  }
}
