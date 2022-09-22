import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Inquiry } from 'prisma/postgresClient';
import { GetCurrentUserId } from 'src/common/decorators';
import { CommonResponseDto } from 'src/common/dto';
import { AccessGuard } from 'src/common/guards';
import { prefixConstant } from 'src/utils/prefix.constant';
import {
  DeleteUserResponse,
  GetMypageResponse,
  GetMypageResponseDto,
  GetPresignedUrlResponse,
  GetPresignedUrlResponseDto,
  SendInquiryDto,
  SendInquiryResponse,
  UpdateUserDto,
} from './dto';
import { UsersService } from './users.service';

@ApiTags('Users API')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(`${prefixConstant}/users`);
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(200)
  @Get('mypage')
  @UseGuards(AccessGuard)
  @ApiOperation({
    summary: '마이페이지 조회 API',
    description: '마이페이지에서 필요한 북마크(약, 약국) 등 정보를 조회한다',
  })
  @ApiResponse({
    status: 200,
    description: '마이페이지 조회 성공',
    type: GetMypageResponseDto,
  })
  @ApiCookieAuth('accessToken')
  @ApiCookieAuth('refreshToken')
  async getMypage(
    @GetCurrentUserId() id: string,
  ): Promise<GetMypageResponseDto> {
    const user: GetMypageResponse = await this.usersService.getMypage(id);
    this.logger.log(`GET /mypage Success!`);
    return {
      statusCode: 200,
      message: '마이페이지 조회를 성공했습니다.',
      result: { user },
    };
  }

  @HttpCode(200)
  @Get('presigned-url')
  @UseGuards(AccessGuard)
  @ApiOperation({
    summary: 'Presigned Url 발급 API',
    description: '외부 스토리지 GCS에서 presigned url 발급한다.',
  })
  @ApiResponse({
    status: 200,
    description: 'Presigned Url 발급 성공',
    type: GetPresignedUrlResponseDto,
  })
  @ApiCookieAuth('accessToken')
  @ApiCookieAuth('refreshToken')
  async getPresignedUrl(
    @GetCurrentUserId() id: string,
  ): Promise<GetPresignedUrlResponseDto> {
    const { url, fileName }: GetPresignedUrlResponse =
      await this.usersService.getPresignedUrl(id);
    this.logger.log(`GET /presigned-url Success!`);
    return {
      statusCode: 200,
      message: 'presigned url를 발급했습니다.',
      result: { url, fileName },
    };
  }

  @HttpCode(200)
  @Patch('profile-img')
  @UseGuards(AccessGuard)
  @ApiOperation({
    summary: '프로필 이미지 수정 API',
    description: '프로필 이미지를 수정한다.',
  })
  @ApiResponse({
    status: 200,
    description: '프로필 이미지 수정 성공',
    type: CommonResponseDto,
  })
  @ApiQuery({
    name: 'img',
    required: true,
    description: '유저 프로필 이미지',
  })
  @ApiCookieAuth('accessToken')
  @ApiCookieAuth('refreshToken')
  async saveProfileImg(
    @GetCurrentUserId() id: string,
    @Query('img') img: string,
  ) {
    await this.usersService.saveImg(id, img);
    return {
      statusCode: 200,
      message: '프로필 이미지를 수정했습니다.',
    };
  }

  @HttpCode(200)
  @Patch('update')
  @UseGuards(AccessGuard)
  @ApiOperation({
    summary: '회원 정보 수정 API',
    description: '회원 정보를 수정 한다.',
  })
  @ApiResponse({
    status: 200,
    description: '회원 정보 수정 성공',
    type: CommonResponseDto,
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiCookieAuth('accessToken')
  @ApiCookieAuth('refreshToken')
  async UpdateUser(
    @GetCurrentUserId() id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<CommonResponseDto> {
    await this.usersService.updateUser(id, updateUserDto);
    this.logger.verbose(`User ${id} update Success!`);
    return {
      statusCode: 200,
      message: '회원 정보가 수정되었습니다.',
    };
  }

  @HttpCode(200)
  @Patch('delete')
  @UseGuards(AccessGuard)
  @ApiOperation({
    summary: '회원탈퇴 API',
    description: '유저를 삭제 한다.',
  })
  @ApiResponse({
    status: 200,
    description: '회원탈퇴 성공',
    type: DeleteUserResponse,
  })
  @ApiCookieAuth('accessToken')
  @ApiCookieAuth('refreshToken')
  async deleteUser(
    @GetCurrentUserId() id: string,
  ): Promise<DeleteUserResponse> {
    await this.usersService.deleteUser(id);
    this.logger.verbose(`User ${id} delete Success!`);
    return {
      statusCode: 200,
      message: '회원탈퇴가 완료되었습니다.',
      result: { result: true },
    };
  }

  @HttpCode(200)
  @Post('inquiry')
  @UseGuards(AccessGuard)
  @ApiOperation({
    summary: '고객센터 API',
    description: '고객이 문의한 내용을 DB로 저장 한다(관리자 페이지)',
  })
  @ApiCookieAuth('accessToken')
  @ApiCookieAuth('refreshToken')
  async sendInquiry(
    @GetCurrentUserId() id: string,
    @Body() sendInquiryDto: SendInquiryDto,
  ): Promise<SendInquiryResponse> {
    const inquiry: Inquiry = await this.usersService.sendInquiry(
      id,
      sendInquiryDto,
    );
    this.logger.verbose(`User send inquiry Success!`);
    return {
      statusCode: 200,
      message: '문의를 성공적으로 전송했습니다.',
      result: { inquiry },
    };
  }
}
