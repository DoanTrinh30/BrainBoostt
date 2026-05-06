import { Deck } from '../entities';
import { BaseRepository } from './BaseRepository';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ILike, Not } from 'typeorm';

export class DeckRepository extends BaseRepository<Deck> {
    constructor() {
        super(Deck);
    }

    async findByEmail(email: string, limit: number = 10): Promise<Deck[]> {
        return this.findByRelation('author', { email }, { take: limit });
    }

    async findByUserId(id: number, limit: number | 'all' = 10): Promise<Deck[]> {
        const options = {
            relations: {
                author: true,
            },
            where: {
                author: { id },
            },
            select: {
                author: {
                    id: true,
                    email: true,
                    username: true,
                    avatar_url: true,
                },
            },
        };

        if (limit !== 'all') {
            return this.repository.find({
                ...options,
                take: limit,
            });
        }

        return this.repository.find(options);
    }

    async findById(id: string): Promise<Deck | null> {
        return this.repository.findOne({
            where: { id },
            relations: {
                author: true,
            },
            select: {
                author: {
                    id: true,
                    email: true,
                    username: true,
                    avatar_url: true,
                },
            },
        });
    }

    async update(id: string, data: QueryDeepPartialEntity<Deck>): Promise<Deck | null> {
        await this.repository.update(id, data);
        return this.findById(id);
    }

    async findByKeyword(keyword: string): Promise<Deck[]> {
        return this.repository.find({
            where: {
                name: ILike(`%${keyword}%`),
                visibility: Not('private'),
            },
            relations: {
                author: true,
            },
            select: {
                author: {
                    id: true,
                    email: true,
                    username: true,
                    avatar_url: true,
                },
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }
}
