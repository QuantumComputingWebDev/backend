import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from "fastify";
import { BadRequestError, UnauthorizedError } from "../../application/error/errors";
import { MediaApplicationService } from "../../application/media-application-service";
import fs from 'fs';
import util from 'util';
import { pipeline } from 'stream';
import { MediaType } from "../../domain/media";
const pump = util.promisify(pipeline);

export function mediaRoutesPlugin() {
    return async (app: FastifyInstance, options: FastifyPluginOptions, done: HookHandlerDoneFunction) => {
        app.get('/', async (request, reply) => {
            const service = request.container.get<MediaApplicationService>(MediaApplicationService);
            const medias = await service.getAll();
            reply.status(200).send(medias);
        });
        app.post<{ Querystring: { gallery: boolean } }>('/', async (request, reply) => {
            if (!request.identity || !request.identity.isAuthenticated || !request.identity.user) {
                throw new UnauthorizedError("identity invalid!");
            }
            const file = await request.file();
            if (!file) {
                throw new BadRequestError('invalid file');
            }
            console.log(file)
            await pump(file.file, fs.createWriteStream(`images/${new Date().toISOString}-${file.filename}`))
            const service = request.container.get<MediaApplicationService>(MediaApplicationService);
            const media = await service.create(file.mimetype == 'video/mp4' ? MediaType.Video : MediaType.Photo, `${new Date().toISOString}-${file.filename}`, request.query.gallery);
            reply.status(200).send(media);
        });
        app.get('/gallery', async (request, reply) => {
            const service = request.container.get<MediaApplicationService>(MediaApplicationService);
            const medias = await service.getGallery();
            reply.status(200).send(medias);
        });
        app.get<{ Params: { id: number } }>('/:id', { schema: { params: { id: { type: 'number' } } } }, async (request, reply) => {
            const service = request.container.get<MediaApplicationService>(MediaApplicationService);
            const media = await service.get(request.params.id);
            reply.status(200).send(media);
        });
        app.delete<{ Params: { id: number } }>('/:id', { schema: { params: { id: { type: 'number' } } } }, async (request, reply) => {
            if (!request.identity || !request.identity.isAuthenticated || !request.identity.user) {
                throw new UnauthorizedError("identity invalid!");
            }
            const service = request.container.get<MediaApplicationService>(MediaApplicationService);
            const media = await service.get(request.params.id);
            await service.delete(media);
            reply.status(200).send(media);
        });
        done();
    };
}