import { inject, injectable } from "inversify";
import { Position, Person, PersonRepository } from "../../domain/person";
import { PersonApplicationService } from "../person-application-service";

@injectable()
export class PersonApplicationServiceImpl extends PersonApplicationService {
    @inject(PersonRepository)
    repo: PersonRepository;

    async create(type: Position, name: string): Promise<Person> {
        const person = new Person();
        person.name = name;
        person.position = type;
        return await this.repo.save(person);
    }

    async get(id: number): Promise<Person> {
        return await this.repo.findById(id);
    }

    async getAll(): Promise<Person[]> {
        return await this.repo.getAll();
    }

    async getAllByType(type: Position): Promise<Person[]> {
        return await this.repo.getAllByPosition(type);
    }

    async update(person: Person): Promise<Person> {
        return await this.repo.save(person);
    }

    async delete(person: Person): Promise<void> {
        await this.repo.delete(person);
    }

}