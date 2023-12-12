import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {PasswordHasherBindings} from '../keys';
import {Users} from '../models';
import {Credentials, UsersRepository} from '../repositories/users.repository';
import {PasswordHasher} from './hash.password.bcryptjs';
import {validateCredencials} from './validator';

export class MyUserService implements UserService<Users, Credentials> {
  constructor(
    @repository(UsersRepository) public userRepository: UsersRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER) public passwordHasher: PasswordHasher,
  ) { }

  async verifyCredentials(credentials: Credentials): Promise<Users> {
    const invalidCredentialsError = 'Email o contraseña invalidas';
    validateCredencials(credentials);

    const foundUser = await this.userRepository.findOne({
      fields: {
        id: true,
        email: true,
        roles: true
      },
      where: {email: credentials.email}
    });

    if (!foundUser) {
      throw new HttpErrors.NotFound(
        `Usuario con email ${credentials.email} no encontrado`
      );
    }

    const credentialsFound = await this.userRepository.findCredencials(
      foundUser.id
    )

    if (!credentialsFound) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const passwordMatched = await this.passwordHasher.comparePassword(
      credentials.password,
      credentialsFound.password
    )

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('Kas credenciales no son correctas')
    }

    return foundUser;

  }

  convertToUserProfile(user: Users): UserProfile {
    return {
      [securityId]: String(user.id),
      email: user.email,
      roles: user.roles
    }
  }
}
