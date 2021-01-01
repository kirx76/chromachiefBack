import {MigrationInterface, QueryRunner} from "typeorm";

export class addShortDescToPost1609510672598 implements MigrationInterface {
    name = 'addShortDescToPost1609510672598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "description" character varying(50) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "description"`);
    }

}
