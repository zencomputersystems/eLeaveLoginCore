import { Controller, Req, Post, UseGuards, Body, Res, HttpService, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ProfileDefaultDbService } from './profile-default.db.service';
import { mergeMap } from 'rxjs/operators';

/**
 * Controller for auth
 *
 * @export
 * @class AuthController
 */
@Controller('api/auth')
export class AuthController {

  /**
   *Creates an instance of AuthController.
   * @param {AuthService} authService
   * @param {ProfileDefaultDbService} profileDefaultDbService
   * @param {HttpService} httpService
   * @memberof AuthController
   */
  constructor(
    private readonly authService: AuthService,
    private readonly profileDefaultDbService: ProfileDefaultDbService,
    private readonly httpService: HttpService
  ) { }

  /**
   * Login and verify both ad and local
   *
   * @param {LoginDto} loginDTO
   * @param {*} req
   * @param {Response} result
   * @memberof AuthController
   */
  @Post('login')
  @ApiOperation({ title: 'Login and verify', description: 'Login and verify' })
  public checkLoginType(@Body() loginDTO: LoginDto, @Req() req, @Res() result: Response) {
    let baseUrlLogin = `${req.headers.origin}${req.url}`; // 'http://zencore.zen.com.my:3000/api/auth/login/';
    let urlAD = baseUrlLogin + '/ad';
    let urlLocal = baseUrlLogin + '/local';

    this.authService.userService.findByFilterV2(['EMAIL', 'TENANT_GUID'], [`(LOGIN_ID=${loginDTO.email})`]).pipe(
      mergeMap(res => {
        return this.profileDefaultDbService.findByFilterV2([], [`(TENANT_GUID=${res[0].TENANT_GUID})`]);
      })
    ).subscribe(
      async data => {
        let url = '';
        if (data[0].LOGIN_TYPE == 'ad') {
          url = urlAD;
        }
        else if (data[0].LOGIN_TYPE == 'local') {
          url = urlLocal;
        }

        this.httpService.post(url, loginDTO).subscribe(
          data => {
            result.send(data.data);
          }, err => {
            result.send(new UnauthorizedException('Invalid Credential'));
          }
        );

      },
      err => {
        result.send(new UnauthorizedException('Invalid Credential'));
      }
    );
  }

  /**
   * AD
   *
   * @param {LoginDto} loginDTO
   * @param {*} req
   * @returns
   * @memberof AuthController
   */
  @Post('login/ad')
  @ApiOperation({ title: 'Login ad', description: 'Login ad' })
  @UseGuards(AuthGuard('ad'))
  public async ad(@Body() loginDTO: LoginDto, @Req() req) {
    return await this.authService.createToken([req.user, 'ad']);
  }


  /**
   * Local
   *
   * @param {LoginDto} loginDTO
   * @param {*} req
   * @returns
   * @memberof AuthController
   */
  @Post('login/local')
  @ApiOperation({ title: 'Login email', description: 'Login email' })
  @UseGuards(AuthGuard('local'))
  public async local(@Body() loginDTO: LoginDto, @Req() req) {
    return await this.authService.createToken([req.user, 'local']);
  }

}
