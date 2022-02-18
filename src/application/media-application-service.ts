import { injectable } from 'inversify'
import { Media, MediaType } from '../domain/media';

@injectable()
export abstract class MediaApplicationService {
    abstract create(type: MediaType, path: string, showInGallery: boolean): Promise<Media>;
    abstract get(id: number): Promise<Media>;
    abstract getAll(): Promise<Media[]>;
    abstract getGallery(): Promise<Media[]>;
    abstract getAllByType(type: MediaType): Promise<Media[]>;
    abstract getAllGalleryByType(type: MediaType): Promise<Media[]>;
    abstract delete(media: Media): Promise<void>;
}