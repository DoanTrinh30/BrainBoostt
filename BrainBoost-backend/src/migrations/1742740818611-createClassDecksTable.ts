import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateClassDecksTable1742740818611 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "class_decks",
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
                        name: "deck_id",
                        type: "uuid",
                        isNullable: false,
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "class_decks",
            new TableForeignKey({
                columnNames: ["class_id"],
                referencedTableName: "classes",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "class_decks",
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
        await queryRunner.dropTable("class_decks");
    }
}
