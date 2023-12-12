import {TokenService} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';

import {promisify} from 'util';
import {TokenServiceBidings} from '../keys';


const jwt = require('jsonwebtoken')
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);


export class JWTService implements TokenService {
  constructor(
    @inject(TokenServiceBidings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBidings.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,

  ) { }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error: Sesion invalida`,
      )
    }

    let userProfile: UserProfile;

    try {
      const decodedToken = await verifyAsync(token, this.jwtSecret)

      userProfile = Object.assign(
        {[securityId]: '', email: ''},
        {
          [securityId]: decodedToken.id,
          email: decodedToken.email,
          id: decodedToken.id,
          roles: decodedToken.roles,
        }
      );
    } catch (err) {
      throw new HttpErrors.Unauthorized(
        'Sesion finalizada'
      )
    }
    return userProfile
  }
  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error al iniciar sesion'
      )
    }

    const userInfoForToken = {
      id: userProfile[securityId],
      email: userProfile.email,
      roles: userProfile.roles,
    };

    let token: string;
    try {
      token = await signAsync(userInfoForToken, this.jwtSecret, {
        expiresIn: Number(this.jwtExpiresIn),
      })
    } catch (err) {
      throw new HttpErrors.Unauthorized('Error al iniciar sesion')
    }

    return token;

  }

}
