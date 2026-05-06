import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Class } from './index';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({ type: 'varchar', unique: true })
    email!: string;

    @Column({ type: 'text' })
    password!: string;

    @Column({ type: 'varchar', unique: true, nullable: true })
    username?: string;

    @Column({ type: 'date', nullable: true })
    dob?: Date;

    @Column({ type: 'text', nullable: true })
    avatar_url?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @OneToMany(() => Class, (classEntity: Class) => classEntity.author)
    classes?: Class[];
}
