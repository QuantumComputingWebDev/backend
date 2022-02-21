import { ServiceClient } from "@grpc/grpc-js/build/src/make-client";
import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from "fastify";
import { RedisClientType } from "redis";
import { TooManyRequestsError } from "../../application/error/errors";

export function rateLimiterPlugin(server: FastifyInstance) {
    return async (app: FastifyInstance, _options: FastifyPluginOptions, done: HookHandlerDoneFunction) => {
        server.addHook('onRequest', async (request, reply) => {
            if (!request.url.includes('auth')) {
                done();
                return;
            }
            const quota: number = +(process.env.X_QUOTA || 5)
            reply.header('x-quota', quota);
            const cacheClient = request.container.get<RedisClientType<any, any>>('cacheClient');
            let lastAccess: Date = new Date();
            let accessCount: number = 0;
            try {
                lastAccess = new Date(await cacheClient.get(request.ip + '-la') as string);
                accessCount = Number(await cacheClient.get(request.ip + '-ac'));
            } catch (e) { }
            const diff: number = (new Date().getTime() - lastAccess.getTime()) / 1000
            const timePerQuota: number = Math.floor((60 * 60) / quota)
            accessCount = Math.max(accessCount - Math.floor(diff / timePerQuota) + 1, 1)
            await cacheClient.set(request.ip + '-ac', accessCount <= quota ? accessCount : quota);
            reply.header('x-remaining-request', Math.max(quota - accessCount, 0))
            await cacheClient.set(request.ip + '-la', new Date().toISOString());
        });
        server.addHook('onRequest', async (request, reply) => {
            if (reply.getHeader('x-remaining-request') == '0') {
                throw new TooManyRequestsError('too many requests to handle');
            }
        })
        done();
    }
}