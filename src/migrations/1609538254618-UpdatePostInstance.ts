import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatePostInstance1609538254618 implements MigrationInterface {
    name = 'UpdatePostInstance1609538254618'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "publicationDate" TIMESTAMP NOT NULL DEFAULT 'NOW()'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "publicationDate"`);
    }

}
