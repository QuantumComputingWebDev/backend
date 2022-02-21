import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from "fastify";
import { UnauthorizedError } from "../../application/error/errors";
import { EventApplicationService } from "../../application/event-application-service";
import { PersonApplicationServiceImpl } from "../../application/impl/person-application-service-impl";
import { MediaApplicationService } from "../../application/media-application-service";
import { PersonApplicationService } from "../../application/person-application-service";

export function eventRoutesPlugin() {
    return async (app: FastifyInstance, options: FastifyPluginOptions, done: HookHandlerDoneFunction) => {
        app.get('/', async (request, reply) => {
            const service = request.container.get<EventApplicationService>(EventApplicationService);
            const events = await service.getAll();
            reply.status(200).send(events);
        });
        app.get<{ Params: { year: number, month: number, day: number } }>('/day/:year/:month/:day', { schema: { params: { year: { type: 'number' }, month: { type: 'number' }, day: { type: 'number' } } } }, async (request, reply) => {
            const service = request.container.get<EventApplicationService>(EventApplicationService);
            const events = await service.getDay(new Date(request.params.year, request.params.month, request.params.day));
            reply.status(200).send(events);
        });
        app.get<{ Params: { id: number } }>('/speech/:id', { schema: { params: { id: { type: 'number' } } } }, async (request, reply) => {
            const service = request.container.get<EventApplicationService>(EventApplicationService);
            const events = await service.getSpeech(request.params.id);
            reply.status(200).send(events);
        });
        app.post<{ Params: { year: number, month: number, day: number }, Body: { posterId: number } }>('/day/:year/:month/:day', async (request, reply) => {
            if (!request.identity || !request.identity.isAuthenticated || !request.identity.user) {
                throw new UnauthorizedError("identity invalid!");
            }
            const service = request.container.get<EventApplicationService>(EventApplicationService);
            const mediaService = request.container.get<MediaApplicationService>(MediaApplicationService);
            let event = await service.createDay(new Date(request.params.year, request.params.month, request.params.day));
            if (request.body.posterId) {
                const photo = await mediaService.get(request.body.posterId);
                event.poster = photo;
            }
            event = await service.updateDay(event);
            reply.status(200).send(event);
        });
        app.post<{ Params: { year: number, month: number, day: number }, Body: { posterId: number, speakerId: number, title: string, startTime: string, endTime: string } }>('/speech/:year/:month/:day', async (request, reply) => {
            if (!request.identity || !request.identity.isAuthenticated || !request.identity.user) {
                throw new UnauthorizedError("identity invalid!");
            }
            const service = request.container.get<EventApplicationService>(EventApplicationService);
            const mediaService = request.container.get<MediaApplicationService>(MediaApplicationService);
            const personService = request.container.get<PersonApplicationService>(PersonApplicationService);
            const day = await service.getDay(new Date(request.params.year, request.params.month, request.params.day));
            const speaker = await personService.get(request.body.speakerId);
            let event = await service.createSpeech(request.body.title, day, request.body.startTime, request.body.endTime, speaker);
            if (request.body.posterId) {
                const photo = await mediaService.get(request.body.posterId);
                event.poster = photo;
            }
            event = await service.updateSpeech(event);
            reply.status(200).send(event);
        });
        app.put<{ Params: { year: number, month: number, day: number }, Body: { posterId: number } }>('/day/:year/:month/:day', async (request, reply) => {
            if (!request.identity || !request.identity.isAuthenticated || !request.identity.user) {
                throw new UnauthorizedError("identity invalid!");
            }
            const service = request.container.get<EventApplicationService>(EventApplicationService);
            const mediaService = request.container.get<MediaApplicationService>(MediaApplicationService);
            let event = await service.getDay(new Date(request.params.year, request.params.month, request.params.day));
            if (request.body.posterId) {
                const photo = await mediaService.get(request.body.posterId);
                event.poster = photo;
            }
            event = await service.updateDay(event);
            reply.status(200).send(event);
        });
        app.put<{ Params: { id: number }, Body: { posterId: number, speakerId: number, title: string, startTime: string, endTime: string } }>('/speech/:id', async (request, reply) => {
            if (!request.identity || !request.identity.isAuthenticated || !request.identity.user) {
                throw new UnauthorizedError("identity invalid!");
            }
            const service = request.container.get<EventApplicationService>(EventApplicationService);
            const mediaService = request.container.get<MediaApplicationService>(MediaApplicationService);
            const personService = request.container.get<PersonApplicationService>(PersonApplicationService);
            let event = await service.getSpeech(request.params.id);
            if (request.body.posterId) {
                const photo = await mediaService.get(request.body.posterId);
                event.poster = photo;
            }
            if (request.body.speakerId) {
                const speaker = await personService.get(request.body.speakerId);
                event.speaker = speaker;
            }
            if (request.body.title) event.title = request.body.title;
            if (request.body.startTime) event.startTime = request.body.startTime;
            if (request.body.endTime) event.startTime = request.body.endTime;
            event = await service.updateSpeech(event);
            reply.status(200).send(event);
        });
        app.delete<{ Params: { year: number, month: number, day: number } }>('/day/:year/:month/:day', { schema: { params: { year: { type: 'number' }, month: { type: 'number' }, day: { type: 'number' } } } }, async (request, reply) => {
            if (!request.identity || !request.identity.isAuthenticated || !request.identity.user) {
                throw new UnauthorizedError("identity invalid!");
            }
            const service = request.container.get<EventApplicationService>(EventApplicationService);
            const event = await service.getDay(new Date(request.params.year, request.params.month, request.params.day));
            console.log(event)
            await service.delete(event);
            reply.status(200).send(event);
        });
        app.delete<{ Params: { id: number } }>('/speech/:id', { schema: { params: { id: { type: 'number' } } } }, async (request, reply) => {
            if (!request.identity || !request.identity.isAuthenticated || !request.identity.user) {
                throw new UnauthorizedError("identity invalid!");
            }
            const service = request.container.get<EventApplicationService>(EventApplicationService);
            const event = await service.getSpeech(request.params.id);
            await service.delete(event);
            reply.status(200).send(event);
        });
        done();
    };
}