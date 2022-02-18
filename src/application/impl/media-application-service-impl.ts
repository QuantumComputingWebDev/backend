import { inject, injectable } from "inversify";
import { MediaType, Media, MediaRepository } from "../../domain/media";
import { MediaApplicationService } from "../media-application-service";

@injectable()
export class MediaApplicationServiceImpl extends MediaApplicationService {
    @inject(MediaRepository)
    repo: MediaRepository;

    async create(type: MediaType, path: string, showInGallery: boolean): Promise<Media> {
        let media = new Media();
        media.type = type;
        media.path = path;
        media.showInGallery = showInGallery;
        return await this.repo.save(media);
    }

    async get(id: number): Promise<Media> {
        const media = await this.repo.findById(id);
        return media;
    }
    
    async getAll(): Promise<Media[]> {
        const medias = await this.repo.getAll();
        return medias;
    }

    async getGallery(): Promise<Media[]> {
        const medias = await this.repo.getGallery();
        return medias;
    }

    async getAllByType(type: MediaType): Promise<Media[]> {
        const medias = await this.repo.getAllByType(type);
        return medias;
    }

    async getAllGalleryByType(type: MediaType): Promise<Media[]> {
        const medias = await this.repo.getAllGalleryByType(type);
        return medias;
    }

    async delete(media: Media): Promise<void> {
        await this.repo.delete(media);
    }
}