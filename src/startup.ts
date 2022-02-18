import * as dotenv from "dotenv";
import fastify from 'fastify';
import fastifyCookie from "fastify-cookie";
import fastifyMultipart from "fastify-multipart";
import { Container } from 'inversify';
import { Connection, createConnection } from 'typeorm';
import { routesPlugin } from './api/routes';
import { MediaApplicationServiceImpl } from './application/impl/media-application-service-impl';
import { UserApplicationServiceImpl } from "./application/impl/user-application-service-impl";
import { MediaApplicationService } from './application/media-application-service';
import { UserApplicationService } from "./application/user-application-service";
import { Media, MediaRepository } from './domain/media';
import { User, UserRepository } from './domain/user';
import { MediaRepositoryImpl } from './infra/repository/media-repository';
import { UserRepositoryImpl } from './infra/repository/user-repository';
import { FastifyInstance } from "fastify";
import { errorHandler } from "./infra/plugin/error-handler";
import { EventDay, EventRepository, EventSpeech } from "./domain/event";
import { EventRepositoryImpl } from "./infra/repository/event-repository";
import { Person, PersonRepository } from "./domain/person";
import { PersonRepositoryImpl } from "./infra/repository/person-repository";
import { EventApplicationService } from "./application/event-application-service";
import { EventApplicationServiceImpl } from "./application/impl/event-application-service-impl";
import { PersonApplicationService } from "./application/person-application-service";
import { PersonApplicationServiceImpl } from "./application/impl/person-application-service-impl";
import { authPlugin } from "./infra/plugin/auth";

dotenv.config({ path: '.env' });
createConnection().then(connection => start(connection));

function start(connection: Connection) {
    const server = fastify({ logger: true, ignoreTrailingSlash: true });
    server.register(fastifyCookie);
    server.register(fastifyMultipart)
    bindContainer(connection, server);
    server.register(routesPlugin());
    server.register(authPlugin(server))
    server.setErrorHandler(errorHandler);
    const port = process.env.BACKEND_PORT || 8000;
    server.listen(port);
}

function bindContainer(connection: Connection, server: FastifyInstance) {
    const container = new Container();
    container.bind('dbMediaRepository').toConstantValue(connection.getRepository(Media));
    container.bind('dbUserRepository').toConstantValue(connection.getRepository(User));
    container.bind('dbPersonRepository').toConstantValue(connection.getRepository(Person));
    container.bind('dbEventDayRepository').toConstantValue(connection.getRepository(EventDay));
    container.bind('dbEventSpeechRepository').toConstantValue(connection.getRepository(EventSpeech));
    container.bind(UserRepository).to(UserRepositoryImpl);
    container.bind(MediaRepository).to(MediaRepositoryImpl);
    container.bind(PersonRepository).to(PersonRepositoryImpl);
    container.bind(EventRepository).to(EventRepositoryImpl);
    container.bind(MediaApplicationService).to(MediaApplicationServiceImpl);
    container.bind(UserApplicationService).to(UserApplicationServiceImpl);
    container.bind(PersonApplicationService).to(PersonApplicationServiceImpl);
    container.bind(EventApplicationService).to(EventApplicationServiceImpl);
    server.addHook('onRequest', async (req) => {
        req.container = container;
    });
}
