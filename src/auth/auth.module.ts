import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
import { ActiveDirectoryStrategy } from './passport/ad.strategy';
import { AuthDbService } from './auth.db.service';
import { getModuleHttp } from '../common/helper/basic-function';
import { ProfileDefaultDbService } from './profile-default.db.service';
import { QueryParserService } from '../common/helper/query-parser-service';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';

/**
 * Module for auth
 *
 * @export
 * @class AuthModule
 */
@Module({
  providers: [
    QueryParserService,
    AuthService,
    UserService,
    LocalStrategy,
    ActiveDirectoryStrategy,
    JwtStrategy,
    AuthDbService,
    ProfileDefaultDbService
  ],
  controllers: [
    AuthController
  ],
  imports: [
    PassportModule.register({ session: false }),
    getModuleHttp(),
    UserModule
  ]
})
export class AuthModule { }
