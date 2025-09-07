import { ApiProperty } from '@nestjs/swagger';

export class CloseOutDayDto {
  @ApiProperty({ description: 'Ngày cần chốt (YYYY-MM-DD)', type: String })
  date!: string;
}

