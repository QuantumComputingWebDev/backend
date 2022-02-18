import { injectable } from "inversify";
import { Person, Position } from "../domain/person";

@injectable()
export abstract class PersonApplicationService {
    abstract create(type: Position, name: string): Promise<Person>;
    abstract get(id: number): Promise<Person>;
    abstract getAll(): Promise<Person[]>;
    abstract getAllByType(type: Position): Promise<Person[]>;
    abstract update(person: Person): Promise<Person>;
    abstract delete(person: Person): Promise<void>;
}