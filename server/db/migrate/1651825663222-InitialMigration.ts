import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialMigration1651825663222 implements MigrationInterface {
  name = 'InitialMigration1651825663222'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "premises" ("id" SERIAL NOT NULL, "apCode" character varying NOT NULL, "name" character varying(100) NOT NULL, "apArea" character varying NOT NULL, "probationRegion" character varying NOT NULL, "localAuthorityArea" character varying NOT NULL, "town" character varying NOT NULL, "address" character varying NOT NULL, "postcode" character varying NOT NULL, "lat" double precision, "lon" double precision, "location" geometry(Point,4326), CONSTRAINT "PK_3dee03a72594bf5a68ff3f7c933" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_47fcfb7bdc656ea369d4a16af1" ON "premises" ("apCode") `)
    await queryRunner.query(`CREATE INDEX "IDX_d300ca57a2f6a44b869a813c78" ON "premises" ("name") `)
    await queryRunner.query(`CREATE INDEX "IDX_1a89225ec6844f11a27e3bfb6a" ON "premises" USING GiST ("location") `)
    await queryRunner.query(
      `CREATE TABLE "bookings" ("id" SERIAL NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "bedId" integer, CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "beds" ("id" SERIAL NOT NULL, "bedCode" character varying NOT NULL, "gender" character varying(10) NOT NULL, "iap" boolean, "pipe" boolean, "enhanced_security" boolean, "step_free_access_to_communal_areas" boolean, "lift_or_stairlift" boolean, "premisesId" integer, CONSTRAINT "PK_2212ae7113d85a70dc65983e742" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3e58eb506a08193300839f3f8e" ON "beds" ("bedCode") `)
    await queryRunner.query(`CREATE INDEX "IDX_af2718efefbfba955c4d54d7a0" ON "beds" ("gender") `)
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_2fe939c8efe2bff6e501f797b06" FOREIGN KEY ("bedId") REFERENCES "beds"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "beds" ADD CONSTRAINT "FK_241c23a4622115e8cc12a678eb7" FOREIGN KEY ("premisesId") REFERENCES "premises"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "beds" DROP CONSTRAINT "FK_241c23a4622115e8cc12a678eb7"`)
    await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_2fe939c8efe2bff6e501f797b06"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_af2718efefbfba955c4d54d7a0"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_3e58eb506a08193300839f3f8e"`)
    await queryRunner.query(`DROP TABLE "beds"`)
    await queryRunner.query(`DROP TABLE "bookings"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_1a89225ec6844f11a27e3bfb6a"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_d300ca57a2f6a44b869a813c78"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_47fcfb7bdc656ea369d4a16af1"`)
    await queryRunner.query(`DROP TABLE "premises"`)
  }
}
