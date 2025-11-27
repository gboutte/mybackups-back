import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../global/decorators/public.decorator';
import { StatusService } from './status.service';

@Controller('status')
@ApiTags('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  @Public()
  public async getStatus(): Promise<{ isInstalled: boolean }> {
    return {
      isInstalled: await this.statusService.isInstalled(),
    };
  }
}
