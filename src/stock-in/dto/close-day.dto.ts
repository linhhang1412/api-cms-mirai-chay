import { ApiProperty } from '@nestjs/swagger';

export class CloseDayDto {
  @ApiProperty({ description: 'Ngày cần chốt (YYYY-MM-DD)', type: String })
  date!: string;
}

