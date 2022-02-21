import { inject, injectable } from "inversify";
import { Repository } from "typeorm";
import { NotFoundError } from "../../application/error/errors";
import { EventDay, EventRepository, EventSpeech } from "../../domain/event";

@injectable()
export class EventRepositoryImpl extends EventRepository {
    @inject('dbEventDayRepository')
    dbDayRepository: Repository<EventDay>;

    @inject('dbEventSpeechRepository')
    dbSpeechRepository: Repository<EventSpeech>;

    async findSpeechById(id: number): Promise<EventSpeech> {
        const event = await this.dbSpeechRepository.findOne({
            where: {
                id: id
            },
            relations: ['speaker', 'poster']
        });
        if (event) return event;
        throw new NotFoundError('event speech not found');
    }

    async findDayById(id: number): Promise<EventDay> {
        const event = await this.dbDayRepository.findOne({
            where: {
                id: id
            },
            relations: ['speechs', 'poster', 'speechs.speaker', 'speechs.poster']
        });
        if (event) return event;
        throw new NotFoundError('event day not found');
    }

    async getAll(): Promise<EventDay[]> {
        const events = await this.dbDayRepository.find({
            where: {
                isDeleted: false
            },
            relations: ['speechs', 'poster', 'speechs.speaker', 'speechs.poster']
        });
        return events;
    }

    async getByDay(date: Date): Promise<EventDay> {
        const events = await this.dbDayRepository.findOne({
            where: {
                date: `= ${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
                isDeleted: false
            },
            relations: ['speechs', 'poster', 'speechs.speaker', 'speechs.poster']
        });
        if (events) return events;
        throw new NotFoundError('event day not found');
    }

    async saveDay(event: EventDay): Promise<EventDay> {
        const eventSave = await this.dbDayRepository.save(event);
        return eventSave;
    }

    async saveSpeech(event: EventSpeech): Promise<EventSpeech> {
        const eventSave = await this.dbSpeechRepository.save(event);
        return eventSave;
    }

    async delete(event: EventDay | EventSpeech): Promise<void> {
        if (event instanceof EventDay) {
            event.isDeleted = true;
            await this.dbDayRepository.save(event);
        } else {
            await this.dbSpeechRepository.delete(event);
        }
    }
}