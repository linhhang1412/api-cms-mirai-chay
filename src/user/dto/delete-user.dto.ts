import { ApiPropertyOptional } from '@nestjs/swagger';

export class DeleteUserDto {
  @ApiPropertyOptional({
    description: 'Thực hiện xóa vĩnh viễn thay vì xóa mềm',
    type: Boolean,
    required: false,
  })
  hard?: boolean;
}
