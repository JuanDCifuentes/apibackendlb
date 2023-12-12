import {AuthenticationComponent, registerAuthenticationStrategy} from "@loopback/authentication";
import {AuthorizationBindings, AuthorizationComponent, AuthorizationDecision, AuthorizationOptions, AuthorizationTags} from "@loopback/authorization";

import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {PasswordHasherBindings, TokenServiceBidings, TokenServiceconstants, UserServiceBindings} from './keys';
import {MyAuthorizationProvider} from './provider/MyAuthorizationProvider';
import {MySequence} from './sequence';
import {BcryptHasher} from './service/hash.password.bcryptjs';
import {JWTService} from './service/jwt-services';
import {MyUserService} from './service/user-service';
import {JWTAuthenticationStrategy} from './strategys/jwt-strategy';


export {ApplicationConfig};

export class ApibackendlbApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    const authoptions: AuthorizationOptions = {
      precedence: AuthorizationDecision.DENY,
      defaultDecision: AuthorizationDecision.DENY
    }

    this.configure(AuthorizationBindings.COMPONENT).to(authoptions);
    this.component(AuthorizationComponent);

    this.component(AuthenticationComponent);

    this.setUpBindings();
    // Set up the custom sequence
    this.sequence(MySequence);

    registerAuthenticationStrategy(this as any, JWTAuthenticationStrategy);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

  }

  setUpBindings(): void {
    this.bind('Provider.MyAuthorizationProvider')
      .toProvider(MyAuthorizationProvider)
      .tag(AuthorizationTags.AUTHORIZER);

    this.bind(TokenServiceBidings.TOKEN_SECRET).to(
      TokenServiceconstants.TOKEN_SECRET_VALUE,
    );

    this.bind(TokenServiceBidings.TOKEN_EXPIRES_IN).to(
      TokenServiceconstants.TOKEN_EXPIRES_IN_VALUE,
    )
    this.bind(TokenServiceBidings.TOKEN_SERVICE).toClass(JWTService);

    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService)

  }
}
