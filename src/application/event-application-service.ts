import { injectable } from 'inversify'
import { EventDay, EventSpeech } from '../domain/event';
import { Person } from '../domain/person';

@injectable()
export abstract class EventApplicationService {
    abstract createDay(date: Date): Promise<EventDay>;
    abstract createSpeech(title: string, day: EventDay, startTime: string, endTime: string, speaker: Person): Promise<EventSpeech>;
    abstract findSpeech(id: number): Promise<EventSpeech>;
    abstract findDay(id: number): Promise<EventDay>;
    abstract getDay(date: Date): Promise<EventDay>;
    abstract getAll(): Promise<EventDay[]>;
    abstract updateDay(event: EventDay): Promise<EventDay>;
    abstract updateSpeech(event: EventSpeech): Promise<EventSpeech>;
    abstract delete(event: EventDay | EventSpeech): Promise<void>;
}