import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { UserprofileDbService, AuthDbService } from '../common/db/table.db.service';

/**
 * Service for auth
 *
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {
  /**
   *Creates an instance of AuthService.
   * @param {UserService} userService User service to find user
   * @param {AuthDbService} authDbService auth db service to get login type
   * @memberof AuthService
   */
  constructor(
    public readonly userService: UserService,
    private readonly authDbService: AuthDbService,
    public readonly userprofileDbService: UserprofileDbService
  ) { }

  /**
   * Method auth
   *
   * @param {string} email
   * @returns
   * @memberof AuthService
   */
  public authMethod(email: string) {
    return {
      url: process.env.LDAP_URL,
      baseDN: process.env.LDAP_BASE_DN,
      username: process.env.LDAP_USERNAME,
      password: process.env.LDAP_PASSWORD
    }
  }

  /**
   * log the user using provided user password
   *
   * @param {*} email
   * @param {*} password
   * @returns
   * @memberof AuthService
   */
  public async logIn(email, password) {
    /** 
     * The atob already done from the login. so we have plain password here. 
     * we need to verify as cryptojs.sha256. right now db encryption is if form of cryptojs.aes of cryptojs.sha256 with a key */

    return await this.userService.findOne(email, password)
      .then(async user => {
        // encrypt plain password to sha256
        var CryptoJS = require("crypto-js");
        password = CryptoJS.SHA256(password.trim()).toString(CryptoJS.enc.Hex);
        // const result = user.data.resource.length > 0 ? Promise.resolve(user.data.resource[0]) : Promise.reject(new UnauthorizedException('Invalid Credential'))
        let result;
        if (user.data.resource.length > 0) {
          // decrypt aes to form as sha256
          const dbPass = CryptoJS.AES.decrypt(user.data.resource[0].PASSWORD, 'secret key 122').toString(CryptoJS.enc.Utf8);
          result = dbPass === password ? Promise.resolve(user.data.resource[0]) : Promise.reject(new UnauthorizedException('Invalid Credential'));
        } else {
          result = Promise.reject(new UnauthorizedException('Invalid Credential'))
        }

        return result;
      })
  }

  /**
   * Method ad login
   *
   * @param {*} data
   * @returns
   * @memberof AuthService
   */
  public async adLogin(data) {
    // console.log(data);
    return await this.userService.userDbService.findByFilterV2([], ['(LOGIN_ID=' + data._json.userPrincipalName + ')', '(DELETED_AT IS NULL)', '(ACTIVATION_FLAG=1)']).toPromise()
      // .then(async user => {
      //   console.log(user);
      //   let subsId = await this.userprofileDbService.findByFilterV2(['SUBSCRIPTION_GUID'], ['(USER_GUID=' + user[0].USER_GUID + ')']).toPromise();
      //   console.log(subsId);
      //   return { user, subsId };
      // })
      // .then(async sub => {
      //   let { user, subsId } = sub;
      //   let statusTenant = await this.authDbService.findByFilterV2([], ['(CUSTOMER_GUID=' + user[0].TENANT_GUID + ')', '(SUBSCRIPTION_GUID=' + subsId[0].SUBSCRIPTION_GUID + ')']).toPromise();
      //   return { user, statusTenant };
      // })
      // .then(async user => {
      //   let statusTenant = await this.authDbService.findByFilterV2([], ['(SUBSCRIPTION_GUID=' + user[0].TENANT_GUID + ')']).toPromise();
      //   return { user, statusTenant };
      // })
      .then(async user => {
        // .then(async result => {
        //   let { user, statusTenant } = result;
        //   if (statusTenant[0].STATUS == 1) {
        return (user.length > 0)
          ? Promise.resolve(user[0])
          : Promise.reject(new UnauthorizedException('Invalid Credential'))
        // }
        // else {
        //   return Promise.reject(new UnauthorizedException('Inactive Subscription'))
        // }
      })
  }

  //create JWT token to be sent to client
  /**
   * Method create token
   *
   * @param {*} signedUser
   * @returns
   * @memberof AuthService
   */
  public async createToken([signedUser, typeLogin, roleUser]) {
    // 3300(55m) 28800(8h) 600(10m)
    // 32400(9h) 46800(13h)
    const expiresIn = 46800, secretOrKey = 'this_is_secret';
    const user = {
      email: signedUser.EMAIL,
      userId: signedUser.USER_GUID,
      tenantId: signedUser.TENANT_GUID
    };

    return {
      expires_in: expiresIn,
      login_type: typeLogin,
      admin_profile: roleUser,
      access_token: await sign(user, secretOrKey, { expiresIn })
    }
  }

  //verify the JWT token data
  /**
   * Method verify
   *
   * @param {*} payload
   * @returns
   * @memberof AuthService
   */
  public async verify(payload) {
    return await this.userService.findOneByPayload(payload)
      .then(async user => {
        let subsId = await this.userprofileDbService.findByFilterV2(['SUBSCRIPTION_GUID'], ['(USER_GUID=' + user.data.resource[0].USER_GUID + ')']).toPromise();
        return { user, subsId };
      })
      .then(async sub => {
        let { user, subsId } = sub;
        let statusTenant = await this.authDbService.findByFilterV2([], ['(CUSTOMER_GUID=' + user.data.resource[0].TENANT_GUID + ')', '(SUBSCRIPTION_GUID=' + subsId[0].SUBSCRIPTION_GUID + ')']).toPromise();
        return { user, statusTenant };
      })
      .then(async result => {
        let { user, statusTenant } = result;
        if (statusTenant[0].STATUS == 1) {
          return (user.data.resource.length > 0)
            ? Promise.resolve(user.data.resource[0])
            : Promise.reject(new UnauthorizedException('Invalid Authorization'))
        }
        else {
          return Promise.reject(new UnauthorizedException('Inactive Subscription'))
        }

      })

  }
}
