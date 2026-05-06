import { Class } from '../entities';
import { BaseRepository } from './BaseRepository';

export class FolderRepository extends BaseRepository<Class> {
    constructor() {
        super(Class);
    }

    async findByEmail(email: string, limit: number = 10): Promise<Class[]> {
        return this.findByRelation('author', { email }, { take: limit });
    }

    async findByUserId(id: number, limit: number | 'all' = 10): Promise<Class[]> {
        if (limit === 'all') return this.findByRelation('author', { id });
        return this.findByRelation('author', { id }, { take: limit });
    }

    async countByUserId(userId: number): Promise<number> {
        return this.repository.createQueryBuilder('class')
            .where('class.author_id = :userId', { userId })
            .getCount();
    }
}
