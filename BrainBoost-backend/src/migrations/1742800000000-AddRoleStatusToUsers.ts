import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddRoleStatusToUsers1742800000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'users',
            new TableColumn({
                name: 'role',
                type: 'varchar',
                default: "'student'",
                isNullable: false,
            })
        );

        await queryRunner.addColumn(
            'users',
            new TableColumn({
                name: 'status',
                type: 'varchar',
                default: "'active'",
                isNullable: false,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'role');
        await queryRunner.dropColumn('users', 'status');
    }
}