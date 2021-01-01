import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatePostInstanceAgain1609539154653 implements MigrationInterface {
    name = 'UpdatePostInstanceAgain1609539154653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "publicationDate"`);
        await queryRunner.query(`ALTER TABLE "post" ADD "publicationDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "publicationDate"`);
        await queryRunner.query(`ALTER TABLE "post" ADD "publicationDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

}
