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
    speechs: EventSpeech[];

    @ManyToOne(() => Media, { nullable: true })
    @JoinColumn()
    poster: Media;

    @Column({ default: false })
    isDeleted: boolean;
}

@Entity()
export class EventSpeech {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => EventDay, e => e.speechs, { cascade: false, onDelete: 'SET NULL', onUpdate: 'SET NULL', nullable: true })
    day: EventDay;

    @Column()
    title: string;

    @Column({ nullable: true })
    startTime: string;

    @Column({ nullable: true })
    endTime: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    briefDescription: string;

    @ManyToOne(() => Person)
    @JoinColumn()
    speaker: Person;

    @ManyToOne(() => Media, { nullable: true })
    @JoinColumn()
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