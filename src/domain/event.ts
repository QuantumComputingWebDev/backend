import { injectable } from "inversify";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Media } from "./media";
import { Person } from "./person";

@Entity()
export class EventDay {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    date: string;

    @OneToMany(() => EventSpeech, e => e.day)
    @JoinColumn()
    speechs: EventSpeech[];

    @OneToOne(() => Media)
    poster: Media;
}

@Entity()
export class EventSpeech {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => EventDay, e => e.speechs)
    day: EventDay;

    @Column()
    title: string;

    @Column()
    startTime: string;

    @Column()
    endTime: string;

    @ManyToOne(() => Person)
    @JoinColumn()
    speaker: Person;

    @OneToOne(() => Media)
    poster: Media;
}

@injectable()
export abstract class EventRepository {
    abstract findSpeechById(id: number): Promise<EventSpeech>;
    abstract getAll(): Promise<EventDay[]>;
    abstract getByDay(date: Date): Promise<EventDay>;
    abstract saveDay(event: EventDay): Promise<EventDay>;
    abstract saveSpeech(event: EventSpeech): Promise<EventSpeech>;
    abstract delete(event: EventDay | EventSpeech): Promise<void>;
}