import { Injectable } from '@nestjs/common';
import { UserDbService } from '../common/db/table.db.service';

/**
 * Service for user
 *
 * @export
 * @class UserService
 * @extends {BaseDBService}
 */
@Injectable()
export class UserService {

  /**
   * Declare tablename user main
   *
   * @private
   * @memberof UserService
   */
  private table_name = 'user_main';
  constructor(
    public readonly userDbService: UserDbService) { }

  /**
   * Find single user
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<any>}
   * @memberof UserService
   */
  public async findOne(email: string, password: string): Promise<any> {
    const fields = ['USER_GUID', 'EMAIL', 'TENANT_GUID', 'PASSWORD'];
    //const filters = ['(EMAIL='+email+')','(PASSWORD='+CryptoJS.SHA256(password.trim()).toString(CryptoJS.enc.Hex)+')'];
    const filters = ['(EMAIL=' + email + ')', '(DELETED_AT IS NULL)', '(ACTIVATION_FLAG=1)'];

    // console.log(filters);

    const url = this.userDbService.queryService.generateDbQuery(this.table_name, fields, filters);

    //call DF to validate the user
    return this.userDbService.httpService.get(url).toPromise();

  }

  /**
   * FindOne user ByPayload
   *
   * @param {*} payload
   * @returns {Promise<any>}
   * @memberof UserService
   */
  public async findOneByPayload(payload): Promise<any> {
    const fields = ['USER_GUID', 'EMAIL', 'TENANT_GUID'];
    const filters = ['(EMAIL=' + payload.email + ')', '(TENANT_GUID=' + payload.tenantId + ')']

    const url = this.userDbService.queryService.generateDbQuery(this.table_name, fields, filters);

    //call DF to validate the user
    return this.userDbService.httpService.get(url).toPromise();
  }

}
