import { injectable } from "inversify";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


export enum MediaType {
    Photo,
    Video
}

@Entity()
export class Media {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: MediaType,
        default: MediaType.Photo
    })
    type: MediaType;

    @Column('text')
    path: string;

    @Column()
    showInGallery: boolean;
}

@injectable()
export abstract class MediaRepository {
    abstract findById(id: number): Promise<Media>;
    abstract getAll(): Promise<Media[]>;
    abstract getGallery(): Promise<Media[]>;
    abstract getAllByType(type: MediaType): Promise<Media[]>;
    abstract getAllGalleryByType(type: MediaType): Promise<Media[]>;
    abstract save(media: Media): Promise<Media>;
    abstract delete(media: Media): Promise<void>;
}