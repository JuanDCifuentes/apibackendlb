import {AUTHENTICATION_STRATEGY_NOT_FOUND, AuthenticateFn, AuthenticationBindings, USER_PROFILE_NOT_FOUND} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {FindRoute, InvokeMethod, InvokeMiddleware, ParseParams, Reject, RequestContext, Send, SequenceActions, SequenceHandler} from '@loopback/rest';

export class MySequence implements SequenceHandler {

  @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
  protected invokedMiddleware: InvokeMiddleware = () => false;

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
  ) { }

  async handle(context: RequestContext): Promise<void> {
    try {
      const {request, response} = context
      const finished = await this.invokedMiddleware(context);

      if (finished) {
        return;
      }

      const route = this.findRoute(request);

      await this.authenticateRequest(request);

      const args = await this.parseParams(request, route)
      const result = await this.invoke(route, args)
      this.send(response, result);

    } catch (err) {

      if (
        err.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        err.code === USER_PROFILE_NOT_FOUND
      ) {
        Object.assign(err, {statusCode: 401})
      }
      this.reject(context, err);
      return;

    }
  }
}
