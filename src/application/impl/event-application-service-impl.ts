import { inject, injectable } from "inversify";
import { EventDay, EventRepository, EventSpeech } from "../../domain/event";
import { Person } from "../../domain/person";
import { EventApplicationService } from "../event-application-service";
import { PersonApplicationService } from "../person-application-service";

@injectable()
export class EventApplicationServiceImpl extends EventApplicationService {
    @inject(EventRepository)
    repo: EventRepository;

    async createDay(date: Date): Promise<EventDay> {
        const day = new EventDay();
        day.date = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        return await this.repo.saveDay(day);
    }

    async createSpeech(title: string, day: EventDay, startTime: string, endTime: string, speaker: Person): Promise<EventSpeech> {
        const speech = new EventSpeech();
        speech.title = title;
        speech.day = day;
        speech.startTime = startTime;
        speech.endTime = endTime;
        speech.speaker = speaker;
        return await this.repo.saveSpeech(speech);
    }

    async getSpeech(id: number): Promise<EventSpeech> {
        return await this.repo.findSpeechById(id);
    }

    async getDay(date: Date): Promise<EventDay> {
        return await this.repo.getByDay(date);
    }

    async getAll(): Promise<EventDay[]> {
        return await this.repo.getAll()
    }

    async updateDay(event: EventDay): Promise<EventDay> {
        return await this.repo.saveDay(event);
    }

    async updateSpeech(event: EventSpeech): Promise<EventSpeech> {
        return await this.repo.saveSpeech(event);
    }

    async delete(event: EventDay | EventSpeech): Promise<void> {
        return await this.repo.delete(event);
    }

}