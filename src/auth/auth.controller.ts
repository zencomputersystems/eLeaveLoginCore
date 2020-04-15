import { Controller, Req, Post, UseGuards, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiBearerAuth, ApiOAuth2 } from '@nestjs/swagger';
// import { map, mergeMap } from 'rxjs/operators';
import { Response } from 'express';
import { ProfileDefaultDbService } from './profile-default.db.service';

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
   * @memberof AuthController
   */
  constructor(
    private readonly authService: AuthService,
    private readonly profileDefaultDbService: ProfileDefaultDbService
  ) { }

  /**
   * Login api
   *
   * @param {LoginDto} loginDTO
   * @param {*} req
   * @returns
   * @memberof AuthController
   */
  @Post('login')
  @ApiOperation({ description: 'Login' })
  @UseGuards(AuthGuard('ad'))
  public async login(@Body() loginDTO: LoginDto, @Req() req) {
    console.log(req.user);
    return await this.authService.createToken([req.user, 'ad']);
    //return this.ad(loginDTO,req);
  }

  /**
   * ad
   *
   * @param {LoginDto} loginDTO
   * @param {*} req
   * @returns
   * @memberof AuthController
   */
  @Post('login/ad')
  @ApiOperation({ description: 'Login ad' })
  @UseGuards(AuthGuard('ad'))
  public async ad(@Body() loginDTO: LoginDto, @Req() req) {
    console.log('ad');
    console.log(loginDTO);
    console.log(req.user);
    return await this.authService.createToken([req.user, 'ad']);
  }

  /**
   * local
   *
   * @param {LoginDto} loginDTO
   * @param {*} req
   * @returns
   * @memberof AuthController
   */
  @Post('login/email')
  @ApiOperation({ description: 'Login email' })
  @UseGuards(AuthGuard('local'))
  public async local(@Body() loginDTO: LoginDto, @Req() req) {

    return await this.authService.createToken([req.user, 'local']);
  }


  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  // @ApiOAuth2(['pets:write'])
  @Post('login/verify')
  @ApiOperation({ description: 'Login and verify' })
  // @UseGuards(AuthGuard('ad'))
  public async checkLoginType(@Body() loginDTO: LoginDto, @Req() req, @Res() result: Response) {
    result.send(loginDTO);
    // return await result.redirect(this.ad(loginDTO, req1).toString());
    // try {
    //   this.authService.userService.findByFilterV2(['EMAIL', 'TENANT_GUID'], [`(LOGIN_ID=${loginDTO.email})`]).pipe(map(res => {
    //     return this.profileDefaultDbService.findByFilterV2([], [`(TENANT_GUID=${res[0].TENANT_GUID})`]);
    //   }), mergeMap(res => {
    //     return res;
    //   }), map(async res => {
    //     if (res[0].LOGIN_TYPE == 'ad') {
    //       return this.ad(loginDTO, req);
    //     }
    //     else if (res[0].LOGIN_TYPE == 'local') {
    //       return this.local(loginDTO, req);
    //     }
    //   })).subscribe(
    //     async data => { console.log(await data); },
    //     err => { console.log(err); }
    //   );

    // } catch (error) {
    //   result.send(error);
    // }
  }
}
