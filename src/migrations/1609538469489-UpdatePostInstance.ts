import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatePostInstance1609538469489 implements MigrationInterface {
    name = 'UpdatePostInstance1609538469489'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "post"."publicationDate" IS NULL`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "publicationDate" SET DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "publicationDate" SET DEFAULT '2021-01-01 21:58:11.739773'`);
        await queryRunner.query(`COMMENT ON COLUMN "post"."publicationDate" IS NULL`);
    }

}
