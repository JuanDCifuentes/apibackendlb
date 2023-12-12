import {AuthenticationStrategy, TokenService} from '@loopback/authentication';
import {bind, inject} from '@loopback/context';
import {
  OASEnhancer,
  OpenAPIObject,
  asSpecEnhancer,
  mergeSecuritySchemeToSpec
} from '@loopback/openapi-v3';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {TokenServiceBidings} from '../keys';
'@loopback/authentication';

@bind(asSpecEnhancer)
export class JWTAuthenticationStrategy implements AuthenticationStrategy, OASEnhancer {
  name = 'jwt'

  constructor(
    @inject(TokenServiceBidings.TOKEN_SERVICE)
    public tokenService: TokenService,
  ) { }

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token: string = this.extractCredentials(request);
    const userProfi1e: UserProfile = await this.tokenService.verifyToken(token);
    return userProfi1e;
  }

  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('Authorization header not found.');
    }

    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized('Authorization header is not of type \'Bearer\'.');
    }

    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized(
        'Authorization header value has too many parts. it must follow the pattern: \'Bearer xx.yy.zz is a valid JWT token\''
      )
    }

    const token = parts[1];

    return token;
  }

  modifySpec(spec: OpenAPIObject): OpenAPIObject {
    return mergeSecuritySchemeToSpec(spec, this.name, {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    })

  }
}
