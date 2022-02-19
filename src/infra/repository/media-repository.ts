import { Media, MediaRepository, MediaType } from "../../domain/media";
import { inject, injectable } from "inversify";
import { Repository } from "typeorm";
import { NotFoundError } from "../../application/error/errors";

@injectable()
export class MediaRepositoryImpl extends MediaRepository {
    @inject('dbMediaRepository')
    dbRepository: Repository<Media>;

    async findById(id: number): Promise<Media> {
        const media = await this.dbRepository.findOne({
            where: {
                id: id
            }
        });
        if (media) {
            return media;
        }
        throw new NotFoundError('media not found');
    }

    async getAll(): Promise<Media[]> {
        const medias = (await this.dbRepository.find())
        return medias;
    }

    async getGallery(): Promise<Media[]> {
        const medias = (await this.dbRepository.find({
            where: {
                showInGallery: true
            }
        }))
        return medias;
    }

    async getAllByType(type: MediaType): Promise<Media[]> {
        const medias = (await this.dbRepository.find({
            where: {
                type: type
            }
        }))
        return medias;
    }

    async getAllGalleryByType(type: MediaType): Promise<Media[]> {
        const medias = (await this.dbRepository.find({
            where: {
                showInGallery: true,
                type: type
            }
        }))
        return medias;
    }

    async save(media: Media): Promise<Media> {
        const mediaSave = await this.dbRepository.save(media);
        return mediaSave;
    }

    async delete(media: Media): Promise<void> {
        await this.dbRepository.delete(media);
    }

}