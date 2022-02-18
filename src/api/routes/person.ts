import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from "fastify";
import { UnauthorizedError } from "../../application/error/errors";
import { MediaApplicationService } from "../../application/media-application-service";
import { PersonApplicationService } from "../../application/person-application-service";
import { Position } from "../../domain/person";

export function personRoutesPlugin() {
    return async (app: FastifyInstance, options: FastifyPluginOptions, done: HookHandlerDoneFunction) => {
        app.get('/', async (request, reply) => {
            if (!request.identity || !request.identity.isAuthenticated || !request.identity.user) {
                throw new UnauthorizedError("identity invalid!");
            }
            const service = request.container.get<PersonApplicationService>(PersonApplicationService);
            const people = await service.getAll();
            reply.status(200).send(people);
        });
        app.post<{ Body: { name: string, title: string, about: string, isSpeaker: boolean, photoId: number, posterId: number } }>('/', async (request, reply) => {
            if (!request.identity || !request.identity.isAuthenticated || !request.identity.user) {
                throw new UnauthorizedError("identity invalid!");
            }
            const service = request.container.get<PersonApplicationService>(PersonApplicationService);
            const mediaService = request.container.get<MediaApplicationService>(MediaApplicationService);
            let person = await service.create(request.body.isSpeaker ? Position.Speaker : Position.Staff, request.body.name);
            person.title = request.body.title;
            person.about = request.body.about;
            if (request.body.photoId) {
                const photo = await mediaService.get(request.body.photoId);
                person.photo = photo;
            }
            if (request.body.posterId) {
                const photo = await mediaService.get(request.body.posterId);
                person.photo = photo;
            }
            person = await service.update(person);
            reply.status(200).send(person);
        });
        app.get('/speaker', async (request, reply) => {
            if (!request.identity || !request.identity.isAuthenticated || !request.identity.user) {
                throw new UnauthorizedError("identity invalid!");
            }
            const service = request.container.get<PersonApplicationService>(PersonApplicationService);
            const people = await service.getAllByType(Position.Speaker);
            reply.status(200).send(people);
        });
        app.get('/staff', async (request, reply) => {
            if (!request.identity || !request.identity.isAuthenticated || !request.identity.user) {
                throw new UnauthorizedError("identity invalid!");
            }
            const service = request.container.get<PersonApplicationService>(PersonApplicationService);
            const people = await service.getAllByType(Position.Staff);
            reply.status(200).send(people);
        });
        app.get<{ Params: { id: number } }>('/:id', { schema: { params: { id: { type: 'number' } } } }, async (request, reply) => {
            if (!request.identity || !request.identity.isAuthenticated || !request.identity.user) {
                throw new UnauthorizedError("identity invalid!");
            }
            const service = request.container.get<PersonApplicationService>(PersonApplicationService);
            const person = await service.get(request.params.id);
            reply.status(200).send(person);
        });
        app.put<{ Params: { id: number }, Body: { title: string, about: string, photoId: number, posterId: number } }>('/:id', { schema: { params: { id: { type: 'number' } } } }, async (request, reply) => {
            if (!request.identity || !request.identity.isAuthenticated || !request.identity.user) {
                throw new UnauthorizedError("identity invalid!");
            }
            const service = request.container.get<PersonApplicationService>(PersonApplicationService);
            const mediaService = request.container.get<MediaApplicationService>(MediaApplicationService);
            let person = await service.get(request.params.id);
            if (request.body.title) person.title = request.body.title;
            if (request.body.about) person.about = request.body.about;
            if (request.body.photoId) {
                const photo = await mediaService.get(request.body.photoId);
                person.photo = photo;
            }
            if (request.body.posterId) {
                const photo = await mediaService.get(request.body.posterId);
                person.photo = photo;
            }
            person = await service.update(person);
            reply.status(200).send(person);
        });
        app.delete<{ Params: { id: number } }>('/:id', { schema: { params: { id: { type: 'number' } } } }, async (request, reply) => {
            if (!request.identity || !request.identity.isAuthenticated || !request.identity.user) {
                throw new UnauthorizedError("identity invalid!");
            }
            const service = request.container.get<PersonApplicationService>(PersonApplicationService);
            const person = await service.get(request.params.id);
            await service.delete(person);
            reply.status(200).send(person);
        });
        done();
    };
}