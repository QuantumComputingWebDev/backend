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
        const event = await this.dbSpeechRepository.createQueryBuilder('event').where('event.id = :id', { id }).getOne();
        if (event) return event;
        throw new NotFoundError('event not found');
    }

    async getAll(): Promise<EventDay[]> {
        const events = await this.dbDayRepository.find();
        return events;
    }

    async getByDay(date: Date): Promise<EventDay> {
        const events = await this.dbDayRepository.findOne({
            where: {
                date: `= ${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
            }
        });
        if (events) return events;
        throw new NotFoundError('event not found');
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
            await this.dbDayRepository.delete(event);
        } else {
            await this.dbSpeechRepository.delete(event);
        }
    }
}