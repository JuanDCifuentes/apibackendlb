import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer} from '@loopback/authorization';
import {Provider} from '@loopback/core';
import {UserProfile, securityId} from '@loopback/security';
import _ from 'lodash';

export class MyAuthorizationProvider implements Provider<Authorizer>{
  constructor() { }

  /**
   *
   * @returns authenticateFn
   */
  value(): Authorizer {
    return this.authorize.bind(this)
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ) {
    let currentUser: UserProfile;



    if (authorizationCtx.principals.length > 0) {

      const user = _.pick(authorizationCtx.principals[0], [
        'id',
        'email',
        'roles'
      ]);
      currentUser = {[securityId]: user.id, email: user.email, roles: user.roles}
    } else {
      return AuthorizationDecision.DENY
    }

    if (!currentUser.roles) {
      return AuthorizationDecision.DENY
    }

    if (!metadata.allowedRoles) {
      return AuthorizationDecision.ALLOW
    }

    let roleIsAllowed = false;
    for (const role of currentUser.roles) {
      if (metadata.allowedRoles!.includes(role)) {
        roleIsAllowed = true;
        break;
      }
    }
    if (!roleIsAllowed) {
      return AuthorizationDecision.DENY
    } else {
      return AuthorizationDecision.ALLOW
    }
  }
}
