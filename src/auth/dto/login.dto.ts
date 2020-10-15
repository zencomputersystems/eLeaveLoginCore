
import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
/**
 * Data for login
 *
 * @export
 * @class LoginDto
 */
export class LoginDto {
  /**
   * Data login - email
   *, description: 'Email id account'
   * 
   * @type {string}
   * @memberof LoginDto
   */
  @ApiModelProperty({
    description: 'Email id account', example: 'kenna.ratke35@ethereal.email'//'tarmimi@zen.com.my' 
  })
  @IsNotEmpty()
  readonly email: string;

  /**
   * Data login - password
   * description: 'Password for email account',
   *
   * @type {string}
   * @memberof LoginDto
   */
  @ApiModelProperty({
    description: 'Password for email account', example: 'MTIzNDU2'//'UEBzczEyMzQ=' 
  })
  @IsNotEmpty()
  password: string;

}
