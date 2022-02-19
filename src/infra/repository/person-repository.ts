import { inject, injectable } from "inversify";
import { Repository } from "typeorm";
import { NotFoundError } from "../../application/error/errors";
import { Person, PersonRepository, Position } from "../../domain/person";

@injectable()
export class PersonRepositoryImpl extends PersonRepository {
    @inject('dbPersonRepository')
    dbRepository: Repository<Person>;

    async findById(id: number): Promise<Person> {
        const person = await this.dbRepository.findOne({
            where: {
                id: id
            },
            relations: ['photo', 'poster']
        });
        if (person) return person;
        throw new NotFoundError('person not found');
    }

    async getAll(): Promise<Person[]> {
        const people = await this.dbRepository.find({
            relations: ['photo', 'poster']
        });
        return people;
    }

    async getAllByPosition(type: Position): Promise<Person[]> {
        const people = await this.dbRepository.find({
            where: {
                position: type
            },
            relations: ['photo', 'poster']
        });
        return people;
    }

    async save(person: Person): Promise<Person> {
        const personSave = await this.dbRepository.save(person);
        return personSave;
    }

    async delete(person: Person): Promise<void> {
        await this.dbRepository.delete(person);
    }
}