
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ name: 'email', enum: ['tarmimi@zen.com.my'] })
  @IsNotEmpty()
  readonly email: string;

  /**
   * Data login - password
   * description: 'Password for email account',
   *
   * @type {string}
   * @memberof LoginDto
   */
  @ApiProperty({ name: 'password', enum: ['P@ss1234'] })
  @IsNotEmpty()
  readonly password: string;

}
