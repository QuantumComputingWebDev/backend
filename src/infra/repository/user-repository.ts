import { ServiceClient } from "@grpc/grpc-js/build/src/make-client";
import { inject, injectable } from "inversify";
import { Repository } from "typeorm";
import { NotFoundError } from "../../application/error/errors";
import { User, UserRepository } from "../../domain/user";

@injectable()
export class UserRepositoryImpl extends UserRepository {
    @inject('dbUserRepository')
    dbRepository: Repository<User>;


    async findUserByID(id: number): Promise<User> {
        const user = await this.dbRepository.findOne(id);
        if (user) return user;
        throw new NotFoundError('user not found');
    }
    async findUserByUsername(username: string): Promise<User> {
        const user = await this.dbRepository.findOne({ username });
        if (!user) throw new NotFoundError('user not found');
        return user;
    }
    async save(user: User): Promise<User> {
        const userSave = this.dbRepository.save(user);
        return userSave;
    }

}