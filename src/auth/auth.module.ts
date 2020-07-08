import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
import { ActiveDirectoryStrategy } from './passport/ad.strategy';
import { getModuleHttp } from '../common/helper/basic-function';
import { QueryParserService } from '../common/helper/query-parser-service';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { ProfileDefaultDbService, AuthDbService, UserprofileDbService, UserDbService } from '../common/db/table.db.service';
import { RoleService } from '../auth/role.service';
import { RoleDbService } from '../common/db/table.db.service';

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
    ProfileDefaultDbService,
    UserprofileDbService,
    UserDbService,
    RoleService,
    RoleDbService
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
