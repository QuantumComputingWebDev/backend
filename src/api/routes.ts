import { HookHandlerDoneFunction } from "fastify";
import { FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify";
import { authRoutesPlugin } from "./routes/auth";
import { eventRoutesPlugin } from "./routes/event";
import { mediaRoutesPlugin } from "./routes/media";
import { personRoutesPlugin } from "./routes/person";

export function routesPlugin() {
    return async (app: FastifyInstance, _options: FastifyPluginOptions, done: HookHandlerDoneFunction) => {
        app.register(authRoutesPlugin(), { prefix: 'auth/' });
        app.register(mediaRoutesPlugin(), { prefix: 'media/' });
        app.register(personRoutesPlugin(), { prefix: 'person/' });
        app.register(eventRoutesPlugin(), { prefix: 'event/' });
        done();
    };
}