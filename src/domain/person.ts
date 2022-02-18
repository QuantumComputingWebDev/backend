import { injectable } from "inversify";
import { Column, Entity, IsNull, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Media } from './media';

export enum Position {
    Speaker,
    Staff
}

@Entity()
export class Person {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToOne(() => Media, { nullable: true })
    @JoinColumn()
    photo: Media;

    @OneToOne(() => Media, { nullable: true })
    @JoinColumn()
    poster: Media;

    @Column({ nullable: true })
    title: string;

    @Column({ nullable: true })
    about: string;

    @Column({
        type: "enum",
        enum: Position,
        default: Position.Staff
    })
    position: Position;
}

@injectable()
export abstract class PersonRepository {
    abstract findById(id: number): Promise<Person>;
    abstract getAll(): Promise<Person[]>;
    abstract getAllByPosition(type: Position): Promise<Person[]>;
    abstract save(person: Person): Promise<Person>;
    abstract delete(person: Person): Promise<void>;
}