import {TokenService, UserService, authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  HttpErrors,
  getModelSchemaRef,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from "@loopback/security";
import _ from 'lodash';
import {PasswordHasherBindings, TokenServiceBidings, UserServiceBindings} from '../keys';
import {Users} from '../models';
import {Credentials, UsersRepository} from '../repositories';
import {PasswordHasher} from '../service/hash.password.bcryptjs';
import {validateCredencials} from '../service/validator';
import {UserRegisterData} from '../specs/user-controller.specs';


export class AuthController {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<Users, Credentials>,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @inject(TokenServiceBidings.TOKEN_SERVICE)
    public jwtService: TokenService
  ) { }

  @post('/users/resgister')
  @response(200, {
    description: 'Users model instance',
    content: {'application/json': {schema: getModelSchemaRef(Users)}},
  })
  async register(
    @requestBody({
      description: 'user register profile',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'username',
              'email',
              'password'
            ],
            properties: {
              username: {
                type: 'string'
              },
              fullName: {
                type: 'object'
              },
              email: {
                type: 'string'
              },
              password: {
                type: 'string'
              }
            },
          }
        }
      }
    })
    userData: UserRegisterData,
  ): Promise<Users> {

    const user = _.pick(userData, ['email', 'password'])
    validateCredencials(user);
    const newUser = {
      username: userData.username,
      fullName: userData.fullname,
      email: userData.email,
      roles: ['cliente']
    }
    const password = await this.passwordHasher.hashPassword(userData.password);
    const foundUser = await this.usersRepository.findOne({
      where: {email: user.email}
    })
    if (foundUser) {
      throw new HttpErrors.UnprocessableEntity('el usuario ya existe')
    }
    const savedUser = await this.usersRepository.create(newUser);
    await this.usersRepository.userCredentials(savedUser.id).create({password});
    return savedUser;
  }

  @post('/user/login')
  @response(200, {
    description: 'jwt user',
    content: {
      'aplication/json': {
        schema: {
          type: 'object',
          properties: {
            user: {
              type: 'object'
            },
            token: {
              type: 'string'
            }
          }
        }
      }
    }
  })
  async login(
    @requestBody({
      description: 'user login',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'email',
              'password'
            ],
            properties: {
              email: {
                type: 'string'
              },
              password: {
                type: 'string'
              }
            },
          }
        }
      }
    }) credentials: Credentials
  ): Promise<{user: Users, token: string}> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = await this.userService.convertToUserProfile(user);

    const token = await this.jwtService.generateToken(userProfile);
    return {user, token};
  }


  @authenticate('jwt')
  @authorize({allowedRoles: ['sudoAdmin']})
  @post('/admin/register')
  @response(200, {
    description: 'Users model instance',
    content: {'application/json': {schema: getModelSchemaRef(Users)}},
  })
  async registerAdmin(
    @requestBody({
      description: 'user register profile',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'username',
              'email',
              'password'
            ],
            properties: {
              username: {
                type: 'string'
              },
              fullName: {
                type: 'object'
              },
              email: {
                type: 'string'
              },
              password: {
                type: 'string'
              }
            },
          }
        }
      }
    })
    userData: UserRegisterData,
  ): Promise<Users> {

    const user = _.pick(userData, ['email', 'password'])
    validateCredencials(user);
    const newUser = {
      username: userData.username,
      fullName: userData.fullname,
      email: userData.email,
      roles: ['admin']
    }
    const password = await this.passwordHasher.hashPassword(userData.password);
    const foundUser = await this.usersRepository.findOne({
      where: {email: user.email}
    })
    if (foundUser) {
      throw new HttpErrors.UnprocessableEntity('el usuario ya existe')
    }
    const savedUser = await this.usersRepository.create(newUser);
    await this.usersRepository.userCredentials(savedUser.id).create({password});
    return savedUser;
  }
}
