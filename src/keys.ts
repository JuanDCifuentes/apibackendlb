import {TokenService, UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/context';
import {PasswordHasher} from './service/hash.password.bcryptjs';

import {Users} from './models';
import {Credentials} from './repositories';

export namespace TokenServiceconstants {

  export const TOKEN_SECRET_VALUE = 'lucioPuedeSerLaClave';
  export const TOKEN_EXPIRES_IN_VALUE = '600';

}

export namespace TokenServiceBidings {

  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  )
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  )
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'authentication.jwt.tokenservice',
  )

}

export namespace UserServiceBindings {

  export const USER_SERVICE = BindingKey.create<UserService<Users, Credentials>>(
    'services.user.service',
  )
}
export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'service.hasher'
  );
  export const ROUNDS = BindingKey.create<number>('service.hasher.round');
}
