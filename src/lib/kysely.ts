import { ColumnType, Generated, Kysely } from "kysely";
import { PlanetScaleDialect } from 'kysely-planetscale'
// import {fetch} from 'undici'

declare type Timestamp = ColumnType<Date, Date | string, Date | string>;

declare interface ScougiTable {
  id: Generated<number>;
  year: string;
  trim: number;
  pages: number;
  preview: string;
  hidden: boolean;
  updatedAt: Timestamp;
}

declare interface ScougiPageTable {
  number: number;
  id: number;
  data: string;
}

declare interface ScougiPdfPageTable {
  number: number;
  id: number;
  data: string;
}

declare interface DB {
  Scougi: ScougiTable;
  ScougiPage: ScougiPageTable
  ScougiPdfPage: ScougiPdfPageTable
}

const db: Kysely<DB> = new Kysely<DB>({
  dialect: new PlanetScaleDialect({
    host: process.env.PLANETSCALE_DB_HOST,
    username: process.env.PLANETSCALE_DB_USERNAME,
    password: process.env.PLANETSCALE_DB_PASSWORD,
  }),
})

export default db;
