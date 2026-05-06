import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateFlashcardsTable1742740923150 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "flashcards",
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
                        name: "front_text",
                        type: "text",
                        isNullable: false,
                    },
                    {
                        name: "back_text",
                        type: "text",
                        isNullable: false,
                    },
                    {
                        name: "image_url",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "audio_url",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        isNullable: false,
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                        isNullable: false,
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "flashcards",
            new TableForeignKey({
                columnNames: ["deck_id"],
                referencedTableName: "decks",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("flashcards");
    }
}
