import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateClassFoldersTable1742740500000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "class_folders",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "class_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "folder_id",
                        type: "uuid",
                        isNullable: false,
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "class_folders",
            new TableForeignKey({
                columnNames: ["class_id"],
                referencedTableName: "classes",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "class_folders",
            new TableForeignKey({
                columnNames: ["folder_id"],
                referencedTableName: "folders",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("class_folders");
    }
}
