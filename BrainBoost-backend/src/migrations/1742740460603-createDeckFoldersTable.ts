import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateDeckFoldersTable1742740460603 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "deck_folders",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "deck_id",
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
            "deck_folders",
            new TableForeignKey({
                columnNames: ["deck_id"],
                referencedTableName: "decks",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "deck_folders",
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
        await queryRunner.dropTable("deck_folders");
    }
}
