import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from "fastify";
import { UnauthorizedError } from "../../application/error/errors";
import { UserApplicationService } from "../../application/user-application-service";

export function authRoutesPlugin() {
    return async (app: FastifyInstance, options: FastifyPluginOptions, done: HookHandlerDoneFunction) => {
        app.post<{ Body: { username: string, password: string, name: string } }>('/signup', {
            schema: {
                body: {
                    username: { type: 'string' }, password: { type: 'string' }, name: { type: 'string' }
                }
            }
        }, async (request, reply) => {
            const service = request.container.get<UserApplicationService>(UserApplicationService);
            const token = await service.signup(request.body.username, request.body.password, request.body.name);
            reply.setCookie('auth', token);
            reply.status(200).send(token);
        });

        app.post<{ Body: { username: string, password: string } }>('/login', {
            schema: {   
                body: {
                    username: { type: 'string' }, password: { type: 'string' }
                }
            }
        }, async (request, reply) => {
            const service = request.container.get<UserApplicationService>(UserApplicationService);
            const token = await service.login(request.body.username, request.body.password);
            reply.setCookie('auth', token);
            reply.status(200).send(token);
        });

        app.get('/logout', (request, reply) => {
            if (!request.identity || !request.identity.isAuthenticated || !request.identity.user) {
                throw new UnauthorizedError("identity invalid!");
            }
            reply.clearCookie('auth').status(200).send('logged out');
        });
        done();
    };
}