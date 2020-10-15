import { Controller, Req, Post, UseGuards, Body, Param, Res, UnauthorizedException, HttpService, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { ApiOperation } from '@nestjs/swagger';
import { map, mergeMap } from 'rxjs/operators';
import { Response } from 'express';
import { of } from 'rxjs';
import { ProfileDefaultDbService } from '../common/db/table.db.service';
import { RoleService } from './role.service';
import { runServiceCallback } from '../common/helper/basic-function';
/** atob decryption */
var atob = require('atob');
/** dot env library */
const dotenv = require('dotenv');
dotenv.config();

/** XMLparser from zen library  */
var { convertXMLToJson } = require('@zencloudservices/xmlparser');


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
    private readonly profileDefaultDbService: ProfileDefaultDbService,
    private readonly roleService: RoleService
  ) { }

  /**
   * Login for ad and local merged
   *
   * @param {LoginDto} loginDTO
   * @param {*} req
   * @param {Response} result
   * @memberof AuthController
   */
  @Post('login')
  @ApiOperation({ title: 'Login and verify' })
  public checkLoginType(@Body() loginDTO: LoginDto, @Req() req, @Res() result: Response) {
    loginDTO.password = atob(loginDTO.password);

    let baseUrlLogin = process.env.URL_API + '/api/auth/login/';
    // let baseUrlLogin = 'http://localhost:3000/api/auth/login/';
    let urlAD = baseUrlLogin + 'ad';
    let urlLocal = baseUrlLogin + 'email';
    // console.log(urlAD + '-' + urlLocal);
    // console.log(loginDTO.email + '-' + loginDTO.password);

    this.authService.userService.userDbService.findByFilterV2(['EMAIL', 'TENANT_GUID'], [`(LOGIN_ID=${loginDTO.email})`, `(DELETED_AT IS NULL)`]).pipe(
      mergeMap(res => {
        return this.profileDefaultDbService.findByFilterV2([], [`(TENANT_GUID=${res[0].TENANT_GUID})`]);
        // return this.authDbService.findByFilterV2([], [`(SUBSCRIPTION_GUID=${res[0].TENANT_GUID})`]);
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

        this.profileDefaultDbService.httpService.post(url, loginDTO).subscribe(
          data => {
            // console.log(data.data);
            result.send(data.data);
          }, err => {
            console.log(err);
            result.status(HttpStatus.UNAUTHORIZED).send(new UnauthorizedException('Invalid Credential'));
          }
        );

      },
      err => {
        result.status(HttpStatus.UNAUTHORIZED).send(new UnauthorizedException('Invalid Credential'));
      }
    );
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
  @ApiOperation({ title: 'Login ad' })
  @UseGuards(AuthGuard('ad'))
  public async ad(@Body() loginDTO: LoginDto, @Req() req) {
    let temp = await this.getRole([req.user]);
    return await this.authService.createToken([req.user, 'ad', temp]);
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
  @ApiOperation({ title: 'Login email' })
  @UseGuards(AuthGuard('local'))
  public async local(@Body() loginDTO: LoginDto, @Req() req) {
    let temp = await this.getRole([req.user]);
    return await this.authService.createToken([req.user, 'local', temp]);
  }

  public async getRole([user]: [any]) {
    let roleProcess = this.authService.userprofileDbService.findByFilterV2(['ROLE_GUID'], [`(USER_GUID=${user.USER_GUID})`]).pipe(
      mergeMap(res => {
        if (res[0].ROLE_GUID != null && res[0].ROLE_GUID != '') {
          return this.roleService.findAll(res[0].ROLE_GUID).pipe(
            map(res => {
              let details = convertXMLToJson(res[0].PROPERTIES_XML);
              return details.property.allowProfileManagement.allowProfileAdmin;
            })
          );
        } else {
          return of({ value: false, level: '' });
        }
      })
    );

    let data = await runServiceCallback(roleProcess);

    return data;
  }

}
